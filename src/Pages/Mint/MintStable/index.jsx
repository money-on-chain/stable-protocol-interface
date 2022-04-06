import MintCard from '../../../Components/Cards/MintCard';
import { Fragment } from 'react';

export default function Mint(props) {
    return (
        <Fragment>
            <h1 className="PageTitle">DoC</h1>
            <h3 className="PageSubTitle">Manage your DoCs</h3>
            <div className="WalletCardsContainer">
                <MintCard
                    token={'STABLE'}
                    currencyOptions={['RESERVE', 'STABLE']}
                    StatusData={props.Auth.contractStatusData}
                    UserBalanceData={props.Auth.userBalanceData}
                    color="#00a651"
                    AccountData={props.Auth.accountData}
                />
            </div>
        </Fragment>
    );
}
