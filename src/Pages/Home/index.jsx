import TokenSummaryCard from '../../Components/Cards/TokenSummaryCard';

import React, { Fragment } from 'react';
import { useContext } from 'react';
import { AuthenticateContext } from '../../Context/Auth';
import WalletBalance from '../../Components/Cards/WalletBalance';
import {Row, Alert } from 'antd';
import MocAmount from "../../Components/Cards/MocAmount";
import MocLiquidity from "../../Components/Cards/MocLiquidity";
import ListOperations from "../../Components/Tables/ListOperations";
import {useTranslation} from "react-i18next";
import { config } from './../../Config/config';

import './../../assets/css/pages.scss';

function Home(props) {

    const [t, i18n]= useTranslation(["global",'moc','rdoc']);
    const ns = config.environment.AppProject === 'MoC' ? 'moc' : 'rdoc';
    const AppProject = config.environment.AppProject;
    const auth = useContext(AuthenticateContext);
    const { docBalance = '0', bproBalance = '0', bprox2Balance = '0' } = auth.userBalanceData ? auth.userBalanceData : {};
    
    return (

        <Fragment>
            {!auth.isLoggedIn && <Alert

                message={t('global.NoConnection_alertTitle')}
                description={t('global.NoConnection_alertPleaseConnect')}
                type="error"
                showIcon
                className="AlertNoConnection"
            />}


            <h1 className="PageTitle">{t(`${AppProject}.home.title`, { ns: ns })}</h1>
            <h3 className="PageSubTitle">{t(`${AppProject}.home.subtitle`, { ns: ns })}</h3>
            <Row gutter={16}>
                {/*<Col flex="300px" className={'WalletBalance-mb'}>*/}
                <div  className={'sec-1'}>
                    <WalletBalance/>
                </div>
                {/*<Col flex="auto">*/}
                <div  className={'sec-2'}>
                    <div className={'container-b'} style={{height: '100%'}}>
                        <TokenSummaryCard
                            tokenName="tp"
                            // color="#00a651"
                            page="/wallet/stable"
                            balance={docBalance}
                            labelCoin={t(`${AppProject}.Tokens_RESERVE_code`, {ns: ns})}
                            currencyCode={'TP'}
                        />
                        <TokenSummaryCard
                            tokenName="tc"
                            // color="#ef8a13"
                            page="/wallet/pro"
                            balance={bproBalance}
                            labelCoin={t(`${AppProject}.Tokens_RESERVE_code`, {ns: ns})}
                            currencyCode={'TC'}
                            currencyCodeNumber={'TC'}
                        />
                        <TokenSummaryCard
                            tokenName="tx"
                            // color="#ed1c24"
                            page="/wallet/leveraged"
                            balance={bprox2Balance}
                            labelCoin={t(`${AppProject}.Tokens_RESERVE_code`, {ns: ns })}
                            currencyCode={'TX'}
                            currencyCodeNumber={'TX'}
                        />
                    </div>
                </div>
                <div className={'sec-3'}>
                {/*<Col flex="248px">*/}
                    <div className="ContainerMocAmountDatas">
                        <MocAmount />
                        <MocLiquidity />
                    </div>
                </div>
            </Row>
            <div className="Card WalletOperations">
                <ListOperations token={'all'}></ListOperations>
            </div>
        </Fragment>
    );
}

export default Home;