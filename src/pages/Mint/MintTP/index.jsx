import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Row, Col, Alert, Skeleton } from 'antd';

import AmountCard from '../../../components/Cards/AmountCard';
import YourAddressCard from '../../../components/Cards/YourAddressCard';
import ListOperations from '../../../components/Tables/ListOperations';
import { AuthenticateContext } from '../../../context/Auth';
import { config } from '../../../projects/config';
import MintOrRedeemToken from '../../../components/MintOrRedeemToken/MintOrRedeemToken';
import { useProjectTranslation } from '../../../helpers/translations';
import OnLoadingAuthBody from '../../../components/MintOrRedeemToken/onLoadingAuthBody';

import './../../../assets/css/pages.scss';

export default function Mint(props) {
    const auth = useContext(AuthenticateContext);
    const [t, i18n, ns] = useProjectTranslation();
    const [isLoaded, setIsLoaded] = useState(false);
    const AppProject = config.environment.AppProject;
    useEffect(() => {
        if (
            auth.contractStatusData &&
            auth.accountData &&
            auth.userBalanceData
        ) {
            setIsLoaded(true);
        }
    }, [auth]);

    return (
        <Fragment>
            {!auth.isLoggedIn && (
                <Alert
                    message={t('global.NoConnection_alertTitle')}
                    description={t('global.NoConnection_alertPleaseConnect')}
                    type="error"
                    showIcon
                    className="AlertNoConnection"
                />
            )}
            <div className="sect__exchange__container">
                <div className="sect__exchange__header">
                    <h1 className="PageTitle">
                        {t(`${AppProject}.wallets.TP.title`, { ns: ns })}
                    </h1>
                    <h3 className="PageSubTitle">
                        {t(`${AppProject}.wallets.TP.subtitle`, { ns: ns })}
                    </h3>
                </div>
                <div className="sect__exchange__cards__container">
                    <div className="sect__exchange__balance">
                        <AmountCard
                            tokenName="TP"
                            titleName="DoC"
                            StatusData={auth.contractStatusData}
                        />
                    </div>
                    <div className="sect__exchange__address">
                        <YourAddressCard
                            height="23.4em"
                            tokenToSend="TP"
                            currencyOptions={['RESERVE', 'TP']}
                        />
                    </div>
                    <div className="sect__exchange__card">
                        {isLoaded ? (
                            <MintOrRedeemToken
                                token={'TP'}
                                AccountData={auth.accountData}
                                userState={auth.userBalanceData}
                                mocState={auth.contractStatusData}
                                style={'height'}
                            />
                        ) : (
                            <OnLoadingAuthBody
                                title={t('global.MintOrRedeemToken_Mint')}
                            />
                        )}
                    </div>
                </div>
                <div className="Card WalletOperations">
                    <ListOperations token={'TP'}></ListOperations>
                </div>
            </div>
        </Fragment>
    );
}
