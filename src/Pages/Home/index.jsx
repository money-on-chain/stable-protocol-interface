import TokenSummaryCard from '../../Components/Cards/TokenSummaryCard';
import './style.scss';
import React, { Fragment } from 'react';
import { useContext } from 'react';
import { AuthenticateContext } from '../../Context/Auth';
import WalletBalance from '../../Components/Cards/WalletBalance';
import { Row, Col } from 'antd';

function Home(props) {

    const auth = useContext(AuthenticateContext);
    const { docBalance = '0', bproBalance = '0', bprox2Balance = '0' } = auth.userBalanceData ? auth.userBalanceData : {};

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
                </Col>
            </Row>
        </Fragment>
    );
}

export default Home;
