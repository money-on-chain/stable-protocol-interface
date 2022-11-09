//import MintCard from '../../../Components/Cards/MintCard';
import AmountCard from '../../../Components/Cards/AmountCard';
import YourAddressCard from '../../../Components/Cards/YourAddressCard';
import {Row, Col, Alert} from 'antd';
import React, {Fragment, useContext } from 'react';
import ListOperations from "../../../Components/Tables/ListOperations";
import { useTranslation } from "react-i18next";
import { AuthenticateContext } from '../../../Context/Auth';
import { config } from './../../../Config/config';
import MintOrRedeemToken from '../../../Components/MintOrRedeemToken/MintOrRedeemToken';

import './../../../assets/css/pages.scss';

export default function Mint(props) {

    const auth = useContext(AuthenticateContext);
    const [t, i18n] = useTranslation(["global", 'moc']);
    const ns = config.environment.AppProject.toLowerCase();
    const AppProject = config.environment.AppProject;

    return (
        <Fragment>
            {!auth.isLoggedIn && <Alert
                message={t('global.NoConnection_alertTitle')}
                description={t('global.NoConnection_alertPleaseConnect')}
                type="error"
                showIcon
                className="AlertNoConnection"
            />}
            <h1 className="PageTitle">{t(`${AppProject}.wallets.TP.title`, { ns: ns })}</h1>
            <h3 className="PageSubTitle">{t(`${AppProject}.wallets.TP.subtitle`, { ns: ns })}</h3>
            <Row gutter={15}>
                <Col xs={24} md={12} xl={5}>
                    <AmountCard tokenName="TP" titleName="DoC"
                        StatusData={auth.contractStatusData} />
                </Col>
                <Col xs={24} md={12} xl={5}>
                    <YourAddressCard height="23.4em" tokenToSend="TP" currencyOptions={['RESERVE', 'TP']} />
                </Col>
                <Col xs={24} xl={14}>                    
                    <MintOrRedeemToken
                        token={'TP'}
                        AccountData={auth.accountData}
                        userState={auth.userBalanceData}
                        mocState={auth.contractStatusData}
                        style={'height'}
                    />
                </Col>
            </Row>
            <div className="Card WalletOperations">
                <ListOperations token={'TP'}></ListOperations>
            </div>
        </Fragment>
    );
}
