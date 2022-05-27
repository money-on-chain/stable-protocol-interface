import MintCard from '../../../Components/Cards/MintCard';
import AmountCard from '../../../Components/Cards/AmountCard';
import YourAddressCard from '../../../Components/Cards/YourAddressCard';
import { Row, Col, Switch } from 'antd';
import React, { Fragment, useContext } from 'react';
import ListOperations from "../../../Components/Tables/ListOperations";
import { useTranslation } from "react-i18next";
import { AuthenticateContext } from '../../../Context/Auth';
import './style.scss'

export default function Mint(props) {
    const data_row_coins = [];
    const [t, i18n] = useTranslation(["global", 'moc']);
    const auth = useContext(AuthenticateContext);

    data_row_coins.push({
        key: 0,
        info: '',
        event: 'DOC',
        asset: 'BPRP',
        platform: '+ 0.00',
        wallet: '-0.000032',
        date: '2022-04-18 18:23',
        status: { txt: 'Confirmed', percent: 100 },
    });
    data_row_coins.push({
        key: 1,
        info: '',
        event: 'DOC',
        asset: 'BPRP',
        platform: '+ 0.00',
        wallet: '-0.000032',
        date: '2022-04-18 18:23',
        status: { txt: 'Confirmed', percent: 100 },
    });

    return (
        <Fragment>
            <h1 className="PageTitle">{t('MoC.wallets.RISKPRO.title', { ns: 'moc' })}</h1>
            <h3 className="PageSubTitle">{t('MoC.wallets.RISKPRO.subtitle', { ns: 'moc' })}</h3>
            <Row gutter={15}>
                <Col xs={24} md={12} xl={5}>
                    <AmountCard tokenName="riskpro" titleName="BPro" />
                </Col>
                <Col xs={24} md={12} xl={4}>
                    <YourAddressCard height="23.4em" tokenToSend="RISKPRO" currencyOptions={['RESERVE', 'RISKPRO']} />
                </Col>
                <Col xs={24} xl={15}>
                    <MintCard
                        token={'RISKPRO'}
                        AccountData={auth.accountData}
                        UserBalanceData={auth.userBalanceData}
                        StatusData={auth.contractStatusData}
                        currencyOptions={['RESERVE', 'RISKPRO']}
                        color="#ef8a13"
                    />
                </Col>
            </Row>
            <div className="Card WalletOperations">
                <ListOperations token={'RISKPRO'}></ListOperations>
            </div>
        </Fragment>
    );
}
