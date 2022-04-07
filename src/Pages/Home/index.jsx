import TokenSummaryCard from '../../Components/Cards/TokenSummaryCard'
import './style.scss'
import React, { Fragment } from 'react';
import { useContext } from 'react'
import { AuthenticateContext } from '../../Context/Auth'
import WalletBalance from "../../Components/Cards/WalletBalance";
import { Row, Col } from 'antd';
import Copy from "../../Components/Page/Copy";

function Home(props) {

    const auth = useContext(AuthenticateContext);

    return (
        <Fragment>
            <h1 className="PageTitle">Home</h1>
            <h3 className="PageSubTitle">Keep calm and Hodl on</h3>
            <div className="WalletCardsContainer">
                <Row lg={12}>
                    <Col lg={4} className="mrc-3">
                        <WalletBalance/>
                    </Col>
                    <Col lg={18} style={{ width: '100%' }}>
                        <TokenSummaryCard tokenName="stable" color="#00a651" page="/wallet/stable" colorAmount={""} />
                        <TokenSummaryCard tokenName="riskpro" color="#ef8a13" page="/wallet/pro" colorAmount={""} />
                        <TokenSummaryCard tokenName="riskprox" color="#ed1c24" page="/wallet/leveraged" colorAmount={""} />
                    </Col>
                </Row>
            </div>
        </Fragment>
    )
}

export default Home