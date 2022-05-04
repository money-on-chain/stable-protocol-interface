import React, { useContext } from 'react';
import { Col, Row } from 'antd';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { AuthenticateContext } from '../../../../Context/Auth';
const BigNumber = require('bignumber.js');

const COLORS = ['#ef8a13', '#00a651'];

function RBTC() {
    const auth = useContext(AuthenticateContext);
    const {accountData} = auth;


    const setRbtc= () =>{
        if (auth.userBalanceData && accountData.Balance) {
            // const btc_usd= new BigNumber(auth.contractStatusData['bitcoinPrice'] * auth.userBalanceData['bprox2Balance']).toFixed(4)
            // const btc= auth.userBalanceData['bprox2Balance'];

            const b0BproAmount= (auth.contractStatusData['b0BproAmount'] /1000000000000000000).toFixed(6);
            const docAvailableToRedeem= (auth.contractStatusData['docAvailableToRedeem'] /1000000000000000000000).toFixed(5);
            return {b0BproAmount:b0BproAmount,docAvailableToRedeem:docAvailableToRedeem}
        }else{
            return {b0BproAmount:0,docAvailableToRedeem:0}
        }
    };

    const getPie = () => {
        if (auth.userBalanceData && accountData.Balance) {
            const data = [
                {name: 'Group A', value: Number(setRbtc()['docAvailableToRedeem']), set1: ' RBTC', set2: ' DOC', class: 'STABLE'},
                {name: 'Group B', value: Number(setRbtc()['b0BproAmount']), set1: ' RBTC', set2: ' BPRO', class: 'RISKPRO'}
            ];

            return data;
        }
    };

    const coin_usd= 38957.70

    const getRiskprox = () => {
        if (auth.userBalanceData) {
            if (auth.userBalanceData) {
                // return new BigNumber(auth.contractStatusData['bitcoinPrice'] * auth.userBalanceData['bprox2Balance']).toFixed(4) / 1000;
                const rbtc_usd= new BigNumber(auth.contractStatusData['bitcoinPrice'] * auth.userBalanceData['bprox2Balance']).toFixed(4) / 1000
                const rbtc_interest= auth.userBalanceData['bprox2Balance'];
                const totalBTCAmount= (auth.contractStatusData['totalBTCAmount'] /1000000000000000000).toFixed(6);
                const totalBTCAmountUsd= ((totalBTCAmount * coin_usd)/1000).toFixed(6)
                const b0TargetCoverage=  (auth.contractStatusData['b0TargetCoverage'] /1000000000000000000).toFixed(6);
                const bitcoinMovingAverage=  (auth.contractStatusData['bitcoinMovingAverage'] /1000000000000000000000).toFixed(5);
                return {usd:rbtc_usd,interest:rbtc_interest,totalBTCAmount:totalBTCAmount,totalBTCAmountUsd:totalBTCAmountUsd,b0TargetCoverage:b0TargetCoverage,bitcoinMovingAverage:bitcoinMovingAverage};
            } else{
                return {usd:0,interest:0,totalBTCAmount:0,totalBTCAmountUsd:0,b0TargetCoverage:0,bitcoinMovingAverage:0};
            }
        }else{
            return {usd:0,interest:0,totalBTCAmount:0,totalBTCAmountUsd:0,b0TargetCoverage:0,bitcoinMovingAverage:0};
        }
    }

    return (
        <div className="Card CardSystemStatus">
            <h3 className="CardTitle" style={{ fontSize: '1.4em' }}>
                <img
                    width={45}
                    src={window.location.origin + '/Moc/icon-reserve.svg'}
                    alt=""
                    style={{ marginRight: 10 }}
                /> rBTC
            </h3>

            <div className="CardMetricContent">
                <div>
                    <h3 style={{ textAlign: 'center' }}>Total rBTC in the system</h3>
                    <div style={{ height: 180, width: 180, margin: '0 auto' }}>
                        <ResponsiveContainer style={{marginLeft: '0 !important'}}>
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
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                                    ))

                                    }
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ textAlign: 'center' }}>{getRiskprox()['totalBTCAmount']} RBTC</div>
                    <h3 style={{ textAlign: 'center' }}>{getRiskprox()['totalBTCAmountUsd']} USD</h3>
                </div>
                <div className="separator" style={{ height: 220 }}/>
                <div style={{ marginLeft: 30 }}>
                    <h3>rBTC USD</h3>
                    {getRiskprox()['usd']} USD
                    <h3>rBTC in interest bag</h3>
                    {getRiskprox()['interest']} RBTC
                    <h3>rBTC EMA 120</h3>
                    {getRiskprox()['bitcoinMovingAverage']} USD
                    <h3>Target coverage</h3>
                    {getRiskprox()['b0TargetCoverage']}
                </div>
            </div>
        </div>
    );
}

export default RBTC;
