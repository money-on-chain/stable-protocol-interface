import MintCard from '../../../Components/Cards/MintCard';
import AmountCard from '../../../Components/Cards/AmountCard';
import YourAddressCard from '../../../Components/Cards/YourAddressCard';
import {Row, Col, Switch, Alert} from 'antd';
import React, {Fragment, useContext, useEffect} from 'react';
import ListOperations from "../../../Components/Tables/ListOperations";
import { useTranslation } from "react-i18next";
import { AuthenticateContext } from '../../../Context/Auth';
import MintOrRedeemToken from '../../../Components/MintOrRedeemToken/MintOrRedeemToken';

export default function Mint(props) {

    async function loadAssets() {
        try {
            let css1= await import('./'+process.env.REACT_APP_ENVIRONMENT_APP_PROJECT+'/style.scss')

        } catch (error) {
            console.log(`Ocurrió un error al cargar imgs: ${error}`);
        }
    }
    loadAssets()

    const [t, i18n] = useTranslation(["global", 'moc']);
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
            <h1 className="PageTitle">{t('MoC.wallets.RISKPRO.title', { ns: 'moc' })}</h1>
            <h3 className="PageSubTitle">{t('MoC.wallets.RISKPRO.subtitle', { ns: 'moc' })}</h3>
            <Row gutter={15}>
                <Col xs={24} md={12} xl={5}>
                    <AmountCard
                        tokenName="RISKPRO"
                        titleName="BPro"
                        StatusData={auth.contractStatusData}
                    />
                </Col>
                <Col xs={24} md={12} xl={5}>
                    <YourAddressCard height="23.4em" tokenToSend="RISKPRO" currencyOptions={['RESERVE', 'RISKPRO']} />
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
                        token={'RISKPRO'}
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
