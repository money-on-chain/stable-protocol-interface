import './style.scss'
import React, {Fragment, useContext} from 'react';
import { AuthenticateContext } from '../../../Context/Auth'
const BigNumber = require('bignumber.js');

function HeaderCoins(props) {

    const auth= useContext(AuthenticateContext);

    const getBalanceUSD = () => {
        if (auth.userBalanceData) {
            switch (props.tokenName) {
                case 'stable':
                    return auth.contractStatusData['bitcoinPrice'];
                case 'riskpro':
                    return auth.contractStatusData["bproPriceInUsd"];
                case 'riskprox':
                    return new BigNumber(auth.contractStatusData['bitcoinPrice'] * auth.userBalanceData['bprox2Balance']).toFixed(4);
            }
        }
    };

        return (
            <div className={'mrl-25 div_coin'}>
                <img src={window.location.origin +'/'+props.image} alt="arrow" height={38}/>
                <div className={'div_values'} >
                    <span className="value_usd">{getBalanceUSD()} usd</span>
                    <div className={'div_crypto'}>
                        <img className={'crypto_img'} src={window.location.origin +'/Moc/'+props.arrow} alt="arrow" height={props.arrow_size}/>
                        <span className={'crypto_value'} style={{color: `${props.color}`}}>+172.49 (0.62%)</span>
                    </div>
                </div>
            </div>

    )
}

export default HeaderCoins