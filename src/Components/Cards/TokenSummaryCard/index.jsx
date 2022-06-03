import { ArrowRightOutlined } from '@ant-design/icons';
import { Row, Col, Tooltip, Modal } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { useContext } from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { AuthenticateContext } from '../../../Context/Auth';
import { currencies as currenciesDetail } from '../../../Config/currentcy';
import { LargeNumber } from "../../LargeNumber";
import { relativeTimeRounding } from 'moment';
import { useTranslation } from "react-i18next";
import './style.scss';

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
        currencyCode = ''
    } = props;

    const auth = useContext(AuthenticateContext);
    const [t, i18n] = useTranslation(["global", 'moc'])

    const getBalance = () => {
        if (auth.userBalanceData) {
            switch (tokenName) {
                case 'stable':
                    return (auth.userBalanceData['docBalance'] / auth.contractStatusData.bitcoinPrice).toFixed(6);
                case 'riskpro':
                    return ((auth.contractStatusData['bproPriceInUsd'] * auth.userBalanceData['bproBalance']) / auth.contractStatusData.bitcoinPrice).toFixed(6)
                // return auth.userBalanceData['bproBalance'];
                case 'riskprox':
                    return new BigNumber(auth.userBalanceData['bprox2Balance']).toFixed(6);
            }
        }else{
            return (0).toFixed(6)
        }
    };
    const getBalanceUSD = () => {
        if (auth.userBalanceData) {
            switch (tokenName) {
                case 'stable':
                    return new BigNumber(auth.userBalanceData['docBalance']).toFixed(2)
                case 'riskpro':
                    return new BigNumber(auth.contractStatusData['bproPriceInUsd'] * auth.userBalanceData['bproBalance']).toFixed(2);
                case 'riskprox':
                    return new BigNumber(auth.contractStatusData['bitcoinPrice'] * auth.userBalanceData['bprox2Balance']).toFixed(2);
            }
        }else{
            return (0).toFixed(2)
        }
    };

    /* Start Component ModalTookenInformation */

    const [isModalVisible, setIsModalVisible] = useState(false);

    const TokenInformationContent = ({ token }) => (
        <Row>
            <Col span={24}>
                <hr className='FactSheetLine' />
                <p className='FactSheet'>{`${t(`MoC.TokenInformationContent.${token}.factSheet`, { ns: 'moc' })}`}</p>
                <h4 className='FactSheetTitle' dangerouslySetInnerHTML={{ __html: t(`MoC.TokenInformationContent.${token}.title`, { ns: 'moc', returnObjectTrees: false }) }} />
            </Col>
            <Col xs={24} sm={24} md={12}>
                <ul>
                    {
                        /*console.log('**************', t(`MoC.TokenInformationContent.${token}.characteristics.left`, { ns: 'moc', returnObjects: true }))*/
                        t(`MoC.TokenInformationContent.${token}.characteristics.left`, { ns: 'moc', returnObjects: true }).map(eachcharacteristic => (
                            <li className='Characteristic'>{eachcharacteristic}</li>
                        ))
                    }
                </ul>
            </Col>
            <Col xs={24} sm={24} md={12}>
                <ul>
                    {
                        t(`MoC.TokenInformationContent.${token}.characteristics.right`, { ns: 'moc', returnObjects: true }).map(eachcharacteristic => (
                            <li className='Characteristic'>{eachcharacteristic}</li>
                        ))
                    }
                </ul>
            </Col>
        </Row>
    )

    const renderModalTooltip = () => {
        const showModal = () => {
            setIsModalVisible(true);
        };
        const handleCancel = () => {
            setIsModalVisible(false);
        };

        return (
            <div>
                <Tooltip placement="topRight" title={`${t('MoC.tokenInformationTooltip', { ns: 'moc' })} ${t(`MoC.Tokens_${currencyCode}_name`, { ns: 'moc' })}`} className='TokenSummaryTooltip'>
                    <InfoCircleOutlined className="Icon" onClick={showModal} />
                </Tooltip>
                <Modal
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    footer={null} width='70%'
                    bodyStyle={{ paddingTop: 35, paddingLeft: 50, paddingRight: 50 }}
                >
                    <TokenInformationContent token={currencyCode} />
                </Modal>
            </div >
        )
    }

    /*End Component ModalTookenInformation */

    return (
        <Row className="Card TokenSummaryCard">
            {renderModalTooltip()}
            <Col
                span={7}
                style={{
                    ...styleCentered,
                    textAlign: 'right'
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
                            <LargeNumber className="WithdrawalAmount__" amount={balance} currencyCode={currencyCode} />
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
                span={3}
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
            </Col>
        </Row>
    );
}
