import TokenSummaryCard from '../../Components/Cards/TokenSummaryCard'
import './style.scss'
import { Fragment } from 'react';
import { useContext } from 'react'
import { AuthenticateContext } from '../../Context/Auth'

function Home(props) {

    const auth = useContext(AuthenticateContext);

    return (
        <Fragment>
            <h1 className="PageTitle">Home</h1>
            <h3 className="PageSubTitle">Keep calm and Hodl on</h3>
            <div className="WalletCardsContainer">
                <TokenSummaryCard tokenName="stable" color="#00a651" page="/wallet/stable" colorAmount={""} />
                <TokenSummaryCard tokenName="riskpro" color="#ef8a13" page="/wallet/pro" colorAmount={""} />
                <TokenSummaryCard tokenName="riskprox" color="#ed1c24" page="/wallet/leveraged" colorAmount={""} />
            </div>
        </Fragment>
    )
}

export default Home