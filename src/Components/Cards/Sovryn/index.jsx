import './style.scss'
import { Row, Col, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AuthenticateContext } from '../../../Context/Auth';
const BigNumber = require('bignumber.js');

export default function Sovryn(props) {
    const {
        tokenName = '',
        color = '',
        titleName = ''} = props;

    const auth = useContext(AuthenticateContext);
    const getBalance = () => {
        if (auth.userBalanceData) {
            switch (tokenName) {
                case 'stable':
                    return auth.userBalanceData['docBalance'];
                case 'riskpro':
                    return auth.userBalanceData['bproBalance'];
                case 'riskprox':
                    return auth.userBalanceData['bprox2Balance'];
            }
        }
    };
    const getBalanceUSD = () => {
        if (auth.userBalanceData) {
            switch (tokenName) {
                case 'stable':
                    return Math.round(auth.userBalanceData['docBalance']).toFixed(2);
                case 'riskpro':
                    return auth.contractStatusData["bproPriceInUsd"];
                case 'riskprox':
                    return new BigNumber(auth.contractStatusData['bitcoinPrice'] * auth.userBalanceData['bprox2Balance']).toFixed(4);
            }
        }
    };
    return (
        <div className="Card FastCard">
            <Row>
                {/*<Col span={22}>*/}
                    <div className="title">
                        <div className="CardLogo">
                            <img width="32" src="https://static.moneyonchain.com/moc-alphatestnet/public/images/icon-sovryn_fastbtc.svg" alt=""/>
                            <h1>Sovryn <br/>FastBTC</h1>
                        </div>
                    </div>
                {/*</Col>*/}
            </Row>
            <Row>
                <div className="content-container"><img className="logo-img" width="111"
                                                        src="https://static.moneyonchain.com/moc-alphatestnet/public/images/icon-rbtclogo.svg"
                                                        alt=""/>
                    <div className="FastBTCLeftPanel"><b>You will need rBTC in your wallet to:</b>
                        <ul>
                            <li className="instruction-item">Mint DoC and BPro</li>
                            <li className="instruction-item">Set BTCx positions</li>
                            <li className="instruction-item">Pay gas fees on RSK network</li>
                        </ul>
                        <a href="https://www.rsk.co/rbtc/" target="_blank" rel="noopener noreferrer">&gt; Learn more
                            about rBTC</a></div>
                </div>
            </Row>

        </div>

    )
}