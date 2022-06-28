import React, { useEffect, useState, useContext } from 'react';
import {
  notification,
  Popover,
  Button,
  Spin,
  Modal,
  Card,
  Switch } from 'antd';

import './style.scss';
// import ArrowRightOutlined from '@ant-design/icons/ArrowRightOutlined';
import { LoadingOutlined, ArrowRightOutlined } from '@ant-design/icons';
import {
    getMaxMintableBalance,
    getMaxRedeemableBalance,
    getCommissionRateAndCurrency,
    convertAmount
} from '../../Lib/exchangeManagerHelper';
import { LargeNumber } from '../LargeNumber';
import InputWithCurrencySelector from '../Form/InputWithCurrencySelector';
// import ButtonPrimary from '../../atoms/ButtonPrimary/ButtonPrimary';
// import ButtonSecondary from '../../atoms/ButtonSecondary/ButtonSecondary';
// import ConfirmTransactionModal from '../../molecules/ConfirmTransactionModal/ConfirmTransactionModal';
// import { userAccountIsLoggedIn } from '../../../../api/helpers/userAccountHelper';
import { getExchangeMethod } from '../../Lib/exchangeHelper';
import {
  formatVisibleValue,
  formatValueToContract,
  formatValueWithContractPrecision,
  formatLocalMap2
} from '../../Lib/Formats';
// import { approveReserve } from '../../Lib/nodeManager/nodeManagerRRC20';
// import { approveMoCToken } from '../../Lib/nodeManager/nodeManagerBase';
import BigNumber from 'bignumber.js';
import MintModal from '../Modals/MintModal';
// import tokenPricesContainer from '../../../containers/tokenPricesContainer';
// import mocStateContainer from '../../../containers/mocStateContainer';
// import userStateContainer from '../../../containers/userStateContainer';
// import Card from '../../atoms/Card/Card';
// import Switch from '../../atoms/Switch/Switch';
import {useTranslation} from "react-i18next";
import { AuthenticateContext } from '../../Context/Auth';


