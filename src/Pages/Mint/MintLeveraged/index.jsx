import MintCard from '../../../Components/Cards/MintCard';
import AmountCard from '../../../Components/Cards/AmountCard';
import YourAddressCard from '../../../Components/Cards/YourAddressCard';
import {Row, Col, Tooltip, Alert, Card, Skeleton} from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import React, { useState, useEffect, Fragment, useContext } from 'react';
import TokenSummaryCard from '../../../Components/Cards/TokenSummaryCard';
import moment from 'moment';
import ListOperations from "../../../Components/Tables/ListOperations";
import { useTranslation } from "react-i18next";
import { AuthenticateContext } from '../../../Context/Auth';
import MintOrRedeemToken from '../../../Components/MintOrRedeemToken/MintOrRedeemToken';
import './style.scss'
import {getDatasMetrics} from "../../../Helpers/helper";
import {getInrateToSettlement} from "../../../Helpers/mocStateHelper";
import {LargeNumber} from "../../../Components/LargeNumber";

export default function Mint(props) {
    const [daysHours, setDaysHours] = useState(null);
    const auth = useContext(AuthenticateContext);

    useEffect(() => {
        const interval = setInterval(() => {
            if(auth.isLoggedIn){
                auth.loadContractsStatusAndUserBalance();
            }
        }, 30000);
        return () => clearInterval(interval);
    },[]);

    const decimaltoHour = (dayBlockSpan, blocksToSettlement) => {
        const result = {};
        const num = ((blocksToSettlement * 24) / dayBlockSpan);
        const minutos = num * 60;
        const segundos = minutos * 60;
        var seconds = Number(segundos);
        var d = Math.floor(seconds / (3600 * 24));
        var h = Math.floor(seconds % (3600 * 24) / 3600);
        var m = Math.floor(seconds % 3600 / 60);
        var s = Math.floor(seconds % 60);
        var dDisplay = d > 0 ? d + (d == 1 ? " day " : " days ") : "";
        var hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ") : "";
        var dDisplayLit = d > 0 ? d:'';
        var hDisplayLit = h > 0 ? h:'';
        var mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes ") : "";
        var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
        result.time = dDisplay + hDisplay;
        const today = moment().add(d, 'd').add(h, 'h').add(s, 's');
        result.date = moment(today).format('MMMM Do YYYY, h:mm:ss a');
        result.days = (dDisplayLit=='')? 0 : dDisplayLit;
        result.hours = (hDisplayLit=='')? 0 : hDisplayLit;
        return result;
    };

    useEffect(() => {
            if (auth.contractStatusData) {
                setDaysHours(decimaltoHour(auth.contractStatusData.dayBlockSpan, auth.contractStatusData.blocksToSettlement));
            }
    }, [auth]);

    const data_row_coins = [];

    const mocState = auth.contractStatusData;
    const inrateToSettlement = mocState && getInrateToSettlement(mocState);
    const formatDecimalRatioAsPercent = amount => (Number.isNaN(amount) ? 0 : amount * 100);

    data_row_coins.push({
        key: 0,
        info: '',
        event: 'DOC',
        asset: 'BTC',
        platform: '+ 0.00',
        wallet: '-0.000032',
        date: '2022-04-18 18:23',
        status: { txt: 'Confirmed', percent: 100 },
    });
    data_row_coins.push({
        key: 1,
        info: '',
        event: 'DOC',
        asset: 'BTC',
        platform: '+ 0.00',
        wallet: '-0.000032',
        date: '2022-04-18 18:23',
        status: { txt: 'Confirmed', percent: 100 },
    });

    const [t, i18n] = useTranslation(["global", 'moc'])
    const [loading, setLoading] = useState(true);
    const timeSke= 1500

    useEffect(() => {
        setTimeout(() => setLoading(false), timeSke)
    },[auth]);

    const getBtcx = getDatasMetrics(auth,i18n);

    return (
        <Fragment>
            <h1 className="PageTitle">{t('MoC.wallets.RISKPROX.title', { ns: 'moc' })}</h1>
            <h3 className="PageSubTitle">{t('MoC.wallets.RISKPROX.subtitle', { ns: 'moc' })}</h3>
            <Row gutter={15}>
                <Col xs={24} md={12} xl={5}>
                    <AmountCard
                        tokenName="RISKPROX"
                        titleName="BTCx"
                        StatusData={auth.contractStatusData}
                    />
                </Col>
                <Col xs={24} md={12} xl={5}>
                    <Row>
                        <Col span={24}>
                            <div className="Card MintCard CardSettlement"  style={{minHeight:'144px'}}>
                                <h3 className="CardTitle">{t('global.riskproxWallet_NextSettlement', { ns: 'global' })}</h3>
                                {auth.isLoggedIn &&
                                    <>{!loading ?
                                        <Row>
                                            <h2>{ t('MoC.settlement.remainingDays', { ns: 'moc' ,days:daysHours?.days, hours:daysHours?.hours}) }</h2>
                                            <div className="CaptionDateSettlement">{daysHours?.date}</div>
                                            <div>
                                                <span className="SettlementTitle">{t('MoC.settlement.remainingBlocks', { ns: 'moc' })}: </span>
                                                {auth.contractStatusData?.blocksToSettlement}
                                                <Tooltip placement="top" title={auth.contractStatusData?.blockHeight}>
                                                    <InfoCircleOutlined className="Icon" />
                                                </Tooltip>
                                            </div>
                                        </Row>:
                                        <Row>
                                            <Skeleton active={true} paragraph={{ rows: 0 }}></Skeleton>
                                        </Row>
                                    }</>
                                }
                            </div>
                        </Col>
                        <Col span={24} style={{ marginTop: '1em' }}>

                            <div className="Card MintCard Bprox2Metrix">
                                {!loading ? <>
                                <h3 className="CardTitle">{t('MoC.general.x2Leverage', { ns: 'moc' })}</h3>
                                <div>
                                    <span>{getBtcx['x2Leverage']}</span>
                                </div>
                                <h3 className="CardTitle">{t('global.riskproxWallet_CurrentRate', { ns: 'global' })}</h3>
                                <div>
                                    {/*<span>0.027379</span>*/}
                                    <LargeNumber
                                        amount={formatDecimalRatioAsPercent(inrateToSettlement)}
                                        showCurrencyCode
                                        currencyCode="RISKPROXInterest"
                                    />
                                </div></>: <Skeleton active={true} paragraph={{ rows: 2 }}></Skeleton>
                            }
                            </div>
                        </Col>
                    </Row>
                </Col>
                <Col xs={24} xl={14}>
                    {/* <MintCard
                        token={'RISKPROX'}
                        AccountData={auth.accountData}
                        UserBalanceData={auth.userBalanceData}
                        StatusData={auth.contractStatusData}
                        currencyOptions={['RESERVE', 'RISKPROX']}
                        color="#ed1c24"
                    /> */}
                    <MintOrRedeemToken
                        token={'RISKPROX'}
                        AccountData={auth.accountData}
                        userState={auth.userBalanceData}
                        mocState={auth.contractStatusData}
                    />
                </Col>
            </Row>
            <div className="Card WalletOperations">
                <ListOperations token={'RISKPROX'}></ListOperations>
            </div>
        </Fragment>
    );
}
