import React from 'react';
import './_style.scss';

function MintCard(props) {
    return (
        <div className="Card  TokenSummaryContainer  withPadding">
            <div className="TokenSummary MoC">
                <div className="WalletLeftSide">
                    <div className="IconWallet">
                        <img
                            src={window.location.origin + '/icon-stable.svg'}
                            alt="icon-wallet"
                        />
                    </div>
                    <div className="priceContainer">
                        <div className="balancecard  color-stable">
                            <h4 className="amount">
                                <div>
                                    <span style={{ textAlign: 'left' }}>
                                        {props.Data.DoCBalance}
                                    </span>
                                </div>
                            </h4>
                            <h4 className="abbr">
                                <span>DoC</span>
                            </h4>
                        </div>
                    </div>
                </div>
                <div className="WalletRightSide">
                    <div className="WalletCurrencyPrice">
                        <div className="BalanceItem MoC undefined">
                            <h1>
                                <div>
                                    <span style={{ textAlign: 'left' }}>
                                        {props.Data.DoCBalance /
                                            props.Data.RBTCPrice}
                                    </span>
                                </div>
                            </h1>
                            <h4> RBTC </h4>
                        </div>
                        <div className="BalanceItem MoC undefined">
                            <h1>
                                <div>
                                    <span style={{ textAlign: 'left' }}>
                                        {props.Data.DoCBalance}
                                    </span>
                                </div>
                            </h1>
                            <h4> USD </h4>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => {
                        props.handleClick();
                    }}
                    type="button"
                    className="ButtonPrimary    MoC"
                >
                    <img src="../moc/arrow.svg" alt="" />
                </button>
            </div>
        </div>
    );
}
export default MintCard;
