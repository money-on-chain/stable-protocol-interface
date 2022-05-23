/* eslint-disable default-case */
import { Row, Col, Switch, Popover, notification, Modal, Spin } from 'antd';
import './style.scss';
import React, { useEffect, useState, useContext } from 'react';
import _ from 'lodash/core';
import BigNumber from 'bignumber.js';
import { Button } from 'antd';
import CoinSelect from '../../Form/CoinSelect';
import MintModal from '../../Modals/MintModal';
//new
import { getCommissionRateAndCurrency } from '../../../Lib/exchangeManagerHelper';
import { formatVisibleValue } from '../../../Lib/Formats';
import {ArrowRightOutlined, LoadingOutlined} from '@ant-design/icons';
import convertHelper from '../../../Lib/convertHelper';
import { getExchangeMethod } from '../../../Lib/exchangeHelper';
import {
  formatValueWithContractPrecision,
  formatValueToContract} from '../../../Lib/Formats';
import { getPriceFields } from '../../../Lib/price';
import {useTranslation} from "react-i18next";
import { LargeNumber } from '../../LargeNumber';
import { AuthenticateContext } from '../../../Context/Auth';
import InputWithCurrencySelector from '../../Form/InputWithCurrencySelector';

export default function MintCard(props) {
  const { token = '', color = '' } = props;
  const auth = useContext(AuthenticateContext);
  const { accountData = {} } = auth;

  const { mocAllowance = 0 } = props.UserBalanceData ? props.UserBalanceData : {};
  const { bitcoinPrice = 0 } = props.StatusData ? props.StatusData : {};
  const priceFields = getPriceFields();
  const mocStates = {
    fields: {
      ...priceFields,
      reservePrecision: 1,
      priceVariation: 1,
      commissionRates: 1,
      lastUpdateHeight: 1,
      isDailyVariation: 1
    }
  }
  const mocState = props.StatusData;
  const userState = props.UserBalanceData
  let mocStatePrices;
  if(mocState?.length) {
    [mocStatePrices] = mocStates;
  }
  const reservePrice = mocState?.bitcoinPrice;
  const convertToken = convertHelper(
      _.pick(mocStatePrices, Object.keys(priceFields).concat(['reservePrecision']))
  );

  const [currencyYouExchange, setCurrencyYouExchange] = useState('RESERVE');
  // const [currencyYouReceive, setCurrencyYouReceive] = useState('');
  const [valueYouExchange, setValueYouExchange] = useState('0.0000');
  const [valueYouReceive, setValueYouReceive] = useState('0');
  const [valueYouReceiveUSD, setValueYouReceiveUSD] = useState('0.0000');
  const [showMintModal, setShowMintModal] = useState(false);
  // const [isMint, setIsMint] = useState(true);
  const [commissionSwitch, setCommissionSwitch] = useState('RESERVE');
  const [loadingSwitch, setLoadingSwitch] = useState(false);
  const [switchChecked, setSwitchChecked] = useState(false);
  const [ModalAllowanceReserveMode, setModalAllowanceReserveMode] = useState('Confirm');
  const [ShowModalAllowanceReserve, setShowModalAllowanceReserve] = useState(false);
  const [confirmingTransaction, setConfirmingTransaction] = useState(false);
  const [interests, setInterests] = useState({ interestRate: '0', interestValue: BigNumber('0') });
  const [tolerance, setTolerance] = useState('0.1');
  const [t, i18n]= useTranslation(["global","moc"])
  const isMint = currencyYouExchange === 'RESERVE'
  let userTolerance = '';
  let userComment = '';

  const onChangeCurrencyYouExchange = (newCurrencyYouExchange) => {
    setCurrencyYouExchange(newCurrencyYouExchange);
  };

  useEffect(() => {
    if (convertToken) {
      onValueYouExchangeChange(valueYouReceive);
    }
  }, [currencyYouExchange]);

  useEffect(() => {
    const awaitInterests = async newValueYouExchange => {
      const interests = await calcInterests(newValueYouExchange);
      setInterests(interests);
    };
    if (convertToken) {
      awaitInterests(valueYouExchange);
    }
  }, [valueYouExchange]);

  const checkShowMintModal = () => {
    setShowMintModal(true);
  };
  const getCurrencyYouReceive = (actionIsMint, tokenToMintOrRedeem) => {
    return actionIsMint ? tokenToMintOrRedeem : 'RESERVE';
  };

  const closeMintModal = () => {
    setShowMintModal(false);
  };
  const closeConfirmationModal = () => {
    setShowMintModal(false);
  };

  const calcInterests = async newValueYouExchange => {
    let interestRate = '0',
        interestValue = BigNumber('0');
    if (isMint && currencyYouReceive === 'RISKPROX') {
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

      interestRate = formatVisibleValue(interestRate, 'commissionRate', 'en');
    }
    return { interestRate, interestValue };
  };

  const onClear = () => {
    setCurrencyYouExchange(props.currencyOptions[0]);
    setValueYouExchange('0.0000');
    setValueYouReceive('0.0000');
  };

  const setDoneSwitch = allowanceEnabled => {
    setLoadingSwitch(false);
    setSwitchChecked(true);
  };

  const setFailSwitch = () => {
    setLoadingSwitch(false);
    setSwitchChecked(false);
    notification['error']({
      message: t('MoC.exchange.allowance.allowanceSendErrorTitle', {ns: 'moc'}),
      description: t('MoC.exchange.allowance.allowanceSendErrorDescription', {ns: 'moc'}),
      duration: 10
    });
  };

  const msgAllowanceTx = txHash => {
    const key = `open${Date.now()}`;
    const onClick = `${window.explorerUrl}/tx/${txHash}`;
    const btn = (
        <Button
            type="primary"
            size="small"
            onClick={() => window.open(`${window.explorerUrl}/tx/${txHash}`)}
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

  const msgAllowanceSend = () => {
    notification['warning']({
      message: t('MoC.exchange.allowance.allowanceSendTitle', {ns: 'moc'}),
      description: t('MoC.exchange.allowance.allowanceSendDescription', {ns: 'moc'}),
      duration: 10
    });
  };

  const onValueYouExchangeChange = (newValueYouExchange) => {
    if (!bitcoinPrice) return {};
    const reservePrice = bitcoinPrice;
    switch (currencyYouReceive) {
      case 'STABLE':
        setValueYouReceive(
            parseFloat(newValueYouExchange) * parseFloat(reservePrice)
        );
        setValueYouReceiveUSD(
            parseFloat(newValueYouExchange) * parseFloat(reservePrice)
        );
        break;
      case 'RESERVE':
        switch (currencyYouExchange) {
          case 'STABLE':
            setValueYouReceive(
                parseFloat(newValueYouExchange) /
                parseFloat(reservePrice)
            );
            setValueYouReceiveUSD(parseFloat(newValueYouExchange));
            break;
          case 'RISKPRO':
            setValueYouReceive(
                (newValueYouExchange *
                    bitcoinPrice) /
                reservePrice
            );
            setValueYouReceiveUSD(
                parseFloat(newValueYouExchange) *
                parseFloat(bitcoinPrice)
            );
            break;
          case 'RISKPROX':
            setValueYouReceive(newValueYouExchange);
            setValueYouReceiveUSD(
                parseFloat(newValueYouExchange) *
                (parseFloat(
                    props.StatusData['bprox2PriceInRbtc']
                    ) *
                    parseFloat(reservePrice))
            );
            break;
        }
        break;
      case 'RISKPRO':
        setValueYouReceive(
            (newValueYouExchange * reservePrice) /
            props.StatusData['bproPriceInUsd']
        );
        setValueYouReceiveUSD(
            parseFloat(newValueYouExchange) *
            parseFloat(props.StatusData['bproPriceInUsd'])
        );
        break;
      case 'RISKPROX':
        setValueYouReceive(newValueYouExchange);
        setValueYouReceiveUSD(
            parseFloat(newValueYouExchange) *
            (parseFloat(props.StatusData['bprox2PriceInRbtc']) *
                parseFloat(reservePrice))
        );
        break;
    }
    setValueYouExchange(newValueYouExchange);
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

  //renders
  const renderExchangeInputs = () => {
    return (
        <div className="ExchangeInputs AlignedAndCentered">
          <div className="YouExchange">
            <CoinSelect
                label={t('global.MintOrRedeemToken_YouExchange')}
                onCurrencySelect={onChangeCurrencyYouExchange}
                onInputValueChange={onValueYouExchangeChange}
                value={currencyYouExchange}
                inputValueInWei={valueYouExchange}
                currencyOptions={props.currencyOptions}
                AccountData={props.AccountData}
                UserBalanceData={props.UserBalanceData}
                token={token}
            />
          </div>
          <ArrowRightOutlined />
          <div className="YouReceive">
            <CoinSelect
                label={t('global.MintOrRedeemToken_YouReceive')}
                inputValueInWei={valueYouReceive}
                currencyOptions={props.currencyOptions}
                value={currencyYouReceive}
                token={token}
                UserBalanceData={props.UserBalanceData}
                AccountData={props.AccountData}
                disabled
            />
          </div>
        </div>
    );
  };

  const renderFooter = () => {
    return (
        <div className="MintOrRedeemTokenFooter AlignedAndCentered">
          <div className="ReserveInUSD">
          <span className="Conversion">
            1 {t('MoC.Tokens_RESERVE_code', {ns: 'moc'})} ={' '}
            <LargeNumber
                className="ReservePrice"
                amount={reservePrice}
                currencyCode={'USD'}
                includeCurrency
            />
          </span>
            <span className="Disclaimer">{t('global.MintOrRedeemToken_AmountMayDiffer')}</span>
            {/*<div className="TextLegend">{t('global.MintOrRedeemToken_AmountMayDiffer')}</div>*/}
          </div>
          <div className="MainActions AlignedAndCentered" style={{ width: '22%'}}>
            <Button type="ghost" onClick={onClear}>
              {t('global.MintOrRedeemToken_Clear')}
            </Button>
            <Button
                type="primary"
                onClick={checkShowMintModal}
            >
              {isMint ? t('global.MintOrRedeemToken_Mint') : t('global.MintOrRedeemToken_Redeem')}
            </Button>
          </div>
        </div>
    );
  };

  const calcCommission = () => {
    if (!convertToken || !mocState || !currencyYouReceive || !currencyYouExchange || !valueYouExchange) return {};
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
      convertToken,
    });


    const commissionRateVisible = formatVisibleValue(
        commissionRate * 100,
        'commissionRate',
        'en'
    );
    return {
      percentage: commissionRateVisible,
      value: commissionYouPay,
      currencyCode: commissionCurrency,
      enoughMOCBalance: enoughMOCBalance
    };
  };
  const totalsWithCommissionAndInterests = () => {
    let totalYouExchange = BigNumber(valueYouExchange);
    let totalYouReceive = BigNumber(valueYouReceive);

    if (isMint) {
      const userToleranceAmount = new BigNumber(tolerance).multipliedBy(totalYouExchange).div(100).toFixed();
      totalYouExchange = totalYouExchange.plus(userToleranceAmount);
    }

    const commission = calcCommission();
    if (isMint) {
      if (commission.currencyCode === 'RESERVE') {
        totalYouExchange = totalYouExchange.plus(commission.value);
      }
      totalYouExchange = totalYouExchange.plus(interests.interestValue);
    } else {
      if (commission.currencyCode === 'RESERVE') {
        totalYouReceive = totalYouReceive.minus(commission.value);
      }
      totalYouReceive = totalYouReceive.minus(interests.interestValue);
    }
    return { totalYouExchange, totalYouReceive };
  };
  const currencyYouReceive = getCurrencyYouReceive(isMint, token);
  const commission = calcCommission();
  const totals = totalsWithCommissionAndInterests();

  const contentFee = type => (
      <div className="TooltipContent">
        <h4>{t(`MoC.exchange.summary.${type}Title`, {ns: 'moc'})}</h4>
        <p>{t(`MoC.exchange.summary.${type}TooltipText`, {ns: 'moc'})}</p>
      </div>
  );
  const allowanceReserveModalClose = async () => {
    setShowModalAllowanceReserve(false);
  };
  const onConfirmTransactionFinish = async () => {
    const exchangeMethod = getExchangeMethod(
        currencyYouExchange,
        currencyYouReceive,
        `${commission.currencyCode}_COMMISSION`
    );
    const userAmount = formatValueWithContractPrecision(valueYouExchange, 'RESERVE');

    // User tolerance
    const userToleranceAmount = formatValueToContract(
        new BigNumber(userTolerance)
            .multipliedBy(userAmount)
            .div(100)
            .toFixed(),
        'RESERVE'
    );

    exchangeMethod(userComment, userAmount, userToleranceAmount);
    setConfirmingTransaction(false);
  };
  const setDoneAllowanceReserve = () => {
    setModalAllowanceReserveMode('Confirm');
    allowanceReserveModalClose();
    onConfirmTransactionFinish();
  };

  //TODO
  /* const setAllowanceReserve = () => {
    setModalAllowanceReserveMode('Waiting');
    const result = window.nodeManager.approveReserve(window.address, (a, _txHash) => {
      msgAllowanceTx(_txHash);
    });
    result.then(() => setDoneAllowanceReserve()).catch(() => setFailAllowanceReserve());
    msgAllowanceReserveSend();
  }; */
  const msgAllowanceReserveSend = () => {
    notification['warning']({
      message: t('global.ReserveAllowanceModal_allowanceSendTitle'),
      description: t('global.ReserveAllowanceModal_allowanceSendDescription'),
      duration: 10
    });
  };
  const setFailAllowanceReserve = () => {
    setModalAllowanceReserveMode('Confirm');
    allowanceReserveModalClose();

    notification['error']({
      message: t('exchange.allowance.allowanceSendErrorTitle'),
      description: t('exchange.allowance.allowanceSendErrorDescription'),
      duration: 10
    });
  };
  const renderComissionCurrencySwitch = () => {
    const { enoughMOCBalance } =  commission;

    if (commissionSwitch !== commission.currencyCode) {
      setCommissionSwitch(commission.currencyCode);
      setLoadingSwitch(false);
    }

    let tooltip = enoughMOCBalance
        ? contentFee('payWithMocToken')
        : contentFee('notEnoughMocToken');

    return (
        <div className="CommissionCurrencySwitch">
          <p>{t('global.MintOrRedeemToken_Fee')} ({commission.percentage}%)</p>
          <LargeNumber
              includeCurrency
              amount={commission.value}
              currencyCode={commission.currencyCode}
          />
          <Popover content={tooltip} placement="top">
            <div className="PayWithMocToken">
              <Switch
                  disabled={!enoughMOCBalance}
                  checked={switchChecked} //commission.currencyCode === 'MOC'}
                  onChange={setAllowance}
                  loading={loadingSwitch}
              />
            </div>
          </Popover>
        </div>
    );
  };
  const renderAllowanceReserveModalConfirm = () => {
    return (
        <>
          <h1 className="ReserveAllowanceModal_Title">
            {t('global.ReserveAllowanceModal_SetAllowance')}
          </h1>
          <div className="ReserveAllowanceModal_Content">
            <p>{t('global.ReserveAllowanceModal_AllowanceDescription')}</p>
            <Button
                className="ButtonPrimary"
                lowerCase
                // TODO onClick={setAllowanceReserve}
            >{t('global.ReserveAllowanceModal_Authorize')}</Button>
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
            <p>{t('global.ReserveAllowanceModal_ProccessingAllowance')}</p>
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
  const renderInterests = () => (
      <div className="CommissionCurrencySwitch">
        <p>{t('global.MintOrRedeemToken_Interest', { interestRate: interests.interestRate })}</p>
        <LargeNumber includeCurrency amount={interests.interestValue} currencyCode={'RESERVE'} />
      </div>
  );

  return (
      <div className="Card MintCard MintOrRedeemToken" style={{
        height: '23.4em'}}>
        <h3 className="CardTitle">{isMint ? t('global.MintOrRedeemToken_Mint') : t('global.MintOrRedeemToken_Redeem')}</h3>
        {renderExchangeInputs()}
        {renderComissionCurrencySwitch()}
        {interests &&
        interests.interestValue &&
        interests.interestValue.gt(0) &&
        renderInterests()}
        {renderFooter()}
        {renderAllowanceReserveModal()}
        <MintModal
            visible={showMintModal}
            handleClose={closeMintModal}
            handleComplete={closeMintModal}
            color={color}
            currencyYouExchange={currencyYouExchange}
            currencyYouReceive={currencyYouReceive}
            fee={commission}
            interests={interests}
            valueYouExchange={valueYouExchange}
            valueYouReceive={valueYouReceive}
            valueYouReceiveUSD={valueYouReceiveUSD}
            token={token}
            onCancel={closeConfirmationModal}
            setTolerance={setTolerance}
            actionIsMint={isMint}
            tolerance={tolerance}
            exchanging={{
              value: totals.totalYouExchange,
              currencyCode: currencyYouExchange
            }}
            receiving={{
              value: totals.totalYouReceive,
              currencyCode: currencyYouReceive
            }}
        />
      </div>
  );
}
