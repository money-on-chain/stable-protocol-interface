/* eslint-disable default-case */

import React, { Fragment, useContext, useEffect, useState } from 'react';
import web3 from 'web3';
import BigNumber from 'bignumber.js';

import { AuthenticateContext } from '../../../context/Auth';
import PriceVariation from '../../PriceVariation';
import { LargeNumber } from '../../LargeNumber';
import { useProjectTranslation } from '../../../helpers/translations';
import './style.scss';

function HeaderCoins(props) {
    const auth = useContext(AuthenticateContext);
    const { image, arrow, color, tokenName } = props;
    const [timeRefresh, setTimeRefresh] = useState(new Date());

    useEffect(() => {
        setInterval(() => {
            setTimeRefresh(new Date());
        }, 30000);
    }, [auth]);

    const [t, i18n, ns] = useProjectTranslation();

    const getBalanceUSD = () => {
        if (auth.contractStatusData) {
            switch (props.tokenName) {
                case 'TP':
                    if (auth.contractStatusData['bitcoinPrice'] !== 0) {
                        return auth.contractStatusData['bitcoinPrice'];
                    } else {
                        return 0;
                    }
                case 'TC':
                    if (auth.contractStatusData['bproPriceInUsd'] !== 0) {
                        return auth.contractStatusData['bproPriceInUsd'];
                    } else {
                        return 0;
                    }
                case 'TX':
                    if (auth.contractStatusData['bprox2PriceInRbtc'] !== 0) {
                        const txPrice = new BigNumber(
                            web3.utils.fromWei(
                                auth.contractStatusData['bitcoinPrice']
                            )
                        ).times(
                            new BigNumber(
                                web3.utils.fromWei(
                                    auth.contractStatusData['bprox2PriceInRbtc']
                                )
                            )
                        );
                        return web3.utils.toWei(txPrice.toFixed(6), 'ether');
                    } else {
                        return 0;
                    }
                case 'TG':
                    if (auth.contractStatusData['mocPrice'] !== 0) {
                        return auth.contractStatusData['mocPrice'];
                    } else {
                        return 0;
                    }
            }
        }
    };

    const getPriceVariation = () => {
        if (auth.contractStatusData) {
            switch (tokenName) {
                case 'RESERVE':
                case 'TP':
                    return {
                        day: new BigNumber(
                            web3.utils.fromWei(
                                auth.contractStatusData.historic.bitcoinPrice
                            )
                        ),
                        current: new BigNumber(
                            web3.utils.fromWei(
                                auth.contractStatusData.bitcoinPrice
                            )
                        )
                    };
                case 'TC':
                    return {
                        day: new BigNumber(
                            web3.utils.fromWei(
                                auth.contractStatusData.historic.bproPriceInUsd
                            )
                        ),
                        current: new BigNumber(
                            web3.utils.fromWei(
                                auth.contractStatusData.bproPriceInUsd
                            )
                        )
                    };
                case 'TX':
                    return {
                        day: new BigNumber(
                            web3.utils.fromWei(
                                auth.contractStatusData.historic.bitcoinPrice
                            )
                        ).times(
                            new BigNumber(
                                web3.utils.fromWei(
                                    auth.contractStatusData.historic
                                        .bprox2PriceInRbtc
                                )
                            )
                        ),
                        current: new BigNumber(
                            web3.utils.fromWei(
                                auth.contractStatusData.bitcoinPrice
                            )
                        ).times(
                            new BigNumber(
                                web3.utils.fromWei(
                                    auth.contractStatusData.bprox2PriceInRbtc
                                )
                            )
                        )
                    };
                case 'TG':
                    return {
                        day: new BigNumber(
                            web3.utils.fromWei(
                                auth.contractStatusData.historic.mocPrice
                            )
                        ),
                        current: new BigNumber(
                            web3.utils.fromWei(auth.contractStatusData.mocPrice)
                        )
                    };
                default:
            }
        }
    };

    return (
        <>
            {
                <div className={'mrl-25 div_coin'}>
                    {/*<img src={image} alt="arrow" height={38}/>*/}
                    {image}
                    <div className={'div_values'}>
                        <span className="value_usd1">
                            <LargeNumber
                                {...{
                                    amount: getBalanceUSD(),
                                    currencyCode: 'USDPrice',
                                    includeCurrency: true
                                }}
                            />
                        </span>
                        {auth.contractStatusData && (
                            <PriceVariation
                                tokenName={tokenName}
                                priceVariation={getPriceVariation()}
                                blockHeight={
                                    auth.contractStatusData.historic.blockHeight
                                }
                            />
                        )}
                    </div>
                </div>
            }
        </>
    );
}

export default HeaderCoins;
