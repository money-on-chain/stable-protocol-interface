import { ArrowRightOutlined } from '@ant-design/icons';
import {Row, Col, Tooltip, Skeleton} from 'antd';
import React, {useEffect, useState} from 'react';
import { useContext } from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { AuthenticateContext } from '../../../Context/Auth';
import { currencies as currenciesDetail, getCurrencyDetail } from '../../../Config/currentcy';
import { LargeNumber } from "../../LargeNumber";
import { useTranslation } from "react-i18next";
import InformationModal from '../../Modals/InformationModal';
import {getCoinName, setToLocaleString} from "../../../Helpers/helper";
import { config } from "../../../Config/config";

const BigNumber = require('bignumber.js');

const styleCentered = {
    display: 'flex',
    alignItems: 'center',
    justifyItems: 'center'
};

export default function TokenSummaryCard(props) {
    const navigate = useNavigate();
    const {
        tokenName = '',
        // color = '#000',
        page = '',
        balance = '0',
        labelCoin = '',
        currencyCode = ''
    } = props;

    const auth = useContext(AuthenticateContext);
    const [t, i18n] = useTranslation(["global", 'moc'])

    const getBalance = (tooltip) => {
        if (auth.userBalanceData) {
            switch (tokenName) {
                case 'stable':
                    return setToLocaleString((auth.userBalanceData['docBalance'] / auth.contractStatusData.bitcoinPrice).toFixed(!tooltip ? config.environment.tokens.STABLE.decimals : 20),!tooltip ? config.environment.tokens.STABLE.decimals : 20,i18n)
                case 'riskpro':
                    return setToLocaleString(((auth.web3.utils.fromWei(auth.contractStatusData['bproPriceInUsd']) * auth.web3.utils.fromWei(auth.userBalanceData['bproBalance'])) / auth.web3.utils.fromWei(auth.contractStatusData.bitcoinPrice)).toFixed(!tooltip ? config.environment.tokens.RISKPRO.decimals : 20),!tooltip ? config.environment.tokens.RISKPRO.decimals : 20,i18n)
                case 'riskprox':
                    return setToLocaleString(new BigNumber(auth.web3.utils.fromWei(auth.userBalanceData['bprox2Balance'])).toFixed(!tooltip ? parseInt(config.environment.tokens.RISKPROX.decimals) : 20),!tooltip ? parseInt(config.environment.tokens.RISKPROX.decimals) : 20,i18n)
            }
        } else {
            return (0).toFixed(6)
        }
    };
    const getBalanceUSD = (tooltip) => {
        if (auth.userBalanceData) {
            switch (tokenName) {
                case 'stable':
                    // return new BigNumber(auth.userBalanceData['docBalance']).toFixed(2)
                    return setToLocaleString(new BigNumber(auth.web3.utils.fromWei(auth.userBalanceData['docBalance'])).toFixed(!tooltip ? 2 : 20),!tooltip ? 2 : 20,i18n)
                case 'riskpro':
                    // return new BigNumber(auth.contractStatusData['bproPriceInUsd'] * auth.userBalanceData['bproBalance']).toFixed(2);
                    return setToLocaleString(new BigNumber(auth.web3.utils.fromWei(auth.contractStatusData['bproPriceInUsd']) * auth.web3.utils.fromWei(auth.userBalanceData['bproBalance'])).toFixed(!tooltip ? 2 : 20),!tooltip ? 2 : 20,i18n)
                case 'riskprox':
                    // return new BigNumber(auth.contractStatusData['bitcoinPrice'] * auth.userBalanceData['bprox2Balance']).toFixed(2);
                    return setToLocaleString(new BigNumber(auth.web3.utils.fromWei(auth.contractStatusData['bitcoinPrice']) * auth.web3.utils.fromWei(auth.userBalanceData['bprox2Balance'])).toFixed(!tooltip ? 2 : 20),!tooltip ? 2 : 20,i18n)
            }
        } else {
            return (0).toFixed(2)
        }
    };

    const { convertToken } = auth;
    const convertTo = convertToCurrency => convertToken(tokenName, convertToCurrency, 900114098986076075281);

    const [loading, setLoading] = useState(true);
    const timeSke= 1500
    const AppProject = config.environment.AppProject;

    useEffect(() => {
        setTimeout(() => setLoading(false), timeSke);
    },[auth]);

    return (
        // <Row className="Card TokenSummaryCard" style={{'height':'135px'}}>
        <Row className="Card TokenSummaryCard" style={{'height':'135px','display':'flex'}}>
            {!loading ? <>
            <InformationModal currencyCode={currencyCode} />
            <Col
                // span={7}
                style={{
                    ...styleCentered,
                    textAlign: 'right',
                    'flexGrow':'0',
                    width:'160px'
                }}
            >
                <Row className="ArrowHomeIndicators arrow-center-values">
                    <Col
                        span={8}
                        style={{
                            ...styleCentered,
                            justifyContent: 'flex-start'
                        }}
                    >
                        <img
                            height={45}
                            src={auth.urlBaseFull+`icon-${tokenName}.svg` }
                            alt="icon-wallet"
                        />
                    </Col>
                    <Col
                        span={16}
                        style={{
                            ...styleCentered,
                            justifyContent: 'flex-end',
                            textAlign: 'right'
                        }}
                    >
                        <span className={`Number ${AppProject}-${tokenName}`}> {/* style={{ color }}> */}
                        <LargeNumber amount={balance} currencyCode={currencyCode} />
                        </span>
                    </Col>
                </Row>
            </Col>
            <Col
                // span={14}
                style={{
                    ...styleCentered,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    textAlign: 'right'
                    ,'flexGrow':'1'
                }}
            >
                <div className="Numbers Left">
                    <Tooltip placement="top" title={getBalance(true)}>
                        <div className="Number Few">
                            {getBalance()}{' '}
                            {/*{labelCoin}*/}
                            {getCoinName('COINBASE')}
                        </div>
                    </Tooltip>
                    <Tooltip placement="top" title={getBalanceUSD(true)}>
                        <div className="Number Few">{getBalanceUSD()} USD</div>
                    </Tooltip>
                </div>
            </Col>
            <Col
                // span={3}
                style={{
                    ...styleCentered,
                    justifyContent: 'flex-end'
                }}
            >
                <Button
                    className="ArrowButton"
                    type="primary"
                    shape="circle"
                    onClick={() => navigate(page)}
                    icon={<ArrowRightOutlined
                    />}
                />
            </Col></>:
                <Skeleton active={true}  paragraph={{ rows: 2 }}></Skeleton>
            }
        </Row>
    );
}