const MintOrRedeemToken = (props) => {
  const [t, i18n]= useTranslation(["global",'moc'])
  const auth = useContext(AuthenticateContext);
  const {web3} = auth;

  /* Context props */
  const { token, mocState, userState } = props;

  let reservePrice;
  if (mocState && mocState.bitcoinPrice) {
      reservePrice = mocState.bitcoinPrice;
  }

  /* State variable */
  const [currencyYouExchange, setCurrencyYouExchange] = useState('RESERVE');
  const [valueYouExchange, setValueYouExchange] = useState('0');
  const [valueYouReceive, setValueYouReceive] = useState('0');
  const [youExchangeIsValid, onYouExchangeValidityChange] = useState(false);
  const [youReceiveIsValid, onYouReceiveValidityChange] = useState(false);
  const [confirmingTransaction, setConfirmingTransaction] = useState(false);
  const [interests, setInterests] = useState({ interestRate: '0', interestValue: BigNumber('0') });
  const actionIsMint = currencyYouExchange === 'RESERVE';
  const [loadingSwitch, setLoadingSwitch] = useState(false);
  const [commissionSwitch, setCommissionSwitch] = useState('RESERVE');
  const [ShowModalAllowanceReserve, setShowModalAllowanceReserve] = useState(false);
  const [ModalAllowanceReserveMode, setModalAllowanceReserveMode] = useState('Confirm');
  const [tolerance, setTolerance] = useState('0.1');

  let userComment = '';
  let userTolerance = '';
  const userAccountIsLoggedIn = mocState;

  /* Effects */
  useEffect(
    () => {
      if (auth.convertToken) {
        onValueYouExchangeChange(valueYouReceive);
      }
    },
    [currencyYouExchange]
  );
  useEffect(
    () => {
      const awaitInterests = async newValueYouExchange => {
        const interests = await calcInterests(newValueYouExchange);
        setInterests(interests);
      };
      if (auth.convertToken) {
        awaitInterests(valueYouExchange);
      }
    },
    [valueYouExchange]
  );

  /* Methods */
  const getCurrencyYouReceive = (actionIsMint, tokenToMintOrRedeem) => {
    return actionIsMint ? tokenToMintOrRedeem : 'RESERVE';
  };

  const onValueYouExchangeChange = newValueYouExchange => {
    setValueYouExchange(newValueYouExchange);
    const newValueYouReceiveInWei = convertAmount(
      currencyYouExchange,
      currencyYouReceive,
      newValueYouExchange,
      auth.convertToken
    );
    setValueYouReceive(newValueYouReceiveInWei);
  };

  const onValueYouReceiveChange = newValueYouReceive => {
    setValueYouReceive(newValueYouReceive);
    const newValueYouExchange = convertAmount(
      currencyYouReceive,
      currencyYouExchange,
      newValueYouReceive,
      auth.convertToken
    );
    setValueYouExchange(newValueYouExchange);
  };

  const onChangeCurrencyYouExchange = (newCurrencyYouExchange) => {
    setCurrencyYouExchange(newCurrencyYouExchange);
  };

  const getMaxValues = () => {
    let maxValueYouExchange, maxValueYouReceive;
    if (actionIsMint) {
      maxValueYouReceive = getMaxMintableBalance(
        token,
        userState,
        mocState,
        auth.convertToken
      ).value.toString();
      maxValueYouExchange = convertAmount(token, 'RESERVE', maxValueYouReceive, auth.convertToken);
    } else {
      //action is redeem
      maxValueYouExchange = getMaxRedeemableBalance(token, userState, mocState).value.toString();
      maxValueYouReceive = convertAmount(token, 'RESERVE', maxValueYouExchange, auth.convertToken);
    }
    return { youExchange: maxValueYouExchange, youReceive: maxValueYouReceive };
  };

 const clear = () => {
    setCurrencyYouExchange(token);
    setValueYouExchange('0');
    setValueYouReceive('0');
  };
  const openConfirmationModal = () => {
    setConfirmingTransaction(true);
  };

  const closeConfirmationModal = () => {
    setConfirmingTransaction(false);
  };

  const calcCommission = () => {
    if (!auth.convertToken || !mocState) return {};
    const {
      commissionCurrency,
      commissionRate,
      commissionYouPay,
      enoughMOCBalance
    } = getCommissionRateAndCurrency({
      valueYouExchange,
      currencyYouReceive,
      currencyYouExchange,
      mocState,
      userState,
      convertToken: auth.convertToken
    });

    const commissionRateVisible = formatVisibleValue(
      commissionRate * 100,
      'commissionRate',
      formatLocalMap2[i18n.languages[0]]
    );
    return {
      percentage: commissionRateVisible,
      value: commissionYouPay,
      currencyCode: commissionCurrency,
      enoughMOCBalance: enoughMOCBalance
    };
  };

  const calcInterests = async newValueYouExchange => {
    let interestRate = '0',
      interestValue = BigNumber('0');
    if (actionIsMint && currencyYouReceive === 'RISKPROX') {
      interestValue = await auth.calcMintInterestValues(
        BigNumber(newValueYouExchange)
          .toFixed(0)
          .toString()
      );
      interestValue = new BigNumber(interestValue);
      //interestValue = new BigNumber(0.01).multipliedBy(interestValue).plus(interestValue);

      interestRate = formatValueToContract(
        new BigNumber(interestValue)
          .multipliedBy(100)
          .div(newValueYouExchange)
          .toFixed(),
        'USD'
      );

      interestRate = formatVisibleValue(interestRate, 'commissionRate', formatLocalMap2[i18n.languages[0]]);
    }
    return { interestRate, interestValue };
  };

  const onConfirmTransaction = async data => {
    userComment = data.comment;
    userTolerance = data.tolerance;

    const { appMode } = window;
    // In rrc20 mode show allowance when need it
    if (appMode === 'RRC20') {
      const userAllowance = await window.nodeManager.getReserveAllowance(window.address);
      if (valueYouExchange > userAllowance) {
        allowanceReserveModalShow(true);
        return;
      }
    }
    // onConfirmTransactionFinish();
  };

  /* const onConfirmTransactionFinish = async () => {
    const exchangeMethod = getExchangeMethod(
      currencyYouExchange,
      currencyYouReceive,
      `${commission.currencyCode}_COMMISSION`
    );
    const userAmount = formatValueWithContractPrecision(valueYouExchange, 'RESERVE');
    const userToleranceAmount = formatValueToContract(
      new BigNumber(userTolerance)
          .multipliedBy(userAmount)
          .div(100)
          .toFixed(),
      'RESERVE'
    );

    exchangeMethod(userAmount, userToleranceAmount, callback).then((res) => console.log(res, callback))
    // setConfirmingTransaction(false);
  }; */

  /* const callback = (error, transactionHash) => {
    console.log(transactionHash);
    setCurrentHash(transactionHash);
  }; */

  const allowanceReserveModalClose = async () => {
    setShowModalAllowanceReserve(false);
  };

  const allowanceReserveModalShow = async () => {
    setShowModalAllowanceReserve(true);
  };

  const allowanceReserveModalModeWaiting = async () => {
    setModalAllowanceReserveMode('Waiting');
  };

  const renderAllowanceReserveModalConfirm = () => {
    return (
      <>
        <h1 className="ReserveAllowanceModal_Title">
          {t('global.ReserveAllowanceModal_SetAllowance')}
        </h1>
        <div className="ReserveAllowanceModal_Content">
          <p>
              {t('global.ReserveAllowanceModal_AllowanceDescription')}
          </p>
          <Button
            type="primary"
            onClick={setAllowanceReserve}
          >
            {t('global.ReserveAllowanceModal_Authorize')}
          </Button>
        </div>
      </>
    );
  };

  const renderAllowanceReserveModalLoading = () => {
    return (
      <>
        <h1 className="ReserveAllowanceModal_Title">
          {t('global.ReserveAllowanceModal_SetAllowance')}
        </h1>
        <div className="ReserveAllowanceModal_Content AllowanceLoading">
          <Spin indicator={<LoadingOutlined />} />
          <p>
            {t('global.ReserveAllowanceModal_ProccessingAllowance')}
          </p>
        </div>
      </>
    );
  };

 const renderAllowanceReserveModal = () => {
    var renderContent = '';
    if (ModalAllowanceReserveMode === 'Confirm') {
      renderContent = renderAllowanceReserveModalConfirm();
    } else {
      renderContent = renderAllowanceReserveModalLoading();
    }

    return (
      <Modal
        className="ReserveAllowanceModal"
        visible={ShowModalAllowanceReserve}
        onCancel={allowanceReserveModalClose}
        footer={null}
      >
        {renderContent}
      </Modal>
    );
  };

  const setAllowanceReserve = () => {
    setModalAllowanceReserveMode('Waiting');
    const result = auth.approveReserve(null, (a, _txHash) => {
      msgAllowanceTx(_txHash);
    });
    result.then(() => setDoneAllowanceReserve()).catch(() => setFailAllowanceReserve());
    msgAllowanceReserveSend();
  };

  const setDoneAllowanceReserve = () => {
    setModalAllowanceReserveMode('Confirm');
    allowanceReserveModalClose();
    // onConfirmTransactionFinish();
  };

  const setFailAllowanceReserve = () => {
    setModalAllowanceReserveMode('Confirm');
    allowanceReserveModalClose();
  };

  const setAllowance = async allowanceEnabled => {
    setLoadingSwitch(true);
    await auth.approveMoCToken(allowanceEnabled, (error, _txHash) => {
      msgAllowanceTx(_txHash);
    }).then(res => {
      setDoneSwitch(allowanceEnabled);
    })
        .catch(e => {
          console.error(e);
          setFailSwitch();
        });
    msgAllowanceSend();
  };

  const msgAllowanceReserveSend = () => {
    notification['warning']({
      message: t('global.ReserveAllowanceModal_allowanceSendTitle'),
      description: t(
        'global.ReserveAllowanceModal_allowanceSendDescription'
      ),
      duration: 10
    });
  };

  const msgAllowanceSend = () => {
    notification['warning']({
      message: t('MoC.exchange.allowance.allowanceSendTitle', {ns: 'moc'}),
      description: t('MoC.exchange.allowance.allowanceSendDescription', {ns: 'moc'}),
      duration: 10
    });
  };

  const msgAllowanceTx = (txHash) => {
    const key = `open${Date.now()}`;
    const onClick = `${window.explorerUrl}/tx/${txHash}`;
    const btn = (
      <Button
        type="primary"
        size="small"
        onClick={() =>
          window.open(`${window.explorerUrl}/tx/${txHash}`)
        }
      >
        Explorer TX
      </Button>
    );
    notification['warning']({
      message: t('MoC.exchange.allowance.allowanceTxTitle', {ns: 'moc'}),
      description: t('MoC.exchange.allowance.allowanceTxDescription', {ns: 'moc'}),
      btn,
      key,
      duration: 20
    });
  };

  const setDoneSwitch = (allowanceEnabled) => {
    setLoadingSwitch(false);
  };

  const setFailSwitch = () => {
    setLoadingSwitch(false);

    notification['error']({
      message: t('MoC.exchange.allowance.allowanceSendErrorTitle', {ns:'moc'}),
      description: t('MoC.exchange.allowance.allowanceSendErrorDescription', {ns: 'moc'}),
      duration: 10
    });
  };

  const totalsWithCommissionAndInterests = () => {
    let totalYouExchange = BigNumber(valueYouExchange);
    let totalYouReceive = BigNumber(valueYouReceive);

    // Mint BTCX slippage (user tolerance)
    // take in care user tolerance
    //if (actionIsMint && currencyYouReceive === 'RISKPROX') {
    if (actionIsMint) {
      const userToleranceAmount = new BigNumber(tolerance).multipliedBy(totalYouExchange).div(100).toFixed();
      totalYouExchange = totalYouExchange.plus(userToleranceAmount);
    }

    const commission = calcCommission();
    if (actionIsMint) {
      if (commission.currencyCode === 'RESERVE') {
        totalYouExchange = totalYouExchange.plus(commission.value);
      }
      totalYouExchange = totalYouExchange.plus(interests.interestValue);
    } else {
      // action is Redeem, then commissions are subtracted from value you receive
      if (commission.currencyCode === 'RESERVE') {
        totalYouReceive = totalYouReceive.minus(commission.value);
      }
      totalYouReceive = totalYouReceive.minus(interests.interestValue);
    }
    return { totalYouExchange, totalYouReceive };
  };

    /* Variables */

  const currencyYouReceive = getCurrencyYouReceive(actionIsMint, token);
  const commission = calcCommission();
  const totals = totalsWithCommissionAndInterests();
    /* View */

  const renderExchangeInputs = () => {
    return (
      <div className="ExchangeInputs AlignedAndCentered">
        <div className="YouExchange">
         <InputWithCurrencySelector
            title={t('global.MintOrRedeemToken_YouExchange', {ns: 'global'})}
            currencySelected={currencyYouExchange}
            onCurrencySelect={onChangeCurrencyYouExchange}
            inputValueInWei={valueYouExchange}
            onInputValueChange={onValueYouExchangeChange}
            currencyOptions={[token, 'RESERVE']}
            onValidationStatusChange={onYouExchangeValidityChange}
            maxValueAllowedInWei={getMaxValues().youExchange}
            showMaxValueAllowed
            validate={userAccountIsLoggedIn}
            showConvertBTC_RBTC_Link={false}
         />
        </div>
        <ArrowRightOutlined />
        <div className="YouReceive">
         <InputWithCurrencySelector
            title={t('global.MintOrRedeemToken_YouReceive', {ns: 'global'})}
            validate={userAccountIsLoggedIn}
            currencyOptions={[token, 'RESERVE']}
            onValidationStatusChange={onYouReceiveValidityChange}
            currencySelected={currencyYouReceive}
            disableCurrencySelector
            inputValueInWei={valueYouReceive}
            maxValueAllowedInWei={getMaxValues().youReceive}
            showMaxValueAllowed
            onInputValueChange={onValueYouReceiveChange}
            showConvertBTC_RBTC_Link={false}
         />
        </div>
      </div>
    );
  };

  const [currencyCode, setCurrencyCode]=  useState('USDPrice');
  const renderFooter = () => {
    return (
      <div className="MintOrRedeemTokenFooter AlignedAndCentered">
        <div className="ReserveInUSD">
          <span className={`Conversion ${window.appMode}`}>
            1 {t('MoC.Tokens_RESERVE_code', {ns: 'moc'})} ={' '}
                {auth.isLoggedIn && <>&nbsp;<LargeNumber amount={web3.utils.toWei(auth.contractStatusData['bitcoinPrice'], 'ether')} {...{ currencyCode }} />
                  <span>&nbsp;USD</span></>
              }
          </span>
          <span className="Disclaimer">
            {t('global.MintOrRedeemToken_AmountMayDiffer')}
          </span>
        </div>
        <div
          className={`MainActions ${window.appMode} AlignedAndCentered`}
        >
          <Button
            type="default"
            onClick={clear}
            style={{ marginRight: 15 }}
          >
            {t('global.MintOrRedeemToken_Clear')}
          </Button>
          <Button
            type="primary"
            onClick={openConfirmationModal}
            disabled={!youExchangeIsValid || !youReceiveIsValid}
          >
            {
              actionIsMint
                ? t('global.MintOrRedeemToken_Mint')
                : t('global.MintOrRedeemToken_Redeem')
            }
          </Button>
        </div>
      </div>
    );
  };

  const renderConfirmTransactionModal = () => {
    let defaultSliderValue = 0.1;
    if (actionIsMint && currencyYouReceive === 'RISKPROX') { defaultSliderValue = 0.25; }
    return (
      <MintModal
        visible={confirmingTransaction}
        exchanging={{
          value: totals.totalYouExchange,
          currencyCode: currencyYouExchange
        }}
        receiving={{
          value: totals.totalYouReceive,
          currencyCode: currencyYouReceive
        }}
        fee={commission}
        interests={interests}
        onCancel={closeConfirmationModal}
        // onConfirm={onConfirmTransaction}
        convertToken={auth.convertToken}
        tolerance={tolerance}
        setTolerance={setTolerance}
        actionIsMint={actionIsMint}
        defaultSliderValue={defaultSliderValue}
        // txHash={currentHash}
        commissionCurrency={commission.currencyCode}
        valueYouExchange={valueYouExchange}
      />
    );
  };

  const contentFee = (type) => (
    <div className="TooltipContent">
      <h4>{t(`MoC.exchange.summary.${type}Title`, {ns: 'moc'})}</h4>
      <p>{t(`MoC.exchange.summary.${type}TooltipText`, {ns: 'moc'})}</p>
    </div>
  );

  const renderComissionCurrencySwitch = () => {
    const { enoughMOCBalance } = commission;

    if (commissionSwitch !== commission.currencyCode) {
      setCommissionSwitch(commission.currencyCode);
      setLoadingSwitch(false);
    }
    //const [commissionSwitch, setCommissionSwitch] = useState("RESERVE");

    let tooltip = enoughMOCBalance
      ? contentFee('payWithMocToken')
      : contentFee('notEnoughMocToken');

    return (
      <div className={`CommissionCurrencySwitch ${window.appMode}`}>
        <p>
          {t('global.MintOrRedeemToken_Fee', {
            feePercent: commission.percentage
          })}
        </p>
        {!isNaN(commission.value) &&
            <span>{commission.value} 333</span> &&
            <LargeNumber
                includeCurrency
                amount={commission.value}
                currencyCode={commission.currencyCode}
            />}
        <Popover content={tooltip} placement="top">
          <div className="PayWithMocToken">
            <Switch
              disabled={!enoughMOCBalance}
              checked={commission.currencyCode === 'MOC'}
              onChange={setAllowance}
              loading={loadingSwitch}
            />
          </div>
        </Popover>
      </div>
    );
  };

  const renderInterests = () => (
    <div className="CommissionCurrencySwitch">
      <p>
        {t('global.MintOrRedeemToken_Interest', {
          interestRate: interests.interestRate
        })}
      </p>
      <LargeNumber
        includeCurrency
        amount={interests.interestValue}
        currencyCode={'RESERVE'}
      />
    </div>
  );

  return (
    <Card
      title={
        actionIsMint
          ? t('global.MintOrRedeemToken_Mint')
          : t('global.MintOrRedeemToken_Redeem')
      }
      // loading={loading}
      className="Card MintOrRedeemToken"
    >
      {auth.convertToken && mocState && (
        <>
          {renderExchangeInputs()}
          {renderComissionCurrencySwitch()}
          {interests &&
            interests.interestValue &&
            interests.interestValue.gt(0) &&
            renderInterests()}
          {renderFooter()}
          {renderConfirmTransactionModal()}
          {renderAllowanceReserveModal()}
        </>
      )}
    </Card>
  );
};

export default MintOrRedeemToken;
