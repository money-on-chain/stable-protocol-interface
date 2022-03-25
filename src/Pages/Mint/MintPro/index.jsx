import MintCard from '../../../Components/Cards/MintCard';
import { Fragment } from 'react';

export default function Mint() {
    return (
        <Fragment>
            <h1 className="PageTitle">BPro</h1>
            <h3 className="PageSubTitle">Manage your BPros</h3>
            <div className="WalletCardsContainer">
                <MintCard token={'RISKPRO'} currencyOptions={['RESERVE', 'RISKPRO']} color="#ef8a13" />
            </div>
        </Fragment>
    );
}
