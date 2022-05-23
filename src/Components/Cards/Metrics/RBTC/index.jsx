import React, { useContext } from 'react';
import { Col, Row } from 'antd';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { AuthenticateContext } from '../../../../Context/Auth';
import { getDatasMetrics } from '../../../../Helpers/helper';
import { useTranslation } from "react-i18next";

const COLORS = ['#ef8a13', '#00a651'];

function RBTC() {
    const auth = useContext(AuthenticateContext);
    const { accountData } = auth;
    const [t, i18n] = useTranslation(["global", 'moc']);

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

    const getRiskprox = getDatasMetrics(auth)

    return (
        <div className="Card CardSystemStatus">
            <h3 className="CardTitle" style={{ fontSize: '1.4em' }}>
                <img
                    width={45}
                    src={window.location.origin + '/Moc/icon-reserve.svg'}
                    alt=""
                    style={{ marginRight: 10 }}
                /> {t('MoC.Tokens_RESERVE_name', { ns: 'moc' })}
            </h3>

            <div className="CardMetricContent">
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

                                        getPie().map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))

                                    }
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ textAlign: 'center' }}>{getRiskprox['totalBTCAmount']} RBTC</div>
                    <h3 style={{ textAlign: 'center' }}>{getRiskprox['totalBTCAmountUsd']} USD</h3>
                </div>
                <div className="separator" style={{ height: 220 }} />
                <div style={{ marginLeft: 30 }}>
                    <h3>{t('MoC.metrics.infoRBTC.priceRBTC', { ns: 'moc' })}</h3>
                    {getRiskprox['rbtc_usd']} USD
                    <h3>{t('MoC.metrics.infoRBTC.interest', { ns: 'moc' })}</h3>
                    {getRiskprox['interest']} RBTC
                    <h3>{t('MoC.metrics.infoRBTC.EMA', { ns: 'moc' })}</h3>
                    {getRiskprox['bitcoinMovingAverage']} USD
                    <h3>{t('MoC.metrics.infoRBTC.targetCoverage', { ns: 'moc' })}</h3>
                    {getRiskprox['b0TargetCoverage']}
                </div>
            </div>
        </div>
    );
}

export default RBTC;
