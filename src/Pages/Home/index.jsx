import TokenSummaryCard from '../../Components/Cards/TokenSummaryCard';


import React, { Fragment, useEffect } from 'react';
import { useContext } from 'react';
import { AuthenticateContext } from '../../Context/Auth';
import WalletBalance from '../../Components/Cards/WalletBalance';
import {Row, Col, Alert, Tooltip} from 'antd';
import MocAmount from "../../Components/Cards/MocAmount";
import MocLiquidity from "../../Components/Cards/MocLiquidity";
import ListOperations from "../../Components/Tables/ListOperations";
import data_json from "../../services/webapp_transactions_list.json";
import {useTranslation} from "react-i18next";
import './style.scss';
import web3 from "web3";
import {InfoCircleOutlined} from "@ant-design/icons";
import {getDatasMetrics} from "../../Helpers/helper";

function Home(props) {

    const [t, i18n]= useTranslation(["global",'moc'])

    const auth = useContext(AuthenticateContext);
    const { docBalance = '0', bproBalance = '0', bprox2Balance = '0' } = auth.userBalanceData ? auth.userBalanceData : {};
    const data_row_coins2= [];

    const b=getDatasMetrics(auth)





    /*
    * del json:
    *
    * event        =======      event,                pero sacar ultimo substring ("event": "FreeStableTokenRedeem")
    * asset             ====    tokenInvolved
    * date           =====      lastUpdatedAt         transformar a date   ("lastUpdatedAt": "2021-12-03T20:36:22.232Z")
    * status        ======      confirmingPercent= numero     status= para texto
    *
    * */

    /*
    * para su detalle:
    *
    * event        =======      event,                pero sacar ultimo substring ("event": "FreeStableTokenRedeem")
    * tokenInvolved   ====    asset
    * platform fee      ==      gasFeeUSD               parece hay que tranformar
    * interests      ==      USDInterests
    *  gas fee      ======      gasFeeUSD               parece hay que tranformar
    * block N       ======      blockNumber
    * tx hash       =====       transactionHash         parece hay que tranformar
    * reserve Price  ======      reservePrice
    * */

    return (

        <Fragment>
            {!auth.isLoggedIn && <Alert

                message={t('global.NoConnection_alertTitle')}
                description={t('global.NoConnection_alertPleaseConnect')}
                type="error"
                showIcon
                className="AlertNoConnection"
            />}


            <h1 className="PageTitle">{t('MoC.home.title', { ns: 'moc' })}</h1>
            <h3 className="PageSubTitle">{t("MoC.home.subtitle", { ns: 'moc' })}</h3>
            <Row gutter={16}>
                {/*<Col flex="300px" className={'WalletBalance-mb'}>*/}
                <div  className={'sec-1'}>
                    <WalletBalance/>
                </div>
                {/*<Col flex="auto">*/}
                <div  className={'sec-2'}>
                    <div className={'container-b'} style={{height: '100%'}}>
                        <TokenSummaryCard
                            tokenName="stable"
                            color="#00a651"
                            page="/wallet/stable"
                            balance={web3.utils.toWei(docBalance, 'ether')}
                            labelCoin={'RBTC'}
                            currencyCode={'STABLE'}
                        />
                        <TokenSummaryCard
                            tokenName="riskpro"
                            color="#ef8a13"
                            page="/wallet/pro"
                            balance={web3.utils.toWei(bproBalance, 'ether')}
                            labelCoin={'RBTC'}
                            currencyCode={'RISKPRO'}
                        />
                        <TokenSummaryCard
                            tokenName="riskprox"
                            color="#ed1c24"
                            page="/wallet/leveraged"
                            balance={web3.utils.toWei(bprox2Balance, 'ether')}
                            labelCoin={'RBTC'}
                            currencyCode={'RISKPROX'}
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