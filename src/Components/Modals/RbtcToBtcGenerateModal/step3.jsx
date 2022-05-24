import { Modal } from 'antd';
import { Button } from 'antd';
import WarningOutlined from '@ant-design/icons/WarningOutlined';
import CopyOutlined from '@ant-design/icons/CopyOutlined';
import { AuthenticateContext } from '../../../Context/Auth';
import React, {Fragment, useEffect, useState} from "react";
import {weiToNumberFormat} from '../../../Helpers/math-helpers'
import rLogin from "../../../Lib/rLogin";
import Web3 from "web3";
import FastBtcBridge from "../../../Contracts/MoC/abi/FastBtcBridge.json";
const BigNumber = require('bignumber.js');


export default function Step3(props) {

    // const {visible = false, handleClose = () => {}} = props;

    const [currentStep, setCurrentStep]= useState(1);
    const [amountReceiving, setAmountReceiving] = useState('0');
    const [amountToSendInWei, setAmountToSendInWei] = useState('0');
    const [feesPaid, setFeesPaid] = useState('0');
    const  handleSubmit=(step) => {
        setCurrentStep(step)
    }


    let checkLoginFirstTime = true;
    const [account, setAccount] = useState(null);
    const [web3, setweb3] = useState(null);
    const [provider, setProvider] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    console.log('account ini------------------------')
    console.log(account)
    console.log('account ini------------------------')
    useEffect(() => {
        if (checkLoginFirstTime) {
            if (rLogin.cachedProvider) {
                connect();
            }
        }
    },checkLoginFirstTime);

    useEffect(() => {
        currentFeeData();
    }, [web3]);

    const connect = () =>
        rLogin.connect().then((rLoginResponse) => {
            const { provider, disconnect } = rLoginResponse;
            setProvider(provider);

            //const web3 = new Web3(provider);
            setweb3(new Web3(provider));
            window.rLoginDisconnect = disconnect;
            checkLoginFirstTime = false;

            // request user's account
            provider.request({ method: 'eth_accounts' }).then(([account]) => {
                setAccount(account);
                setIsLoggedIn(true);
            });
    });

    const currentFeeData = async () => {
        const fastBtcBridgeAddress = '0x10C848e9495a32acA95F6c23C92eCA2b2bE9903A';
        console.log('Reading fastBtcBridge Contract... address: ', fastBtcBridgeAddress);
        if(web3!=null){
            const fastBtcBridge = new web3.eth.Contract(FastBtcBridge, fastBtcBridgeAddress);
            const calculateCurrentFee = () => {
                return new Promise((resolve, reject) => {
                    fastBtcBridge.methods.calculateCurrentFeeWei(props.rbtcAmount)
                        .call().then(async feesPaid => {
                        const receivedAmount = new BigNumber(amountToSendInWei)
                            .minus(feesPaid)
                            .toString();
                        setFeesPaid(weiToNumberFormat(feesPaid, 8));
                        setAmountReceiving(weiToNumberFormat(receivedAmount, 8));
                    }).catch(error => {
                        console.log(error);
                        reject(error);
                    });
                });
            };

            calculateCurrentFee().then(result => {});
        }
    };


    return (
        <Fragment>
            <div className="alert-message-modal">
                <div className="alert-message">
                    <WarningOutlined />
                    <p>Double check that you are entering the correct BTC destination address.</p>
                </div>
            </div>

            <div className={'ModalUpTopContainer'}>
                <div className="InputAddressContainer separation">
                    <p className="InputAddressLabel">
                        Destination Address on BTC Network
                        <br/>
                        <span className="rbtc_address">{props.rbtcAddress}</span>
                    </p>
                    <br/>
                </div>
            </div>


            <div className="AmountSummary">
                <div className="Detail">Exchanging</div>
                <div className="Amount strong">{props.rbtcAmount} rBTC</div>
            </div>

            <div className="AmountSummary">
                <div className="Detail">Receiving</div>
                <div className="Amount strong">{amountReceiving} BTC</div>
            </div>

            <div className="AmountSummary">
                <div className="Detail">Fee</div>
                <div className="Amount">{feesPaid} BTC</div>
            </div>

            <div className="GenerateBTC">
                <Button type="primary" onClick={()=>handleSubmit(2)}>
                    <b>Confirm</b>
                </Button>
            </div>



            {/*<input type="number" placeholder="Enter rBTC amount to send"/>*/}


            {/*<form className="ant-form ant-form-horizontal">*/}
            {/*    <div className="ant-row ant-form-item ant-form-item-has-success">*/}
            {/*        <div className="ant-col ant-form-item-control">*/}
            {/*            <div className="ant-form-item-control-input">*/}
            {/*                <div className="ant-form-item-control-input-content">*/}
            {/*                    <div className="MainContainer">*/}
            {/*                        <input type="number" placeholder="Enter rBTC amount to send" className="valueInput " value="0.000000"/>*/}
            {/*                        <div className="SelectCurrency disabled">*/}
            {/*                            <div className="ant-select ant-select-lg ant-select-single ant-select-show-arrow ant-select-disabled">*/}
            {/*                                <div className="ant-select-selector">*/}
            {/*                                    <span className="ant-select-selection-search">*/}
            {/*                                        <input disabled="" autoComplete="off" type="search" className="ant-select-selection-search-input"*/}
            {/*                                               role="combobox" aria-expanded="false" aria-haspopup="listbox" aria-owns="rc_select_5_list" aria-autocomplete="list"*/}
            {/*                                               aria-controls="rc_select_5_list" aria-activedescendant="rc_select_5_list_0" readOnly="" unselectable="on"*/}
            {/*                                               value="" id="rc_select_5"      />*/}
            {/*                                    </span>*/}
            {/*                                    <span className="ant-select-selection-item">*/}
            {/*                                        <div className="currencyOption"><img className="currencyImage" src="/moc/icon-reserve.svg" alt="RBTC"/>RBTC</div>*/}
            {/*                                    </span>*/}
            {/*                                </div>*/}
            {/*                                <span className="ant-select-arrow" unselectable="on" aria-hidden="true"    >*/}
            {/*                                    <span role="img" aria-label="down" className="anticon anticon-down ant-select-suffix">*/}
            {/*                                        <svg viewBox="64 64 896 896" focusable="false" className="" data-icon="down" width="1em" height="1em" fill="currentColor" aria-hidden="true">*/}
            {/*                                            <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z">*/}

            {/*                                            </path>*/}
            {/*                                        </svg>*/}
            {/*                                    </span>*/}
            {/*                                </span>*/}
            {/*                            </div>*/}
            {/*                        </div>*/}
            {/*                        </div>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</form>*/}




            {/*<div className="MainContainer">*/}
            {/*    <input type="number" placeholder="Enter rBTC amount to send" className="valueInput " value="0.000000"/>*/}
            {/*    <div className="SelectCurrency disabled">*/}
            {/*        <div className="ant-select ant-select-lg ant-select-single ant-select-show-arrow ant-select-disabled">*/}
            {/*            <div className="ant-select-selector">*/}
            {/*                <span className="ant-select-selection-search">*/}
            {/*                    <input disabled="" autoComplete="off" type="search" className="ant-select-selection-search-input"*/}
            {/*                           role="combobox" aria-expanded="false" aria-haspopup="listbox" aria-owns="rc_select_5_list"*/}
            {/*                           aria-autocomplete="list" aria-controls="rc_select_5_list" aria-activedescendant="rc_select_5_list_0" readOnly="" unselectable="on" value=""*/}
            {/*                           id="rc_select_5"/>*/}
            {/*                </span>*/}
            {/*                <span className="ant-select-selection-item">*/}
            {/*                    <div className="currencyOption">*/}
            {/*                        <img className="currencyImage" src="/moc/icon-reserve.svg" alt="RBTC"/>RBTC*/}
            {/*                    </div>*/}
            {/*                </span>*/}
            {/*            </div>*/}
            {/*            <span className="ant-select-arrow" unselectable="on" aria-hidden="true">*/}
            {/*                <span role="img" aria-label="down" className="anticon anticon-down ant-select-suffix">*/}
            {/*                    <svg viewBox="64 64 896 896" focusable="false" className="" data-icon="down" width="1em"*/}
            {/*                         height="1em" fill="currentColor" aria-hidden="true">*/}
            {/*                        <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z">*/}

            {/*                        </path>*/}
            {/*                    </svg>*/}
            {/*                </span>*/}
            {/*            </span>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}




        </Fragment>

    );
}

