import TokenSummaryCard from '../../Components/Cards/TokenSummaryCard';
import './style.scss';
import React, { Fragment } from 'react';
import { useContext } from 'react';
import { AuthenticateContext } from '../../Context/Auth';
import WalletBalance from '../../Components/Cards/WalletBalance';
import { Row, Col } from 'antd';
import MocAmount from "../../Components/Cards/MocAmount";
import MocLiquidity from "../../Components/Cards/MocLiquidity";
import ListOperations from "../../Components/Tables/ListOperations";
import data_json from "../../services/webapp_transactions_list.json";
import {useTranslation} from "react-i18next";

function Home(props) {

    const [t, i18n]= useTranslation(["global",'moc'])

    const auth = useContext(AuthenticateContext);
    const { docBalance = '0', bproBalance = '0', bprox2Balance = '0' } = auth.userBalanceData ? auth.userBalanceData : {};


    const data_row_coins2= [];


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

    // const data_row_coins= data_json.transactions.map((data_j)=>{
    //     console.log("jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj**********************");
    //     console.log(data_j.reservePrice);
    //     console.log("jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj**********************");
    //     var set_event= "";
    //     if(data_j.event.includes("Mint")){set_event='MINT'}
    //     if(data_j.event.includes("Settlement")){set_event='SETTLEMENT'}
    //     if(data_j.event.includes("Redeem")){set_event='REDEEM'}
    //
    //     var set_asset= data_j.tokenInvolved;
    //     var set_status_txt= data_j.status;
    //     var set_status_percent= data_j.confirmingPercent;
    //     if( set_event!='' ){
    //         data_row_coins2.push({
    //             key: 0,
    //             info: '',
    //             event: set_event,
    //             asset: set_asset,
    //             platform: '+ 0.00',
    //             wallet: '-0.000032',
    //             date: data_j.lastUpdatedAt,
    //             status: {txt:set_status_txt,percent:set_status_percent},
    //         });
    //     }
    // });
/*
    data_row_coins2.push({
        key: 0,
        info: '',
        event: 'DOC',
        asset: 'DOC',
        platform: '+ 0.00',
        wallet: '-0.000032',
        date: '2022-04-18 18:23',
        status: {txt:'Confirmed',percent:100},
    });
    data_row_coins2.push({
        key: 1,
        info: '',
        event: 'MINT',
        asset: 'BTC',
        platform: '+ 0.00',
        wallet: '-0.000032',
        date: '2022-04-18 18:23',
        status: {txt:'Confirmed',percent:100},
    });*/

    return (
        <Fragment>
            <h1 className="PageTitle">{t('MoC.home.title', { ns: 'moc' })}</h1>
            <h3 className="PageSubTitle">{t("MoC.home.subtitle", { ns: 'moc' })}</h3>
            <Row gutter={16}>
                <Col flex="400px" className={'WalletBalance-mb'}>
                    <WalletBalance/>
                </Col>
                <Col flex="auto">
                    <div className={'container-b'} style={{height: '100%'}}>
                        <TokenSummaryCard
                            tokenName="stable"
                            color="#00a651"
                            page="/wallet/stable"
                            balance={docBalance}
                            labelCoin={'RBTC'}
                        />
                        <TokenSummaryCard
                            tokenName="riskpro"
                            color="#ef8a13"
                            page="/wallet/pro"
                            balance={bproBalance}
                            labelCoin={'RBTC'}
                        />
                        <TokenSummaryCard
                            tokenName="riskprox"
                            color="#ed1c24"
                            page="/wallet/leveraged"
                            balance={bprox2Balance}
                            labelCoin={'RBTC'}
                        />
                    </div>
                </Col>
                <Col xs={24} sm={24} md={24} xl={4}>
                    <div className="ContainerMocAmountDatas">
                        <MocAmount />
                        <MocLiquidity />
                    </div>
                </Col>
            </Row>
            <div className="Card WalletOperations">
                <ListOperations token={'all'}></ListOperations>
            </div>
        </Fragment>
    );
}

export default Home;
