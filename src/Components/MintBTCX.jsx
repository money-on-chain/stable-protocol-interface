import React from 'react';
import { useState } from 'react';
import './_style.scss';
const BigNumber = require('bignumber.js');

function MintBTCX(props) {
    const [RBTCUSD, setRBTCUSD] = useState(0);

    const GetRBTCUSD = () => {
        const rbtcValue =
            window.document.getElementById('inputRbtcValue').value;
        if (rbtcValue) {
            setRBTCUSD(
                new BigNumber(
                    parseFloat(rbtcValue) * parseFloat(props.Data.RBTCPrice)
                ).toFixed(6)
            );
        }
    };

    return (
        <div className="Card  TokenSummaryContainer  withPadding">
            <div className="TokenSummary MoC">
                <div className="WalletLeftSide">
                    <div className="IconWallet">
                        <img
                            src={window.location.origin + '/BTXIcon.svg'}
                            alt="icon-wallet"
                        />
                    </div>
                    <div className="ant-form-item-control-input-content">
                        <div className="MainContainer">
                            <input
                                id="inputRbtcValue"
                                type="number"
                                className="valueInput "
                                defaultValue={0.000001}
                                step="any"
                                max={props.Data.Balance}
                                onChange={GetRBTCUSD}
                            />
                            <div className="SelectCurrency MoC ">
                                <div className="ant-select ant-select-lg ant-select-single ant-select-show-arrow">
                                    <div className="ant-select-selector">
                                        <span className="ant-select-selection-item">
                                            <div className="currencyOption">
                                                {`Total available ${new BigNumber(
                                                    props.Data.Balance
                                                ).toFixed(6)} RBTC`}
                                            </div>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="WalletRightSide">
                    <div className="WalletCurrencyPrice">
                        <div className="BalanceItem MoC undefined">
                            <h1>
                                <div>
                                    <span style={{ textAlign: 'left' }}>
                                        {RBTCUSD}
                                    </span>
                                </div>
                            </h1>
                            <h4> USD </h4>
                        </div>
                    </div>
                </div>
                <div className="BalanceItem MoC undefined">
                    <h1>
                        <div>
                            <span style={{ textAlign: 'left' }}>
                                <button
                                    onClick={() => {
                                        props.Mint(
                                            window.document.getElementById(
                                                'inputRbtcValue'
                                            ).value
                                        );
                                    }}
                                    type="button"
                                    className="ButtonPrimary MoC"
                                >
                                    <img
                                        src={
                                            window.location.origin +
                                            '/arrow.svg'
                                        }
                                        alt=""
                                    />
                                </button>
                            </span>
                        </div>
                    </h1>
                    <h4> Mint </h4>
                </div>
                <div className="BalanceItem MoC undefined">
                    <h1>
                        <div>
                            <span style={{ textAlign: 'left' }}>
                                <button
                                    onClick={() => {
                                        props.Redeem(
                                            window.document.getElementById(
                                                'inputRbtcValue'
                                            ).value
                                        );
                                    }}
                                    type="button"
                                    className="ButtonPrimary    MoC"
                                >
                                    <img
                                        src={
                                            window.location.origin +
                                            '/arrow.svg'
                                        }
                                        alt=""
                                    />
                                </button>
                            </span>
                        </div>
                    </h1>
                    <h4> Redeem </h4>
                </div>
            </div>
        </div>
    );
}

export default MintBTCX;
