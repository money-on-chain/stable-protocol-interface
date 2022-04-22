import { ArrowRightOutlined } from '@ant-design/icons';
import { Row, Col } from 'antd';
import React from 'react';
import { useContext } from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { AuthenticateContext } from '../../../Context/Auth';
import { currencies as currenciesDetail } from '../../../Config/currentcy';
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
        color = '#000',
        page = '',
        balance = '0',
        labelCoin = '',
    } = props;

    const auth = useContext(AuthenticateContext);

    const getBalance = () => {
        if (auth.userBalanceData) {
            switch (tokenName) {
                case 'stable':
                    return (auth.userBalanceData['docBalance']/auth.contractStatusData.bitcoinPrice).toFixed(6);
                case 'riskpro':
                    return ((auth.contractStatusData['bproPriceInUsd']*auth.userBalanceData['bproBalance'])/auth.contractStatusData.bitcoinPrice).toFixed(6)
                    // return auth.userBalanceData['bproBalance'];
                case 'riskprox':
                    return auth.userBalanceData['bprox2Balance'];
            }
        }
    };
    const getBalanceUSD = () => {
        if (auth.userBalanceData) {
            switch (tokenName) {
                case 'stable':
                    return auth.userBalanceData['docBalance'];
                case 'riskpro':
                    return new BigNumber(auth.contractStatusData['bproPriceInUsd']*auth.userBalanceData['bproBalance']).toFixed(2);
                case 'riskprox':
                    return new BigNumber(auth.contractStatusData['bitcoinPrice'] * auth.userBalanceData['bprox2Balance']).toFixed(4);
            }
        }
    };
    return (
        <Row className="Card TokenSummaryCard">
            <Col
                span={8}
                style={{
                    ...styleCentered,
                    textAlign: 'right'
                }}
            >
                <Row className="ArrowHomeIndicators" style={{ width: '100%' }}>
                    <Col
                        span={8}
                        style={{
                            ...styleCentered,
                            justifyContent: 'flex-start'
                        }}
                    >
                        <img
                            width={45}
                            src={
                                window.location.origin +
                                `/Moc/icon-${tokenName}.svg`
                            }
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
                        <span className="Number" style={{ color }}>
                            {balance}
                        </span>
                    </Col>
                </Row>
            </Col>
            <Col
                span={14}
                style={{
                    ...styleCentered,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    textAlign: 'right'
                }}
            >
                <div className="Numbers Left">
                    <div className="Number Few">
                        {getBalance()}{' '}
                        {
                            currenciesDetail.find(
                                (x) => x.value === labelCoin.toUpperCase()
                            ).label
                        }
                    </div>
                    <div className="Number Few">{getBalanceUSD()} USD</div>
                </div>
            </Col>
            <Col
                span={2}
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
                    icon={<ArrowRightOutlined />}
                />
            </Col>
        </Row>
    );
}
