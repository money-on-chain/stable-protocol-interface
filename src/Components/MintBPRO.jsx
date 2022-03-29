import React from 'react';
import './_style.scss';
const BigNumber = require('bignumber.js');

function MintBPRO(props) {
    const calculateMoC = () => {
        const rbtcValue =
            window.document.getElementById('inputMRbtcValue').value;

        window.document.getElementById('inputBPROValue').value = new BigNumber(
            (rbtcValue * props.Data.RBTCPrice) / props.Data.BPROPrice
        ).toFixed(6);
    };
    return (
        <div className="HeaderBottom">
            <div className="Card MoC MintOrRedeemToken withPadding hasTitle">
                <div className="title">
                    <h1>{props.IsRedeem ? 'Redeem' : 'Mint'}</h1>
                </div>
                <div className="ExchangeInputs AlignedAndCentered">
                    <div className="YouExchange">
                        <div className="InputWithCurrencySelector  MoC">
                            <h3>You exchange</h3>
                            <form className="ant-form ant-form-horizontal">
                                <div className="ant-row ant-form-item ant-form-item-has-success">
                                    <div className="ant-col ant-form-item-control">
                                        <div className="ant-form-item-control-input">
                                            <div className="ant-form-item-control-input-content">
                                                <div className="MainContainer">
                                                    <input
                                                        id="inputMRbtcValue"
                                                        type="number"
                                                        className="valueInput "
                                                        defaultValue={0.000001}
                                                        step="any"
                                                        max={props.Data.Balance}
                                                        onChange={calculateMoC}
                                                    />
                                                    <div className="SelectCurrency MoC ">
                                                        <div className="ant-select ant-select-lg ant-select-single ant-select-show-arrow">
                                                            <div className="ant-select-selector">
                                                                <span className="ant-select-selection-item">
                                                                    <div className="currencyOption">
                                                                        <img
                                                                            className="currencyImage"
                                                                            src={
                                                                                window
                                                                                    .location
                                                                                    .origin +
                                                                                '/icon-reserve.svg'
                                                                            }
                                                                            alt="RBTC"
                                                                        />
                                                                        RBTC
                                                                    </div>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <div className="AlignedAndCentered">
                                <span className="setValueToMaxLink MoC">
                                    total available
                                </span>
                                <div className="text-align-right">
                                    <div>
                                        <span
                                            className
                                            style={{
                                                '-webkit-text-align': 'left',
                                                'text-align': 'left'
                                            }}
                                        >
                                            {new BigNumber(
                                                props.Data.Balance
                                            ).toFixed(6)}
                                        </span>{' '}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <span
                        role="img"
                        aria-label="arrow-right"
                        className="anticon anticon-arrow-right"
                    >
                        <svg
                            viewBox="64 64 896 896"
                            focusable="false"
                            className
                            data-icon="arrow-right"
                            width="1em"
                            height="1em"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path d="M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-.7 5.2-2L869 536.2a32.07 32.07 0 000-48.4z" />
                        </svg>
                    </span>
                    <div className="YouReceive">
                        <div className="InputWithCurrencySelector  MoC">
                            <h3>You receive</h3>
                            <form className="ant-form ant-form-horizontal">
                                <div className="ant-row ant-form-item ant-form-item-has-success">
                                    <div className="ant-col ant-form-item-control">
                                        <div className="ant-form-item-control-input">
                                            <div className="ant-form-item-control-input-content">
                                                <div className="MainContainer">
                                                    <input
                                                        id="inputBPROValue"
                                                        type="number"
                                                        className="valueInput "
                                                        defaultValue={0.0}
                                                    />
                                                    <div className="SelectCurrency MoC disabled">
                                                        <div className="ant-select ant-select-lg ant-select-single ant-select-show-arrow ant-select-disabled">
                                                            <div className="ant-select-selector">
                                                                <span className="ant-select-selection-item">
                                                                    <div className="currencyOption">
                                                                        <img
                                                                            className="currencyImage"
                                                                            src={
                                                                                window
                                                                                    .location
                                                                                    .origin +
                                                                                '/BPROIcon.svg'
                                                                            }
                                                                            alt="BPRO"
                                                                        />
                                                                        BPRO
                                                                    </div>
                                                                </span>
                                                            </div>
                                                            <span
                                                                className="ant-select-arrow"
                                                                unselectable="on"
                                                                aria-hidden="true"
                                                                style={{
                                                                    '-webkit-user-select':
                                                                        'none',
                                                                    '-moz-user-select':
                                                                        'none',
                                                                    '-ms-user-select':
                                                                        'none',
                                                                    'user-select':
                                                                        'none'
                                                                }}
                                                            >
                                                                <span
                                                                    role="img"
                                                                    aria-label="down"
                                                                    className="anticon anticon-down ant-select-suffix"
                                                                >
                                                                    <svg
                                                                        viewBox="64 64 896 896"
                                                                        focusable="false"
                                                                        className
                                                                        data-icon="down"
                                                                        width="1em"
                                                                        height="1em"
                                                                        fill="currentColor"
                                                                        aria-hidden="true"
                                                                    >
                                                                        <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z" />
                                                                    </svg>
                                                                </span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <div className="AlignedAndCentered">
                                <span className="setValueToMaxLink MoC">
                                    total available
                                </span>
                                <div className="text-align-right">
                                    <div>
                                        <span
                                            className
                                            style={{
                                                '-webkit-text-align': 'left',
                                                'text-align': 'left'
                                            }}
                                        >
                                            {props.Data.DoCBalance}
                                        </span>{' '}
                                        BPRO
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="MintOrRedeemTokenFooter AlignedAndCentered">
                    <div className="ReserveInUSD">
                        <span className="Conversion MoC">
                            1 RBTC ={props.Data.RBTCPrice}
                            <div className="ReservePrice">
                                <span
                                    className
                                    style={{
                                        '-webkit-text-align': 'left',
                                        'text-align': 'left'
                                    }}
                                >
                                    {new BigNumber(
                                        props.Data.Balance *
                                            props.Data.RBTCPrice
                                    ).toFixed(2)}
                                </span>{' '}
                                USD
                            </div>
                        </span>
                        <span className="Disclaimer">
                            * Amounts may be different at transaction
                            confirmation
                        </span>
                    </div>
                    <div className="MainActions MoC AlignedAndCentered">
                        <button
                            type="button"
                            className=" ButtonSecondary ClearButton lowerCase  MoC"
                        >
                            Clear
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                if (!props.IsRedeem) {
                                    props.Mint(
                                        window.document.getElementById(
                                            'inputMRbtcValue'
                                        ).value
                                    );
                                } else {
                                    props.Redeem(
                                        window.document.getElementById(
                                            'inputBPROValue'
                                        ).value
                                    );
                                }
                            }}
                            type="button"
                            className="ButtonPrimary  lowerCase  MoC"
                        >
                            {props.IsRedeem ? 'Redeem' : 'Mint'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MintBPRO;
