import { Row, Col, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import _ from 'lodash/core';
import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AuthenticateContext } from '../../../Context/Auth';
import { LargeNumber } from '../../LargeNumber';
import {useTranslation} from "react-i18next";
import convertHelper from '../../../Lib/convertHelper';
import { getPriceFields } from '../../../Lib/price';
import BalanceItem from '../../BalanceItem/BalanceItem';
import './style.scss';
const BigNumber = require('bignumber.js');

export default function AmountCard(props) {
    const [t, i18n]= useTranslation(["global",'moc']);
    const auth = useContext(AuthenticateContext);
    if(!auth) return null;
    const {
        tokenName = '', 
        color = '',
        titleName = ''} = props;

    const priceFields = getPriceFields();
    const mocStates = {
        fields: {
        ...priceFields,
        reservePrecision: 1,
        priceVariation: 1,
        commissionRates: 1,
        lastUpdateHeight: 1,
        isDailyVariation: 1
        }
    }
    const mocState = props.StatusData;
    let mocStatePrices;
    if(mocState?.length) {
      [mocStatePrices] = mocStates;
    }
    const convertToken = convertHelper(
        _.pick(mocStatePrices, Object.keys(priceFields).concat(['reservePrecision']))
    );

    const getBalance = () => {
        if (auth.userBalanceData) {
            switch (tokenName) {
                case 'STABLE':
                    return auth.userBalanceData['docBalance'];
                case 'RISKPRO':
                    return auth.userBalanceData['bproBalance'];
                case 'RISKPROX':
                    return auth.userBalanceData['bprox2Balance'];
            }
        }
    };
    const getBalanceUSD = () => {
        if (auth.userBalanceData) {
            switch (tokenName) {
                case 'STABLE':
                    return Math.round(auth.userBalanceData['docBalance']).toFixed(2);
                case 'RISKPRO':
                    return auth.contractStatusData["bproPriceInUsd"];
                case 'RISKPROX':
                    return new BigNumber(auth.contractStatusData['bitcoinPrice'] * auth.userBalanceData['bprox2Balance']).toFixed(4);
            }
        }
    };
    const convertTo = convertToCurrency => convertToken(tokenName, convertToCurrency, getBalance());
    // const converToUSD = convertToCurrency => convertToken(tokenName, convertToCurrency, getBalanceUSD());
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
                <div className="priceContainer">
                    <LargeNumber amount={getBalance()} currencyCode={tokenName} />
                    <div className="WalletCurrencyPrice">
                        <BalanceItem
                            amount={convertTo('RESERVE')}
                            currencyCode="RESERVE"/>
                        <BalanceItem
                            amount={convertTo('USD')}
                            currencyCode="USD"/>
                        </div>
                </div>

            </Row>
        </div>
        
    )
}