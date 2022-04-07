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

                    {/*<Col className="mrc-3" style={{  'flex-grow': 0 }}>*/}
                        <WalletBalance/>
                    {/*</Col>*/}
                    <div className="container-b">
                        <TokenSummaryCard tokenName="stable" color="#00a651" page="/wallet/stable" colorAmount={""} />
                        <TokenSummaryCard tokenName="riskpro" color="#ef8a13" page="/wallet/pro" colorAmount={""} />
                        <TokenSummaryCard tokenName="riskprox" color="#ed1c24" page="/wallet/leveraged" colorAmount={""} />
                    </div>

            </div>
        </Fragment>
    )
}

export default Home
