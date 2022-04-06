import MintCard from '../../../Components/Cards/MintCard';
import { Fragment } from 'react';
import TokenSummaryCard from '../../../Components/Cards/TokenSummaryCard';

export default function Mint(props) {
    return (
        <Fragment>
            <h1 className="PageTitle">BTCx</h1>
            <h3 className="PageSubTitle">Manage your BTCx Position</h3>
            <div className="WalletCardsContainer">
                <MintCard
                    token={'RISKPROX'}
                    AccountData={props.Auth.accountData}
                    UserBalanceData={props.Auth.userBalanceData}
                    StatusData={props.Auth.contractStatusData}
                    currencyOptions={['RESERVE', 'RISKPROX']}
                    color="#ed1c24"
                />
            </div>
        </Fragment>
    );
}
