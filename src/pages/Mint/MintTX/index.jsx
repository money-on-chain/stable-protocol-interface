import AmountCard from '../../../components/Cards/AmountCard';
import {Row, Col, Tooltip, Alert, Card, Skeleton} from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import React, { useState, useEffect, Fragment, useContext } from 'react';
import moment from 'moment';

import ListOperations from "../../../components/Tables/ListOperations";
import { AuthenticateContext } from '../../../context/Auth';
import MintOrRedeemToken from '../../../components/MintOrRedeemToken/MintOrRedeemToken';
import { config } from '../../../projects/config';
import {getDatasMetrics} from "../../../helpers/helper";
import {getInrateToSettlement} from "../../../helpers/mocStateHelper";
import {LargeNumber} from "../../../components/LargeNumber";
import { useProjectTranslation } from '../../../helpers/translations';

import './../../../assets/css/pages.scss';

export default function Mint(props) {

    const [daysHours, setDaysHours] = useState(null);
    const auth = useContext(AuthenticateContext);

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
    
    const mocState = auth.contractStatusData;
    const inrateToSettlement = mocState && getInrateToSettlement(mocState);
    const formatDecimalRatioAsPercent = amount => (Number.isNaN(amount) ? 0 : amount * 100);

    const [t, i18n, ns] = useProjectTranslation();
    const AppProject = config.environment.AppProject;
    const [loading, setLoading] = useState(true);
    const timeSke= 1500

    useEffect(() => {
        setTimeout(() => setLoading(false), timeSke)
    },[auth]);

    const getBtcx = getDatasMetrics(auth,i18n);

    return (
        <Fragment>
            <h1 className="PageTitle">{t(`${AppProject}.wallets.TX.title`, { ns: ns })}</h1>
            <h3 className="PageSubTitle">{t(`${AppProject}.wallets.TX.subtitle`, { ns: ns })}</h3>
            <Row gutter={15}>
                <Col xs={24} md={12} xl={5}>
                    <AmountCard
                        tokenName="TX"
                        titleName="BTCx"
                        StatusData={auth.contractStatusData}
                    />
                </Col>
                <Col xs={24} md={12} xl={5}>
                    <Row>
                        <Col span={24}   style={{minHeight:'163px'}}>
                            <div className="Card MintCard CardSettlement"  style={{minHeight:'100%'}}>
                                <h3 className="CardTitle">{t('global.txWallet_NextSettlement', { ns: 'global' })}</h3>
                                {auth.isLoggedIn &&
                                    <>{!loading ?
                                        <Row>
                                            <h2>{ t(`${AppProject}.settlement.remainingDays`, { ns: ns, days:daysHours?.days, hours:daysHours?.hours}) }</h2>
                                            <div className="CaptionDateSettlement">{daysHours?.date}</div>
                                            <div>
                                                <span className="SettlementTitle">{t(`${AppProject}.settlement.remainingBlocks`, { ns: ns })}: </span>
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
                        <Col span={24} style={{ marginTop: '1em',minHeight:'163px' }}>

                            <div className="Card MintCard Bprox2Metrix">
                                {!loading ? <>
                                <h3 className="CardTitle">{t(`${AppProject}.general.x2Leverage`, { ns: ns })}</h3>
                                <div>
                                    <span>{getBtcx['x2Leverage']}</span>
                                </div>
                                <h3 className="CardTitle">{t('global.txWallet_CurrentRate', { ns: 'global' })}</h3>
                                <div>
                                    {/*<span>0.027379</span>*/}
                                    <LargeNumber
                                        amount={formatDecimalRatioAsPercent(inrateToSettlement)}
                                        showCurrencyCode
                                        currencyCode="TXInterest"
                                    />
                                </div></>: <Skeleton active={true} paragraph={{ rows: 2 }}></Skeleton>
                            }
                            </div>
                        </Col>
                    </Row>
                </Col>
                <Col xs={24} xl={14}>
                    <MintOrRedeemToken
                        token={'TX'}
                        AccountData={auth.accountData}
                        userState={auth.userBalanceData}
                        mocState={auth.contractStatusData}
                        style={'height'}
                    />
                </Col>
            </Row>
            <div className="Card WalletOperations">
                <ListOperations token={'TX'}></ListOperations>
            </div>
        </Fragment>
    );
}
