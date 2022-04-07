import MintCard from '../../../Components/Cards/MintCard';
import { Fragment } from 'react';

export default function Mint(props) {
    return (
        <Fragment>
            <h1 className="PageTitle">BPro</h1>
            <h3 className="PageSubTitle">Manage your BPros</h3>
            <div className="WalletCardsContainer">
                <MintCard
                    token={'RISKPRO'}
                    AccountData={props.Auth.accountData}
                    UserBalanceData={props.Auth.userBalanceData}
                    StatusData={props.Auth.contractStatusData}
                    currencyOptions={['RESERVE', 'RISKPRO']}
                    color="#ef8a13"
                />
            </div>
        </Fragment>
    );
}
