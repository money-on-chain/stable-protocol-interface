import { Row, Col, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AuthenticateContext } from '../../../Context/Auth';
const BigNumber = require('bignumber.js');

export default function AmountCard(props) {
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
        <div className="Card CardAmount">
            <Row>
                <Col span={22}>
                    <h3 className="CardTitle">{titleName} Amount</h3>
                </Col>
                <Col span={2}>
                    <Tooltip placement="top" title={`Get information about ${titleName}`}>
                        <InfoCircleOutlined className="Icon"/>
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