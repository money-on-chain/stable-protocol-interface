//import MintCard from '../../../components/Cards/MintCard';
import AmountCard from '../../../components/Cards/AmountCard';
import YourAddressCard from '../../../components/Cards/YourAddressCard';
import {Row, Col, Alert} from 'antd';
import React, {Fragment, useContext} from 'react';
import ListOperations from "../../../components/Tables/ListOperations";
import { useTranslation } from "react-i18next";
import { AuthenticateContext } from '../../../context/Auth';
import MintOrRedeemToken from '../../../components/MintOrRedeemToken/MintOrRedeemToken';
import { config } from './../../../projects/config';

import './../../../assets/css/pages.scss';

export default function Mint(props) {

    const [t, i18n] = useTranslation(["global", 'moc','rdoc']);
    const ns = config.environment.AppProject.toLowerCase();
    const AppProject = config.environment.AppProject;

    const auth = useContext(AuthenticateContext);

    return (
        <Fragment>
            {!auth.isLoggedIn && <Alert
                message={t('global.NoConnection_alertTitle')}
                description={t('global.NoConnection_alertPleaseConnect')}
                type="error"
                showIcon
                className="AlertNoConnection"
            />}
            <h1 className="PageTitle">{t(`${AppProject}.wallets.TC.title`, { ns: ns })}</h1>
            <h3 className="PageSubTitle">{t(`${AppProject}.wallets.TC.subtitle`, { ns: ns })}</h3>
            <Row gutter={15}>
                <Col xs={24} md={12} xl={5}>
                    <AmountCard
                        tokenName="TC"
                        titleName="BPro"
                        StatusData={auth.contractStatusData}
                    />
                </Col>
                <Col xs={24} md={12} xl={5}>
                    <YourAddressCard height="23.4em" tokenToSend="TC" currencyOptions={['RESERVE', 'TC']} />
                </Col>
                <Col xs={24} xl={14}>                    
                    <MintOrRedeemToken
                        token={'TC'}
                        AccountData={auth.accountData}
                        userState={auth.userBalanceData}
                        mocState={auth.contractStatusData}
                        style={'height'}
                    />
                </Col>
            </Row>
            <div className="Card WalletOperations">
                <ListOperations token={'TC'}></ListOperations>
            </div>
        </Fragment>
    );
}
