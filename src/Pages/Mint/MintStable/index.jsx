import MintCard from '../../../Components/Cards/MintCard';
import { Fragment } from 'react';
import TokenSummaryCard from '../../../Components/Cards/TokenSummaryCard';

export default function Mint() {
    return (
        <Fragment>
            <h1 className="PageTitle">DoC</h1>
            <h3 className="PageSubTitle">Manage your DoCs</h3>
            <div className="WalletCardsContainer">
                <MintCard token={'STABLE'} currencyOptions={['RESERVE', 'STABLE']} color="#00a651" />
            </div>
        </Fragment>
    );
}
