import React, { useContext } from 'react';
import { Col, Row } from 'antd';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { AuthenticateContext } from '../../../../Context/Auth';

const COLORS = ['#ef8a13', '#00a651'];

function RBTC() {
    const auth = useContext(AuthenticateContext);
    const { accountData } = auth;

    const getPie = () => {
        if (auth.userBalanceData && accountData.Balance) {
            const data = [
                { name: 'Group A', value: 1, set1: ' RBTC', set2: ' DOC', class: 'STABLE' },
                { name: 'Group B', value: 0.5, set1: ' RBTC', set2: ' BPRO', class: 'RISKPRO' }
            ];

            return data;
        }
    };

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
                    <div style={{ textAlign: 'center' }}>5.774093 RBTC</div>
                    <h3 style={{ textAlign: 'center' }}>222,309.98 USD</h3>
                </div>
                <div className="separator" style={{ height: 220 }}/>
                <div style={{ marginLeft: 30 }}>
                    <h3>rBTC USD</h3>
                    38,621.60 USD
                    <h3>rBTC in interest bag</h3>
                    0.000000 RBTC
                    <h3>rBTC EMA 120</h3>
                    44,081.56 USD
                    <h3>Target coverage</h3>
                    4.000000
                </div>
            </div>
        </div>
    );
}

export default RBTC;
