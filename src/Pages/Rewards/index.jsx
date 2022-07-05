import React, { Fragment, useContext, useState, useEffect } from "react";
import {Row, Col, Alert, Skeleton} from 'antd';
import RewardsStakingOptions from "../../Components/Cards/RewardsStakingOptionsCard";
import YourAddressCard from '../../Components/Cards/YourAddressCard';
import MocLiquidity from "../../Components/Cards/MocLiquidity";
import MocAmount from "../../Components/Cards/MocAmount";
import ListOperations from "../../Components/Tables/ListOperations";
import { AuthenticateContext } from '../../Context/Auth';
import { useTranslation } from "react-i18next";
import './style.scss'
import '../Home/style.scss'
import Claims from "../../Components/Tables/Claims";

export default function Rewards(props) {
    const auth = useContext(AuthenticateContext);
    const [t, i18n] = useTranslation(["global", 'moc']);
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
            <h1 className="PageTitle">{t('MoC.wallets.MOC.title', { ns: 'moc' })}</h1>
            <h3 className="PageSubTitle">{t('MoC.wallets.MOC.subtitle', { ns: 'moc' })}</h3>
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
                        tokenToSend="MOC"
                        iconWallet={`${window.location.origin}/Moc/icon-moc.svg`}
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