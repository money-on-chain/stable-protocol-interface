import React, { useContext, useState, useEffect } from 'react';
import { Skeleton } from 'antd';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { Tooltip as TooltipRecharts } from 'recharts';
import BigNumber from 'bignumber.js';

import { AuthenticateContext } from '../../../../context/Auth';
import { LargeNumber } from '../../../LargeNumber';
import {
    formatVisibleValue,
    formatLocalMap2,
    adjustPrecision
} from '../../../../helpers/Formats';
import { config } from '../../../../projects/config';
import { useProjectTranslation } from '../../../../helpers/translations';

import { ReactComponent as LogoIcon } from '../../../../assets/icons/icon-reserve.svg';

const BalancePieColors = config.home.walletBalancePie.colors;

function Reserve(props) {
    const auth = useContext(AuthenticateContext);
    const { convertToken } = auth;
    const [t, i18n, ns] = useProjectTranslation();
    const AppProject = config.environment.AppProject;
    const [loading, setLoading] = useState(true);
    const timeSke = 1500;
    const totalTCInUSD = convertToken('TC', 'USD', props.totalTC);
    const totalTXInUSD = convertToken('TX', 'USD', props.totalTX);
    const totalUSD = totalTCInUSD
        ? totalTCInUSD?.plus(totalTXInUSD?.plus(props.totalTP))
        : 0;
    const totalRBTC = convertToken('TP', 'RESERVE', totalUSD);

    useEffect(() => {
        setTimeout(() => setLoading(false), timeSke);
    }, [auth]);

    const toShow = ({ totalTP, totalTC, totalTX }) => {
        return [
            {
                currencyCode: 'TC',
                balance: totalTC
            },
            {
                currencyCode: 'TX',
                balance: totalTX
            },
            {
                currencyCode: 'TP',
                balance: totalTP
            }
        ];
    };

    const tokensToShow = toShow({
        totalTP: props.totalTP,
        totalTC: props.totalTC,
        totalTX: props.totalTX
    });

    let totalBalance = new BigNumber(0);
    let balancesData = tokensToShow.map(({ balance, currencyCode }) => {
        const balanceInReserve = convertToken(currencyCode, 'RESERVE', balance);
        const balanceInReserveInEther = adjustPrecision(
            balanceInReserve,
            'RESERVE'
        ).value;
        totalBalance = totalBalance.plus(balance);
        return {
            reserveValue: balanceInReserveInEther.toNumber(),
            currencyCode: currencyCode,
            balance
        };
    });
    balancesData = balancesData.filter(({ balance }) =>
        new BigNumber(balance).gt(0)
    );
    if (totalBalance.eq(0)) {
        balancesData.push({
            currencyCode: 'EMPTY',
            reserveValue: 1
        });
    }

    const CustomTooltip = ({ payload }) => {
        const data = payload && payload[0];
        if (!data) {
            return null;
        }
        return (
            <div className="pieChartTooltip">
                {data.payload.currencyCode !== 'EMPTY' ? (
                    <>
                        <div>
                            {data.payload.reserveValue.toFixed(6)}{' '}
                            {t(`${AppProject}.Tokens_RESERVE_code`, { ns: ns })}
                        </div>
                        <div className={`${data.payload.currencyCode}`}>
                            {formatVisibleValue(
                                data.payload.balance,
                                data.payload.currencyCode,
                                formatLocalMap2[i18n.languages[0]]
                            )}{' '}
                            {t(
                                `${AppProject}.Tokens_${data.payload.currencyCode}_code`,
                                { ns: ns }
                            )}
                        </div>{' '}
                    </>
                ) : (
                    <div>{t(`global.TotalBalanceCard_noFunds`)}</div>
                )}
            </div>
        );
    };

    return (
        <div className="Card CardSystemStatus">
            <h3
                className="CardTitle"
                style={{
                    fontSize: '1.4em',
                    display: 'inline-flex',
                    'align-items': 'center'
                }}
            >
                <LogoIcon
                    width="45"
                    height="45"
                    alt="Token Reserve"
                    style={{ marginRight: 10 }}
                />{' '}
                {t(`${AppProject}.Tokens_RESERVE_name`, { ns: ns })}
            </h3>

            <div className="CardMetricContent">
                {!loading ? (
                    <>
                        <div>
                            <h3 style={{ textAlign: 'center' }}>
                                {t(`${AppProject}.metrics.infoRBTC.title`, {
                                    ns: ns
                                })}
                            </h3>
                            <div
                                style={{
                                    height: 180,
                                    width: 180,
                                    margin: '0 auto'
                                }}
                                className="PieChart"
                            >
                                <ResponsiveContainer
                                    style={{ marginLeft: '0 !important' }}
                                >
                                    <PieChart>
                                        <Pie
                                            data={balancesData}
                                            innerRadius={40}
                                            outerRadius={90}
                                            fill={['#fff']}
                                            paddingAngle={1}
                                            dataKey="reserveValue"
                                        >
                                            {balancesData.map(
                                                (entry, index) => (
                                                    <Cell
                                                        key={index}
                                                        fill={
                                                            BalancePieColors[
                                                                index %
                                                                    BalancePieColors.length
                                                            ]
                                                        }
                                                        className={`piePiece ${entry.currencyCode}`}
                                                    />
                                                )
                                            )}
                                        </Pie>
                                        <TooltipRecharts
                                            content={<CustomTooltip />}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <LargeNumber
                                    amount={totalRBTC}
                                    currencyCode={'RESERVE'}
                                    includeCurrency={true}
                                />
                            </div>
                            <h3 style={{ textAlign: 'center' }}>
                                <LargeNumber
                                    amount={totalUSD}
                                    currencyCode="USD"
                                    includeCurrency={true}
                                />
                            </h3>
                        </div>
                        <div className="separator" style={{ height: 220 }} />
                        <div style={{ marginLeft: 30 }}>
                            <h3>
                                {t(`${AppProject}.metrics.infoRBTC.priceRBTC`, {
                                    ns: ns
                                })}
                            </h3>
                            <LargeNumber
                                amount={props.rbtcPrice}
                                currencyCode={'USDPrice'}
                                includeCurrency={true}
                            />
                            <h3>
                                {t(`${AppProject}.metrics.infoRBTC.EMA`, {
                                    ns: ns
                                })}
                            </h3>
                            <LargeNumber
                                amount={props.EMA}
                                currencyCode={'USDPrice'}
                                includeCurrency={true}
                            />
                            <h3>
                                {t(
                                    `${AppProject}.metrics.infoRBTC.targetCoverage`,
                                    { ns: ns }
                                )}
                            </h3>
                            <LargeNumber
                                amount={props.targetCoverage}
                                currencyCode={'RESERVE'}
                                includeCurrency={false}
                            />
                        </div>
                    </>
                ) : (
                    <Skeleton active={true} />
                )}
            </div>
        </div>
    );
}

export default Reserve;
