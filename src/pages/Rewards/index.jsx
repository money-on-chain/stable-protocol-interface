import React, { Fragment, useContext, useState, useEffect } from "react";
import {Row, Col, Alert, Skeleton} from 'antd';
import RewardsStakingOptions from "../../components/Cards/RewardsStakingOptionsCard";
import YourAddressCard from '../../components/Cards/YourAddressCard';
import MocLiquidity from "../../components/Cards/MocLiquidity";
import MocAmount from "../../components/Cards/MocAmount";
import { AuthenticateContext } from '../../context/Auth';
import { useTranslation } from "react-i18next";
import Claims from "../../components/Tables/Claims";
import { config } from './../../projects/config';

import './../../assets/css/pages.scss';

export default function Rewards(props) {

    const auth = useContext(AuthenticateContext);
    const [t, i18n] = useTranslation(["global", 'moc','rdoc']);
    const ns = config.environment.AppProject.toLowerCase();
    const AppProject = config.environment.AppProject;
    const [loading, setLoading] = useState(true);
    const timeSke= 1500

    useEffect(() => {
        setTimeout(() => setLoading(false), timeSke)
    },[auth]);

    return (
        <Fragment>
            {!auth.isLoggedIn && <Alert
                message={t('global.NoConnection_alertTitle')}
                description={t('global.NoConnection_alertPleaseConnect')}
                type="error"
                showIcon
                className="AlertNoConnection"
            />}
            <h1 className="PageTitle">{t(`${AppProject}.wallets.TG.title`, { ns: ns })}</h1>
            <h3 className="PageSubTitle">{t(`${AppProject}.wallets.TG.subtitle`, { ns: ns })}</h3>
            <Row gutter={15}>
                <Col xs={24} md={12} xl={5}>
                    <div className="ContainerMocAmountDatas">
                        <MocAmount />
                        <MocLiquidity rewards={true} />
                    </div>
                </Col>
                <Col xs={24} md={12} xl={4}>
                    <YourAddressCard
                        height="100%"
                        tokenToSend="TG"
                        view={'moc'}
                    // currencyOptions={['RESERVE', 'MOC']}
                    />
                </Col>
                <Col xs={24} md={24} xl={15}>
                    <RewardsStakingOptions
                        AccountData={auth.accountData}
                        UserBalanceData={auth.userBalanceData}
                    />
                </Col>
            </Row>
            <div className="Card WalletOperations">
                {
                    !loading
                        ? <Claims />
                        : <Skeleton active={true} />
                }
            </div>
        </Fragment>
    )
}