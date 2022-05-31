import './style.scss'
import { Row, Col, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AuthenticateContext } from '../../../Context/Auth';
import { useTranslation } from "react-i18next";
const BigNumber = require('bignumber.js');

export default function Sovryn(props) {
    const {
        tokenName = '',
        color = '',
        titleName = '' } = props;

    const auth = useContext(AuthenticateContext);
    const [t, i18n] = useTranslation(["global", 'moc']);

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
                        <img width="32" src="https://static.moneyonchain.com/moc-alphatestnet/public/images/icon-sovryn_fastbtc.svg" alt="" />
                        <h1>Sovryn <br />FastBTC</h1>
                    </div>
                </div>
                {/*</Col>*/}
            </Row>
            <Row>
                <div className="content-container"><img className="logo-img" width="111"
                    src="https://static.moneyonchain.com/moc-alphatestnet/public/images/icon-rbtclogo.svg"
                    alt="" />
                    <div className="FastBTCLeftPanel"><b>{t('MoC.fastbtc.leftPannel.header', { ns: 'moc' })}</b>
                        <ul>
                            <li className="instruction-item">{t('MoC.fastbtc.leftPannel.items.0', { ns: 'moc' })}</li>
                            <li className="instruction-item">{t('MoC.fastbtc.leftPannel.items.1', { ns: 'moc' })}</li>
                            <li className="instruction-item">{t('MoC.fastbtc.leftPannel.items.2', { ns: 'moc' })}</li>
                        </ul>
                        <a href="https://www.rsk.co/rbtc/" target="_blank" rel="noopener noreferrer">&gt; {t('MoC.fastbtc.leftPannel.learnMore', { ns: 'moc' })}</a></div>
                </div>
            </Row>

        </div>

    )
}