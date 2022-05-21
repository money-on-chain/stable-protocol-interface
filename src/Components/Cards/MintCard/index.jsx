/* eslint-disable default-case */
import { Row, Col, Switch, Popover, notification } from 'antd';
import './style.scss';
import React, { useEffect, useState, useContext } from 'react';
import _ from 'lodash/core';
import { Button } from 'antd';
import CoinSelect from '../../Form/CoinSelect';
import MintModal from '../../Modals/MintModal';
//new
import { getCommissionRateAndCurrency } from '../../../Lib/exchangeManagerHelper';
import { formatVisibleValue } from '../../../Lib/Formats';
import {ArrowRightOutlined} from '@ant-design/icons';
import convertHelper from '../../../Lib/convertHelper';
import { getPriceFields } from '../../../Lib/price';
import {useTranslation} from "react-i18next";
import { LargeNumber } from '../../LargeNumber';
import { AuthenticateContext } from '../../../Context/Auth';

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
  const convertToken = convertHelper(
    _.pick(mocStatePrices, Object.keys(priceFields).concat(['reservePrecision']))
  );

  const [currencyYouExchange, setCurrencyYouExchange] = useState(
    props.currencyOptions[0]
  );
  const [currencyYouReceive, setCurrencyYouReceive] = useState('');
  const [valueYouExchange, setValueYouExchange] = useState('0.0000');
  const [valueYouReceive, setValueYouReceive] = useState('0.0000');
  const [valueYouReceiveUSD, setValueYouReceiveUSD] = useState('0.0000');
  const [showMintModal, setShowMintModal] = useState(false);
  const [isMint, setIsMint] = useState(true);
  const [commissionSwitch, setCommissionSwitch] = useState('RESERVE');
  const [loadingSwitch, setLoadingSwitch] = useState(false);
  const [switchChecked, setSwitchChecked] = useState(false);
  const [t, i18n]= useTranslation(["global","moc"])

  const onChangeCurrencyYouExchange = (newCurrencyYouExchange) => {
    setCurrencyYouExchange(newCurrencyYouExchange);
  };

    useEffect(() => {
        let youReceive = props.currencyOptions.filter(
            (x) => x !== currencyYouExchange
        )[0];
        setCurrencyYouReceive(youReceive);
        setIsMint(youReceive === token);
    }, [currencyYouExchange]);

  const checkShowMintModal = () => {
    setShowMintModal(true);
  };

  const closeMintModal = () => {
    setShowMintModal(false);
  };
  const closeConfirmationModal = () => {
    setShowMintModal(false);
  };

  const onClear = () => {
    setCurrencyYouExchange(token);
    setValueYouExchange('0.0000');
    setValueYouReceive('0.0000');
  };

  const setDoneSwitch = allowanceEnabled => {
    setLoadingSwitch(false);
    setSwitchChecked(true);
  };
    
  const setFailSwitch = () => {
    setLoadingSwitch(false);

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
      console.log('pending approve moc token');
      msgAllowanceTx(_txHash);
    }).then(res => {
      console.log('res', res);
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
              amount={bitcoinPrice}
              currencyCode="USD"
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
          <Button type="primary" onClick={checkShowMintModal}>
            {isMint ? t('global.MintOrRedeemToken_Mint') : t('global.MintOrRedeemToken_Redeem')}
          </Button>
        </div>
      </div>
    );
  };
  const contentFee = type => (
    <div className="TooltipContent">
      <h4>{t(`MoC.exchange.summary.${type}Title`, {ns: 'moc'})}</h4>
      <p>{t(`MoC.exchange.summary.${type}TooltipText`, {ns: 'moc'})}</p>
    </div>
  );
  const renderComissionCurrencySwitch = () => {
    const { enoughMOCBalance } =  true;// commission;
  
    /* if (commissionSwitch != commission.currencyCode) {
      setCommissionSwitch(commission.currencyCode);
      setLoadingSwitch(false);
    } */

    //const [commissionSwitch, setCommissionSwitch] = useState("RESERVE");

    let tooltip = enoughMOCBalance
      ? contentFee('payWithMocToken')
      : contentFee('notEnoughMocToken');
  
    return (
      <div className="CommissionCurrencySwitch">
        <p>{t('global.MintOrRedeemToken_Fee', { feePercent: 1 })}</p>
        <LargeNumber
          includeCurrency
          amount={0} // {commission.value}
          currencyCode={'STABLE'} //{commission.currencyCode}
        />
        <Popover content={tooltip} placement="top">
          <div className="PayWithMocToken">
            <Switch
              // disabled={!enoughMOCBalance}
              checked={switchChecked} // {commission.currencyCode === 'MOC'}
              onChange={setAllowance}
              loading={loadingSwitch}
            />
          </div>
        </Popover>
      </div>
    );
  };

  return (
    <div className="Card MintCard MintOrRedeemToken" style={{ 
      height: '23.4em'}}>
      <h3 className="CardTitle">{isMint ? t('global.MintOrRedeemToken_Mint') : t('global.MintOrRedeemToken_Redeem')}</h3>
      {renderExchangeInputs()}
      {renderComissionCurrencySwitch()}
      {renderFooter()}
      <MintModal
        visible={showMintModal}
        handleClose={closeMintModal}
        handleComplete={closeMintModal}
        color={color}
        currencyYouExchange={currencyYouExchange}
        currencyYouReceive={currencyYouReceive}
        /* exchanging={{
            value: valueYouExchange,
            currencyCode: currencyYouExchange
        }}
        receiving={{
            value: valueYouReceive,
            currencyCode: currencyYouReceive
        }} */
        valueYouExchange={valueYouExchange}
        valueYouReceive={valueYouReceive}
        valueYouReceiveUSD={valueYouReceiveUSD}
        token={token}
        onCancel={closeConfirmationModal}
      />
    </div>
  );
}
