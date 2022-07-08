import React, { useContext, useState, useEffect } from 'react';
import { Col, Row, Skeleton, Tooltip } from 'antd';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { Tooltip as TooltipRecharts } from 'recharts';
import { AuthenticateContext } from '../../../../Context/Auth';
import { getDatasMetrics } from '../../../../Helpers/helper';
import { useTranslation } from "react-i18next";
import { LargeNumber } from '../../../LargeNumber';
import { formatVisibleValue } from '../../../../Lib/Formats';

const COLORS = ['#ef8a13', '#00a651'];

function RBTC(props) {
    const auth = useContext(AuthenticateContext);
    const { accountData, convertToken } = auth;
    const [t, i18n] = useTranslation(["global", 'moc']);
    const [loading, setLoading] = useState(true);
    const timeSke= 1500;
    const totalRISKPROInUSD = convertToken("RISKPRO", "USD", props.totalRISKPRO);
    const totalRISKPROXInUSD = convertToken("RISKPROX", "USD", props.totalRISKPROX);
    // TODO
    const totalUSD = 0; // totalRISKPROInUSD?.plus(totalRISKPROXInUSD?.plus(props.totalSTABLE));
    const totalRBTC = convertToken("STABLE", "RESERVE", totalUSD);

    useEffect(() => {
        setTimeout(() => setLoading(false), timeSke)
    },[auth]);

    const setRbtc = () => {
        if (auth.userBalanceData && accountData.Balance) {
            const b0BproAmount = (auth.contractStatusData['b0BproAmount'] / 1000000000000000000).toFixed(6);
            const docAvailableToRedeem = (auth.contractStatusData['docAvailableToRedeem'] / 1000000000000000000000).toFixed(5);
            return { b0BproAmount: b0BproAmount, docAvailableToRedeem: docAvailableToRedeem }
        } else {
            return { b0BproAmount: 0, docAvailableToRedeem: 0 }
        }
    };

    const getPie = () => {
        if (auth.userBalanceData && accountData.Balance) {
            const data = [
                { name: 'Group A', value: Number(setRbtc()['docAvailableToRedeem']), set1: ' RBTC', set2: ' DOC', class: 'STABLE' },
                { name: 'Group B', value: Number(setRbtc()['b0BproAmount']), set1: ' RBTC', set2: ' BPRO', class: 'RISKPRO' }
            ];

            return data;
        }
    };

    const getRiskprox = getDatasMetrics(auth);
    const toShow = ({ totalSTABLE, totalRISKPRO, totalRISKPROX }) => {
        return [
          {
            currencyCode: "RISKPRO",
            balance: totalRISKPRO,
          },
          {
            currencyCode: "RISKPROX",
            balance: totalRISKPROX
          },
          {
            currencyCode: "STABLE",
            balance: totalSTABLE
          }
        ]
    };
    
    const tokensToShow = toShow({ totalSTABLE: props.totalSTABLE, totalRISKPRO: props.totalRISKPRO, totalRISKPROX: props.totalRISKPROX });

    const CustomTooltip = ({payload}) => {
        const data = payload && payload[0];
        if(!data) {
            return null;
        }
        return <div className="custom-tooltip pieChartTooltip">
        {/*<p className="label">{`${label} : ${payload[0].value}`}</p>*/}
        {/*<p className="intro">{getIntroOfPage(label)}</p>*/}
        <p className="value-1">{`${payload[0].payload.value} ${payload[0].payload.set1}`}</p>
        <p className={`${payload[0].payload.class}`}>{`${payload[0].payload.value} ${payload[0].payload.set2}`}</p>
    </div>
    }

    return (
        <div className="Card CardSystemStatus">
            <h3 className="CardTitle" style={{ fontSize: '1.4em' }}>
                <img
                    width={45}
                    src={'Moc/icon-reserve.svg'}
                    alt=""
                    style={{ marginRight: 10 }}
                /> {t('MoC.Tokens_RESERVE_name', { ns: 'moc' })}
            </h3>

            <div className="CardMetricContent">
                {!loading
                    ? <>
                        <div>
                            <h3 style={{ textAlign: 'center' }}>{t('MoC.metrics.infoRBTC.title', { ns: 'moc' })}</h3>
                            <div style={{ height: 180, width: 180, margin: '0 auto' }}>
                                <ResponsiveContainer style={{ marginLeft: '0 !important' }}>
                                    <PieChart>
                                        <Pie
                                            data={getPie()}
                                            innerRadius={40}
                                            outerRadius={90}
                                            fill="#8884d8"
                                            paddingAngle={1}
                                            dataKey="value"
                                        >
                                            {getPie() !== undefined &&

                                                getPie().map((_entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                        </Pie>
                                        <TooltipRecharts content={<CustomTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <LargeNumber amount={totalRBTC} currencyCode={"RESERVE"} includeCurrency={true} />
                                {/* <Tooltip placement="top" title={getRiskprox['totalBTCAmountTooltip']}>
                                    {getRiskprox['totalBTCAmount']} RBTC
                                </Tooltip> */}
                            </div>
                            <h3 style={{ textAlign: 'center' }}>
                                <LargeNumber amount={totalUSD} currencyCode="USD" includeCurrency={true} />
                                {/* <Tooltip placement='top' title={getRiskprox['totalBTCAmountUsdTooltip']}>
                                {getRiskprox['totalBTCAmountUsd']} USD
                                </Tooltip> */}
                            </h3>
                        </div>
                        <div className="separator" style={{ height: 220 }} />
                        <div style={{ marginLeft: 30 }}>
                        <h3>{t('MoC.metrics.infoRBTC.priceRBTC', { ns: 'moc' })}</h3>
                        <LargeNumber amount={props.rbtcPrice} currencyCode={"USDPrice"} includeCurrency={true} />
                        {/* <LargeNumber {...{ amount: getRiskprox['rbtc_usd'], currencyCode: 'RESERVE', includeCurrency: true }} /> */}
                        <h3>{t('MoC.metrics.infoRBTC.interest', { ns: 'moc' })}</h3>
                        <LargeNumber amount={props.b0BTCInrateBag} currencyCode={"RESERVE"} includeCurrency={true} />
                        {/* <Tooltip placement="top" title={getRiskprox['interestTooltip']}>
                            {getRiskprox['interest']} RBTC
                        </Tooltip> */}
                        <h3>{t('MoC.metrics.infoRBTC.EMA', { ns: 'moc' })}</h3>
                        <LargeNumber amount={props.EMA} currencyCode={"USDPrice"} includeCurrency={true} />
                        {/* <Tooltip placement="top" title={getRiskprox['bitcoinMovingAverageTooltip']}> 
                            {getRiskprox['bitcoinMovingAverage']} USD
                        </Tooltip> */}
                        <h3>{t('MoC.metrics.infoRBTC.targetCoverage', { ns: 'moc' })}</h3>
                        <LargeNumber amount={props.targetCoverage} currencyCode={"RESERVE"} includeCurrency={false} />
                        {/* <Tooltip placement="top" title={getRiskprox['b0TargetCoverageTooltip']}>
                            {getRiskprox['b0TargetCoverage']}
                        </Tooltip>*/}
                        </div></>
                    : <Skeleton active={true} />}
            </div>
        </div>
    );
}

export default RBTC;
