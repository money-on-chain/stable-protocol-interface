import {Row, Col, Tooltip, Skeleton} from 'antd';
import _ from 'lodash/core';
import React, { Fragment, useEffect, useState } from 'react';
import { useContext } from 'react';
import { AuthenticateContext } from '../../../Context/Auth';
import { LargeNumber } from '../../LargeNumber';
import { useTranslation } from "react-i18next";
import BalanceItem from '../../BalanceItem/BalanceItem';
import InformationModal from '../../Modals/InformationModal';
import { formatLocalMap2 } from '../../../Lib/Formats';
import { config } from './../../../Config/config';


export default function AmountCard(props) {

    const [t, i18n] = useTranslation(["global", 'moc', 'rdoc']);
    const ns = config.environment.AppProject === 'MoC' ? 'moc' : 'rdoc';
    const AppProject = config.environment.AppProject;
    const auth = useContext(AuthenticateContext);
    const { convertToken } = auth;
    const [loading, setLoading] = useState(true);
    //const [show, setShow] = useState('');
    const timeSke= 2500

    useEffect(() => {
        setTimeout(() => setLoading(false), timeSke)
    },[auth.userBalanceData]);
    if (!auth) return null;
    const {
        tokenName = '',
        color = '',
        titleName = '' } = props;

    const getBalance = () => {
        if (auth.userBalanceData) {
            switch (tokenName) {
                case 'STABLE':
                    return auth.userBalanceData['docBalance'];
                case 'RISKPRO':
                    return auth.userBalanceData['bproBalance'];
                case 'RISKPROX':
                    return auth.userBalanceData['bprox2Balance'];
                default:
                    throw new Error('Invalid token name'); 
            }
        } else {
            switch (tokenName) {
                case 'stable':
                    return (0).toFixed(2)
                case 'riskpro':
                    return (0).toFixed(6)
                case 'riskprox':
                    return (0).toFixed(6)
                default:
                    throw new Error('Invalid token name'); 
            }
        }
    };
    /*
    const getBalanceUSD = () => {
        if (auth.userBalanceData) {
            switch (tokenName) {
                case 'STABLE':
                    return Number(auth.userBalanceData['docBalance']).toFixed(2);
                case 'RISKPRO':
                    return auth.contractStatusData["bproPriceInUsd"];
                case 'RISKPROX':
                    return new BigNumber(auth.contractStatusData['bitcoinPrice'] * auth.userBalanceData['bprox2Balance']).toFixed(4);
            }
        }
        else {
            return (0).toFixed(2)
        }
    };*/
    const convertTo = convertToCurrency => convertToken(tokenName, convertToCurrency, getBalance());
    // const converToUSD = convertToCurrency => ConvertToken(tokenName, convertToCurrency, getBalanceUSD());

    const pre_label = t(`${AppProject}.Tokens_${tokenName.toUpperCase()}_name`, { ns: ns })

    return (
        <Fragment>
            <div className="Card CardAmount">
                {!loading ? <>
                <Row>
                    <Col span={22}>
                        <h3 className="CardTitle">{t("global.TokenSummary_Amount", { ns: 'global', tokenName: pre_label })}</h3>
                    </Col>
                    <Col span={2}>
                        <InformationModal currencyCode={tokenName} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <img
                            width={56}
                            src={auth.urlBaseFull+`icon-${tokenName.toLowerCase()}.svg`}
                            alt="icon-wallet"
                        />
                    </Col>
                </Row>
                <Row className="tokenAndBalance">
                    <div className="priceContainer">
                        <Tooltip title={Number(getBalance())?.toLocaleString(formatLocalMap2[i18n.languages[0]])}>
                            <div className={`Number ${auth.getAppMode}-${tokenName}`}>
                            <LargeNumber {...{ amount: getBalance(), currencyCode: tokenName }} />
                            </div>
                        </Tooltip>
                        <div className="WalletCurrencyPrice">
                            <BalanceItem
                                amount={convertTo('RESERVE')}
                                currencyCode="RESERVE" />
                            <BalanceItem
                                amount={convertTo('USD')}
                                currencyCode="USD" />
                        </div>
                    </div>

                </Row></>:
                    <Skeleton active={true}  paragraph={{ rows: 4 }}></Skeleton>
                }
            </div>
        </Fragment>
    )
}