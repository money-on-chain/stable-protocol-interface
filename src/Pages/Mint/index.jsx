import MintCard from '../../Components/Cards/MintCard';
import { Fragment } from 'react';

import './style.scss'

export default function Mint() {
    return (
        <Fragment>
            <h1 className="PageTitle">DoC</h1>
            <h3 className="PageSubTitle">Manage your DoCs</h3>
            <div className="WalletCardsContainer">
                <MintCard />
            </div>
        </Fragment>
    );
}
