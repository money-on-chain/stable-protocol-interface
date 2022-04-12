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
                    if ( auth.contractStatusData['bitcoinPrice'] !=0 ){
                        return (auth.contractStatusData['bitcoinPrice'] / 1000).toFixed(4);
                    }else{
                        return 0;
                    }
                case 'riskpro':
                    if ( auth.contractStatusData["bproPriceInUsd"] !=0 ){
                        return (auth.contractStatusData["bproPriceInUsd"]/ 1000).toFixed(4);
                    }else{
                        return 0;
                    }

                case 'riskprox':
                    if ( auth.userBalanceData['bprox2Balance'] !=0 ){
                        return new BigNumber(auth.contractStatusData['bitcoinPrice'] * auth.userBalanceData['bprox2Balance']).toFixed(4)/ 1000;
                    }
                    else{
                        if ( auth.contractStatusData['bitcoinPrice'] !=0 ){
                            return new BigNumber(auth.contractStatusData['bitcoinPrice'] ).toFixed(4)/ 1000;
                        }else{
                            return 0;
                        }
                    }
            }
        }
    };

        return (
            <div className={'mrl-25 div_coin'}>
                <img src={window.location.origin +'/'+props.image} alt="arrow" height={38}/>
                <div className={'div_values'} >
                    <span className="value_usd">{getBalanceUSD()} USD</span>
                    <div className={'div_crypto'}>
                        <img className={'crypto_img'} src={window.location.origin +'/Moc/'+props.arrow} alt="arrow" height={11}/>
                        <span className={'crypto_value'} style={{color: `${props.color}`}}>0 (0)</span>
                    </div>
                </div>
            </div>

    )
}

export default HeaderCoins