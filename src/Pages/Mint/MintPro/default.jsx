//import MintCard from '../../../Components/Cards/MintCard';
import AmountCard from '../../../Components/Cards/AmountCard';
import YourAddressCard from '../../../Components/Cards/YourAddressCard';
import {Row, Col, Switch, Alert} from 'antd';
import React, {Fragment, useContext, useEffect} from 'react';
import ListOperations from "../../../Components/Tables/ListOperations";
import { useTranslation } from "react-i18next";
import { AuthenticateContext } from '../../../Context/Auth';
import MintOrRedeemToken from '../../../Components/MintOrRedeemToken/MintOrRedeemToken';
import { config } from './../../../Config/config';

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
                    {/* <MintCard
                        token={'RISKPRO'}
                        AccountData={auth.accountData}
                        UserBalanceData={auth.userBalanceData}
                        StatusData={auth.contractStatusData}
                        currencyOptions={['RESERVE', 'RISKPRO']}
                        color="#ef8a13"
                    /> */}
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
                <ListOperations token={'RISKPRO'}></ListOperations>
            </div>
        </Fragment>
    );
}
