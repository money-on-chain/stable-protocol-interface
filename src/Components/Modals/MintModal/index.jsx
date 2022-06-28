/* eslint-disable default-case */
/* eslint-disable react/jsx-no-target-blank */
import { Button, Collapse, Slider } from 'antd';
import { SettingFilled } from '@ant-design/icons';
import { AuthenticateContext } from '../../../Context/Auth';
import './style.scss';
import { useState, useContext, useEffect } from 'react';
import { Modal, notification } from 'antd';

import { convertAmount } from '../../../Lib/exchangeManagerHelper';
import { getExchangeMethod } from '../../../Lib/exchangeHelper';
import {
  formatValueToContract,
  formatValueWithContractPrecision,
} from '../../../Lib/Formats';
import Copy from "../../Page/Copy";
import { currencies as currenciesDetail } from '../../../Config/currentcy';
import { LargeNumber } from '../../LargeNumber';
import {formatLocalMap2} from '../../../Lib/Formats';
import { useTranslation } from "react-i18next";
import BigNumber from 'bignumber.js';
export default function MintModal(props) {
  const isLoggedIn = true; //userAccountIsLoggedIn() && Session.get('rLoginConnected');
  const {
    exchanging,
    receiving,
    title = '',
    handleClose = () => {},
    handleComplete = () => {},
    color,
    token,
    fee,
    interests,
    visible,
    onCancel,
    onConfirm,
    convertToken,
    actionIsMint,
    tolerance,
    setTolerance,
    defaultSliderValue,
    commissionCurrency,
    valueYouExchange,
  } = props;

  /* Disabled confirm button when not connected */
  const { address } = true; //window;
  var btnDisable = false;
  if (!address || !isLoggedIn) {
    btnDisable = true;
  }
  const [loading, setLoading] = useState(false);
  const [showTransaction, setShowTransaction] = useState(false);
  const [transaction, setTransaction] = useState(false);
  const auth = useContext(AuthenticateContext);
  const tokenNameExchange = exchanging.currencyCode
    ? currenciesDetail.find((x) => x.value === exchanging.currencyCode).label
    : '';
  const tokenNameReceive = receiving.currencyCode
    ? currenciesDetail.find((x) => x.value === receiving.currencyCode).label
    : '';
  
  const [currentHash, setCurrentHash] = useState(null);
  const [comment, setComment] = useState('');
  const [showError, setShowError] = useState(false);
  const [t, i18n]= useTranslation(["global",'moc'])
  const { appMode } = 'Moc';

  let userComment = '';
  let userTolerance = '';

  useEffect(() => {
      if (currentHash) {
        console.log('currentHash', currentHash);
          const interval = setInterval(() => {
              getTransaction(currentHash)
          }, 15000);
          return () => clearInterval(interval);
      }
  }, [currentHash]);
  useEffect(
    () => {
      setComment('');
    },
    [visible]
  );

  const receivingInUSD = convertAmount(
    receiving.currencyCode,
    'USD',
    receiving.value,
    convertToken
  );
  /* View */
  const renderAmount = (name, amountAndCurrencyCode, classElement) => {
    return (
      <div className={`AlignedAndCentered Amount ${classElement}`}>
        <span className="Name">{name}</span>
        <span className={`Value ${amountAndCurrencyCode.currencyCode} ${appMode}`}>
          <LargeNumber
            currencyCode={amountAndCurrencyCode.currencyCode}
            amount={amountAndCurrencyCode.value}
            includeCurrency
          />
        </span>
      </div>
    );
  };

  const confirmButton = async ({comment, tolerance}) => {

    // Check if there are enough spendable balance to pay
    // take in care amount to pay gas fee
    const minimumUserBalanceToOperate = "120000000000000";
    const userSpendable = await window.nodeManager.getSpendableBalance(window.address);

    let minimumBalance = new BigNumber(minimumUserBalanceToOperate);
    let uTolerance = 0;
    if (actionIsMint) {
        minimumBalance = minimumBalance.plus(new BigNumber(exchanging.value));
        uTolerance = tolerance;
    }

    // You have not enough balance abort
    if (minimumBalance.gt(new BigNumber(userSpendable))) {
        setShowError(true);
        return;
    }
    // onConfirm({ comment, tolerance: uTolerance });
    userComment = comment;
    userTolerance = uTolerance;

    /* const { appMode } = window;
    // In rrc20 mode show allowance when need it
    if (appMode === 'RRC20') {
      const userAllowance = await window.nodeManager.getReserveAllowance(window.address);
      if (valueYouExchange > userAllowance) {
        allowanceReserveModalShow(true);
        return;
      }
    } */
    onConfirmTransactionFinish();

  };

  const onConfirmTransactionFinish = async () => {
    console.log(exchanging.currencyCode, receiving.currencyCode, commissionCurrency );
    const exchangeMethod = getExchangeMethod(
      exchanging.currencyCode,
      receiving.currencyCode,
      `${commissionCurrency}_COMMISSION`
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
  };

  const callback = (error, transactionHash) => {
    setLoading(false);
    setCurrentHash(transactionHash);
    setShowTransaction(true);
    getTransaction(transactionHash);
  };

  const renderError = () => {
    return (
    <div className="noEnoughBalance">
      {t('global.ConfirmTransactionModal_Error_not_enough')}
    </div>
    )
  };

  const getTransaction = async (hash) => {
    await auth.getTransactionReceipt(hash, ()=> {
      setTransaction(false);
    }).then(res => {
      if (res) {
        setShowTransaction(true);
        setTransaction(true);
      }
    }).catch(e => {
      setTransaction(false);
      notification['error']({
        message: t('global.RewardsError_Title'),
        description: t('global.RewardsError_Message'),
        duration: 10
    });
    });
  } ;

  const changeTolerance = (newTolerance) => {
    setTolerance(newTolerance);
    setShowError(false);
  };

  const cancelButton = () => {
    setShowError(false);
    onCancel();
  };
  

  const markStyle = {
    style: {
      color: '#707070',
      fontSize: 10
    }
  };

  const priceVariationToleranceMarks = {
    0: { ...markStyle, label: '0.0%' },
    1: { ...markStyle, label: '1%' },
    2: { ...markStyle, label: '2%' },
    5: { ...markStyle, label: '5%' },
    10: { ...markStyle, label: '10%' }
  };

  const styleExchange = tokenNameExchange === exchanging.currencyCode ? { color } : {};
  const styleReceive = tokenNameReceive === receiving.currencyCode ? { color } : {};

  return (
    <Modal
      visible={visible}
      confirmLoading={loading}
      className="ConfirmModalTransaction"
      footer={null}
      onCancel={cancelButton}
    >
      <div className="TabularContent">
        <h1>{t('global.ConfirmTransactionModal_Title')}</h1>
        {renderAmount(t('global.ConfirmTransactionModal_Exchanging'), exchanging, 'AmountExchanging')}
        {showError && renderError()}
        {renderAmount(t('global.ConfirmTransactionModal_Receiving'), receiving, 'AmountReceiving')}
        <div className="USDConversion">
          <LargeNumber currencyCode={'USD'} amount={receivingInUSD} includeCurrency />
        </div>
        <Collapse className="CollapseTolerance">
          <Collapse.Panel showArrow={false} header={<div className="PriceVariationSetting">
            <SettingFilled className="icon"/>
            <span className="SliderText">{t("global.CustomizePrize_VariationToleranceSettingsTitle")}</span>
          </div>}>
            <div className="PriceVariationContainer">
              <h4>{t("global.CustomizePrize_VariationToleranceTitle")}</h4>
              <Slider
                className="SliderControl"
                marks={priceVariationToleranceMarks}
                defaultValue={defaultSliderValue}
                min={0}
                max={10}
                step={0.1}
                dots={false}
                onChange={val => changeTolerance(val)}
              />
            </div>
          </Collapse.Panel>
        </Collapse>
        <div
          className="AlignedAndCentered"
          style={{ alignItems: 'start', marginBottom: 20 }}
        >
          <div className="Name">
            <div className="MOCFee">
              <div className={`AlignedAndCentered Amount`}>
                <span className="Name">{`${t('global.ConfirmTransactionModal_MOCFee')} (${(fee?.percentage!==undefined)? fee.percentage: 0.15}%)`}</span>
                <span className={`Value ${appMode}`}>
                  {auth.isLoggedIn &&
                  <LargeNumber
                    currencyCode={fee?.currencyCode}
                    amount={fee?.value}
                    includeCurrency
                  />}
                  {!auth.isLoggedIn && <span>0.000000 RBTC</span>}
                </span>
              </div>
            </div>
            {interests &&
              interests?.interestValue &&
              interests?.interestValue.gt(0) && (
                <div className="MOCFee">
                  <div className={`AlignedAndCentered Amount`}>
                    <span className="Name">{`${t('global.ConfirmTransactionModal_Interests')} (${interests?.interestRate}%)`}</span>
                    <span className={`Value ${appMode}`}>
                      <LargeNumber
                        currencyCode={'RESERVE' }
                        amount={interests.interestValue}
                        includeCurrency
                      />
                    </span>
                  </div>
                </div>
          )}
            <div className="Legend">
            {t('global.ConfirmTransactionModal_MOCFee_Disclaimer')}
            </div>
          </div>
          {/*<span className="Value">0.00 MOC</span>*/}
        </div>
      </div>

      <hr style={{ border: '1px solid lightgray', marginTop: 20 }} />

      <div className="AlignedAndCentered">
        <i className="Gray">
          {t('global.ConfirmTransactionModal_AmountMayDifferDisclaimer')}
        </i>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '1em'}}>
        {showTransaction
          ? <div style={{ width: '100%' }}>
            <div>
              <p style={{ width: '50%', float: 'left' }}>Transaction status</p>
              <p style={{ textAlign: 'right', color: transaction ? '#09c199' : '#f1a954' }}>{transaction ? 'SUCCESSFUL' : 'PENDING'}</p>
            </div>
            <div>
              <p style={{ width: '50%', float: 'left' }}>Hash</p>
              <div style={{ textAlign: 'right' }}>
                <Copy textToShow={currentHash?.slice(0, 5)+'...'+ currentHash?.slice(-4)} textToCopy={currentHash}/>
              </div>
            </div>
            <div style={{ clear: 'both' }}>
              <a
                style={{ color: '#09c199' }}
                href={`https://explorer.testnet.rsk.co/tx/${currentHash}`}
                target="_blank"
              >View on the explorer</a>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center'}}>
              <Button type="primary" onClick={() => {cancelButton(); setCurrentHash(null); setShowTransaction(false)}}>Close</Button>
            </div>
          </div>
          : <>
            <Button
              onClick={() => cancelButton()}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              disabled={!auth.isLoggedIn}
              onClick={() => confirmButton({ comment, tolerance })}
            >Confirm</Button>
        </>}
      </div>
    </Modal>
  );
}
