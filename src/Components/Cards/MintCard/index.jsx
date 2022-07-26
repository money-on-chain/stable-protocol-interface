/* eslint-disable default-case */
import { Row, Col, Switch } from 'antd';
import './style.scss';
import React, { useEffect, useState, useContext } from 'react';
import { Button, Popover } from 'antd';
import CoinSelect from '../../Form/CoinSelect';
import MintModal from '../../Modals/MintModal';
import {useTranslation} from "react-i18next";
import {formatLocalMap2} from '../../../Lib/Formats';
import { AuthenticateContext } from '../../../Context/Auth';

export default function MintCard(props) {

  const auth = useContext(AuthenticateContext);
  const { token = '', color = '' } = props;

  const { mocAllowance = 0 } = props.UserBalanceData ? props.UserBalanceData : {};
  const { bitcoinPrice = 0 } = props.StatusData ? props.StatusData : {};

  const [currencyYouExchange, setCurrencyYouExchange] = useState(
      props.currencyOptions[0]
  );

  const [t, i18n]= useTranslation(["global",'moc'])
  const [currencyYouReceive, setCurrencyYouReceive] = useState('');
  const [valueYouExchange, setValueYouExchange] = useState('0.0000');
  const [valueYouReceive, setValueYouReceive] = useState('0.0000');
  const [valueYouReceiveUSD, setValueYouReceiveUSD] = useState('0.0000');
  const [showMintModal, setShowMintModal] = useState(false);
  const [isMint, setIsMint] = useState(true);
  const [commissionSwitch, setCommissionSwitch] = useState('RESERVE');
  const [loadingSwitch, setLoadingSwitch] = useState(false);

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

    const onClear = () => {
        setCurrencyYouExchange(token);
        setValueYouExchange('0.0000');
        setValueYouReceive('0.0000');
    };

    const onValueYouExchangeChange = (newValueYouExchange) => {
      console.log('newValueYouExchange', newValueYouExchange);
      console.log('currencyYouReceive', currencyYouReceive);
      console.log('currencyYouExchange', currencyYouExchange);
      console.log('bitconprice', bitcoinPrice);
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

    const onFeeChange = (checked) => {
    };

    /* const calcCommission = () => {
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

    const commission = calcCommission(); */

   /*  const contentFee = type => (
      <div className="TooltipContent">
        <h4>{t(`MoC.exchange.summary.${type}Title`, {ns: 'moc'})}</h4>
        <p>{t(`MoC.exchange.summary.${type}TooltipText`, {ns: 'moc'})}</p>
      </div>
  );*/

    /* const renderComissionCurrencySwitch = () => {
      const { enoughMOCBalance } =  false //commission;
  
      if (commissionSwitch !== commission.currencyCode) {
        setCommissionSwitch(commission.currencyCode);
        setLoadingSwitch(false);
      }
  
      let tooltip = enoughMOCBalance
          ? contentFee('payWithMocToken')
          : contentFee('notEnoughMocToken');
  
      return (
          <div className="CommissionCurrencySwitch">
            <p>{t("global.MintOrRedeemToken_Fee", {ns: 'global', feePercent: '0.00' })}</p>
            {auth.isLoggedIn &&
              Number('0.00').toLocaleString(formatLocalMap2[i18n.languages[0]], {
                  minimumFractionDigits: 6,
                  maximumFractionDigits: 6
              }) + ' RBTC' // commission.currencyCode
            }
            {!auth.isLoggedIn && <span>0.000000 RBTC</span>}
            <Popover content={tooltip} placement="top">
              <div className="PayWithMocToken">
                <Switch
                    disabled={true}//{!enoughMOCBalance}
                    checked={false} //{commission.currencyCode === 'MOC'}
                    // onChange={setAllowance}
                    loading={loadingSwitch}
                />
              </div>
            </Popover>
          </div>
      );
    };*/
    /* const renderFooter = () => {
      return (
          <div className="MintOrRedeemTokenFooter AlignedAndCentered">
            <div className="ReserveInUSD">
            <span className="Conversion">
              1 {t('MoC.Tokens_RESERVE_code', {ns: 'moc'})} ={' '}
              {Number(bitcoinPrice).toLocaleString(formatLocalMap2[i18n.languages[0]], {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
              }) } USD
            </span>
              <span className="Disclaimer">{t('global.MintOrRedeemToken_AmountMayDiffer')}</span>
              <div className="TextLegend">{t('global.MintOrRedeemToken_AmountMayDiffer')}</div>
            </div>
            <div className="MainActions AlignedAndCentered" style={{ width: '22%'}}>
              <Button type="ghost" onClick={onClear}>
                {t('global.MintOrRedeemToken_Clear')}
              </Button>
              <Button
                  type="primary"
                  onClick={checkShowMintModal}
                  // disabled={!youExchangeIsValid || !youReceiveIsValid}
              >
                {isMint ? t('global.MintOrRedeemToken_Mint') : t('global.MintOrRedeemToken_Redeem')}
              </Button>
            </div>
          </div>
      );
    }; */

    return (
        <div className="Card MintCard MintOrRedeemToken"  style={{height: '23.4em'}}>
            <h3 className="CardTitle">Mint</h3>
            <Row className="MintSelectsContainer" gutter={15}>
                <Col span={12}>
                    <CoinSelect
                        // label="You Exchange"
                        title={t('global.MintOrRedeemToken_YouExchange')}
                        onCurrencySelect={onChangeCurrencyYouExchange}
                        onInputValueChange={onValueYouExchangeChange}
                        value={currencyYouExchange}
                        inputValueInWei={valueYouExchange}
                        currencyOptions={[token, 'RESERVE']}
                        // AccountData={auth.AccountData}
                        // UserBalanceData={auth.UserBalanceData}
                        token={token}
                    />
                    {/* <div
                        className="AlignedAndCentered"
                        style={{ marginTop: 10, columnGap: 10 }}
                    >
                        <div className="Name" style={{ flexGrow: 1 }}>
                            <div className="Gray">Fee (0.05%)</div>
                        </div>
                        <span className="Value" style={{ flexGrow: 1 }}>
                            {mocAllowance} MOC
                        </span>
                        <Switch
                            disabled={mocAllowance > 0}
                            onChange={onFeeChange}
                        />
                    </div> */}
                </Col>
                <Col span={12}>
                    <CoinSelect
                        title={t('global.MintOrRedeemToken_YouReceive')}
                        // label="You Receive"
                        inputValueInWei={valueYouReceive}
                        currencyOptions={[token, 'RESERVE']}
                        value={currencyYouReceive}
                        token={token}
                    />
                </Col>
            </Row>
            {/*renderComissionCurrencySwitch()*/}
            {/* renderFooter()*/}
            {/* <Row>
                <Col span={12}>
                    <div style={{ marginTop: 20 }}>
                        <div>
                            1 RBTC = {bitcoinPrice} USD
                        </div>
                        <div className="TextLegend">
                            * Amounts may be different at transaction
                            confirmation
                        </div>
                    </div>
                </Col>
                <Col
                    span={12}
                    style={{
                        display: 'flex',
                        alignItems: 'end',
                        justifyContent: 'end'
                    }}
                >
                    <Row style={{ marginTop: 20 }} gutter={15}>
                        <Col span={12}>
                            <Button type="ghost" onClick={onClear}>
                                Clear
                            </Button>
                        </Col>
                        <Col span={12}>
                            <Button type="primary" onClick={checkShowMintModal}>
                                {isMint ? 'Mint' : 'Redeem'}
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row> */}
            <MintModal
              visible={showMintModal}
              handleClose={closeMintModal}
              handleComplete={closeMintModal}
              color={color}
              currencyYouExchange={currencyYouExchange}
              currencyYouReceive={currencyYouReceive}
              // fee={commission}
              // interests={interests}
              valueYouExchange={valueYouExchange}
              valueYouReceive={valueYouReceive}
              valueYouReceiveUSD={valueYouReceiveUSD}
              token={token}
              onCancel={closeMintModal}
              // setTolerance={setTolerance}
              actionIsMint={isMint}
              // tolerance={tolerance}
              exchanging={{
                // value: totals.totalYouExchange,
                currencyCode: currencyYouExchange
              }}
              receiving={{
                // value: totals.totalYouReceive,
                currencyCode: currencyYouReceive
              }}
            />
        </div>
    );
}
