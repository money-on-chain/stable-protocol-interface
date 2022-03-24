import DocCard from '../../Components/Cards/DocCard/index'
import './style.scss'
import { Fragment } from 'react';

function Home(props) {
    return (
        <Fragment>
            <h1 className="PageTitle">Home</h1>
            <h3 className="PageSubTitle">Keep calm and Hodl on</h3>
            <div className="WalletCardsContainer">
                <DocCard />
            </div>
        </Fragment>
    )
}

export default Home