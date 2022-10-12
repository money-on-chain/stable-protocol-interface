import { Row, Col, Tooltip } from 'antd';
//import { InfoCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AuthenticateContext } from '../../../Context/Auth';
import { useTranslation } from "react-i18next";
import { config} from '../../../Config/config';
//import BigNumber from "bignumber.js";

export default function Sovryn(props) {
    const {
        tokenName = '',
        color = '',
        titleName = '' } = props;

    const auth = useContext(AuthenticateContext);
    const [t, i18n] = useTranslation(["global", 'moc', 'rdoc']);
    const ns = config.environment.AppProject === 'MoC' ? 'moc' : 'rdoc';
    const AppProject = config.environment.AppProject;

    /*
    const getBalance = () => {
        if (auth.userBalanceData) {
            switch (tokenName) {
                case 'stable':
                    return auth.userBalanceData['docBalance'];
                case 'riskpro':
                    return auth.userBalanceData['bproBalance'];
                case 'riskprox':
                    return auth.userBalanceData['bprox2Balance'];
                default:
                    throw new Error('Invalid token name'); 
            }
        }
    };*/
    /*
    const getBalanceUSD = () => {
        if (auth.userBalanceData) {
            switch (tokenName) {
                case 'stable':
                    return Math.round(auth.userBalanceData['docBalance']).toFixed(2);
                case 'riskpro':
                    return auth.contractStatusData["bproPriceInUsd"];
                case 'riskprox':
                    return new BigNumber(auth.contractStatusData['bitcoinPrice'] * auth.userBalanceData['bprox2Balance']).toFixed(4);
                default:
                    throw new Error('Invalid token name'); 
            }
        }
    };*/
    return (
        <div className="Card FastCard">
            <Row>
                {/*<Col span={22}>*/}
                <div className="title">
                    <div className="CardLogo">
                        <img width="32" src={auth.urlBaseFull+'icons/icon-sovryn_fastbtc.svg'} alt="" />
                        <h1>Sovryn <br />FastBTC</h1>
                    </div>
                </div>
                {/*</Col>*/}
            </Row>
            <Row>
                <div className="content-container"><img className="logo-img" width="111"
                    src={auth.urlBaseFull+'icons/icon-rbtclogo.svg'}
                    alt="" />
                    <div className="FastBTCLeftPanel"><b>{t(`${AppProject}.fastbtc.leftPannel.header`, { ns: ns })}</b>
                        <ul>
                            <li className="instruction-item">{t(`${AppProject}.fastbtc.leftPannel.items.0`, { ns: ns })}</li>
                            <li className="instruction-item">{t(`${AppProject}.fastbtc.leftPannel.items.1`, { ns: ns })}</li>
                            <li className="instruction-item">{t(`${AppProject}.fastbtc.leftPannel.items.2`, { ns: ns })}</li>
                        </ul>
                        <a href="https://www.rsk.co/rbtc/" target="_blank" rel="noopener noreferrer">&gt; {t(`${AppProject}.fastbtc.leftPannel.learnMore`, { ns: ns })}</a></div>
                </div>
            </Row>

        </div>

    )
}