import React, { Fragment } from 'react';
import { useContext } from 'react';
import { Row, Alert } from 'antd';

import { AuthenticateContext } from '../../context/Auth';
import WalletBalance from '../../components/Cards/WalletBalance';
import TokenSummaryCard from '../../components/Cards/TokenSummaryCard';
import MocAmount from '../../components/Cards/MocAmount';
import MocLiquidity from '../../components/Cards/MocLiquidity';
import ListOperations from '../../components/Tables/ListOperations';
import { config } from '../../projects/config';
import { useProjectTranslation } from '../../helpers/translations';

import './../../assets/css/pages.scss';

function Home(props) {
    const [t, i18n, ns] = useProjectTranslation();
    const AppProject = config.environment.AppProject;
    const auth = useContext(AuthenticateContext);
    const {
        docBalance = '0',
        bproBalance = '0',
        bprox2Balance = '0',
        mocBalance = '0'
    } = auth.userBalanceData ? auth.userBalanceData : {};

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
            <h1 className="PageTitle">
                {t(`${AppProject}.home.title`, { ns: ns })}
            </h1>
            <h3 className="PageSubTitle">
                {t(`${AppProject}.home.subtitle`, { ns: ns })}
            </h3>
            <div className="sect__home">
                <div className={'sect__home__wallet'}>
                    <WalletBalance />
                </div>

                <div className={'sect__home__tokens'}>
                    <div className={'container-b sect__home__tokens__tp'}>
                        <TokenSummaryCard
                            tokenName="tp"
                            // color="#00a651"
                            page="/wallet/stable"
                            balance={docBalance}
                            labelCoin={t(`${AppProject}.Tokens_RESERVE_code`, {
                                ns: ns
                            })}
                            currencyCode={'TP'}
                        />
                        <TokenSummaryCard
                            tokenName="tc"
                            // color="#ef8a13"
                            page="/wallet/pro"
                            balance={bproBalance}
                            labelCoin={t(`${AppProject}.Tokens_RESERVE_code`, {
                                ns: ns
                            })}
                            currencyCode={'TC'}
                            currencyCodeNumber={'TC'}
                        />
                        <TokenSummaryCard
                            tokenName="tg"
                            // color="#ed1c24"
                            page="/rewards"
                            balance={mocBalance}
                            labelCoin={t(`${AppProject}.Tokens_RESERVE_code`, {
                                ns: ns
                            })}
                            currencyCode={'TG'}
                            currencyCodeNumber={'TG'}
                        />
                    </div>
                </div>
                <div className={'sect__home__liquidity'}>
                    <div className="ContainerMocAmountDatas">
                        <MocLiquidity />
                    </div>
                </div>
            </div>
            <div className="Card WalletOperations">
                <ListOperations token={'all'}></ListOperations>
            </div>
        </Fragment>
    );
}

export default Home;
