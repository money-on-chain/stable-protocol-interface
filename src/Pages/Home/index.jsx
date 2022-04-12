import TokenSummaryCard from '../../Components/Cards/TokenSummaryCard';
import './style.scss';
import React, { Fragment } from 'react';
import { useContext } from 'react';
import { AuthenticateContext } from '../../Context/Auth';
import WalletBalance from '../../Components/Cards/WalletBalance';

function Home(props) {

    const auth = useContext(AuthenticateContext);
    const { docBalance = '0', bproBalance = '0', bprox2Balance = '0' } = auth.userBalanceData ? auth.userBalanceData : {};

    return (
        <Fragment>
            <h1 className="PageTitle">Home</h1>
            <h3 className="PageSubTitle">Keep calm and Hodl on</h3>
            <div className="WalletCardsContainerPie">
                <WalletBalance/>
                <div className={'container-b'}>
                    <TokenSummaryCard
                        tokenName="stable"
                        color="#00a651"
                        page="/wallet/stable"
                        balance={docBalance}
                    />
                    <TokenSummaryCard
                        tokenName="riskpro"
                        color="#ef8a13"
                        page="/wallet/pro"
                        balance={bproBalance}
                    />
                    <TokenSummaryCard
                        tokenName="riskprox"
                        color="#ed1c24"
                        page="/wallet/leveraged"
                        balance={bprox2Balance}
                    />
                </div>

            </div>
        </Fragment>
    );
}

export default Home;
