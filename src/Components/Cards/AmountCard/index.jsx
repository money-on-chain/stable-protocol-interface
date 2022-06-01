import { Row, Col, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AuthenticateContext } from '../../../Context/Auth';
import { useTranslation } from "react-i18next";
const BigNumber = require('bignumber.js');

export default function AmountCard(props) {
    const [t, i18n] = useTranslation(["global", 'moc']);
    const {
        tokenName = '',
        color = '',
        titleName = '' } = props;

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

    const pre_label = t(`MoC.Tokens_${tokenName.toUpperCase()}_name`, { ns: 'moc' })

    return (
        <div className="Card CardAmount">
            <Row>
                <Col span={22}>
                    <h3 className="CardTitle">{t("global.TokenSummary_Amount", { ns: 'global', tokenName: pre_label })}</h3>
                </Col>
                <Col span={2}>
                    <Tooltip placement="topRight" title={`${t('MoC.tokenInformationTooltip', { ns: 'moc' })} ${pre_label}`} >
                        <InfoCircleOutlined className="Icon" />
                    </Tooltip>
                </Col>
            </Row>
            <Row>
                <Col>
                    <img
                        width={56}
                        src={window.location.origin + `/Moc/icon-${tokenName}.svg`}
                        alt="icon-wallet"
                    />
                </Col>
            </Row>
            <Row className="tokenAndBalance">
                <div className="priceContainer">{getBalance()}</div>
                <div className="balanceItem">0,71847 RBTC</div> {/* tomar el valor reald de rbtc */}
                <div className="balanceItem">{getBalanceUSD()} USD</div>

            </Row>
        </div>

    )
}