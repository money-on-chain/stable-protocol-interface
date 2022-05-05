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

function Home(props) {

    const auth = useContext(AuthenticateContext);
    const { docBalance = '0', bproBalance = '0', bprox2Balance = '0' } = auth.userBalanceData ? auth.userBalanceData : {};


    const data_row_coins = [];

    data_row_coins.push({
        key: 0,
        info: '',
        event: 'DOC',
        asset: 'DOC',
        platform: '+ 0.00',
        wallet: '-0.000032',
        date: '2022-04-18 18:23',
        status: {txt:'Confirmed',percent:100},
    });
    data_row_coins.push({
        key: 1,
        info: '',
        event: 'MINT',
        asset: 'BTC',
        platform: '+ 0.00',
        wallet: '-0.000032',
        date: '2022-04-18 18:23',
        status: {txt:'Confirmed',percent:100},
    });

    return (
        <Fragment>
            <h1 className="PageTitle">Home</h1>
            <h3 className="PageSubTitle">Keep calm and Hodl on</h3>
            <Row>
                <Col xs={24} sm={24} md={9} xl={6}>
                    <WalletBalance/>
                </Col>
                <Col xs={24} sm={24} md={15} xl={18}>
                    <div className={'container-b'}>
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
                <div className={'ContainerMocAmount'}>
                    <div className="ContainerMocAmountDatas">
                        <MocAmount></MocAmount>
                        <MocLiquidity></MocLiquidity>
                    </div>
                </div>
                </Col>
              </Row>
            </div>
            <div className="Card WalletOperations">
                <div className="title"><h1>Last Operations</h1></div>
                <ListOperations datas={data_row_coins}></ListOperations>
        </Fragment>
    );
}

export default Home;
