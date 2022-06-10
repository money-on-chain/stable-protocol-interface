import { Button } from 'antd';
import React, {Fragment, useContext, useEffect, useState} from "react";
import {weiToNumberFormat} from '../../../Helpers/math-helpers'
import Web3 from "web3";
import FastBtcBridge from "../../../Contracts/MoC/abi/FastBtcBridge.json";
import { toContract } from '../../../Lib/numberHelper';
import Copy from "../../Page/Copy";
const BigNumber = require('bignumber.js');


export default function Step3(props) {

    const {visible = false, handleClose = () => {}} = props;
    const [amountReceiving, setAmountReceiving] = useState('0');
    const [feesPaid, setFeesPaid] = useState('0');
    // const [headerState, setHeaderState] = useState('Double check that you are entering the correct BTC destination address.');
    const [labelColor, setLabelColor] = useState('white');
    // const [headerIcon, setHeaderIcon] = useState('icon-atention.svg');
    const [imgTrx, setImgTrx] = useState('icon-atention.svg');
    const [isVisible, setIsVisible] = useState(true)
    const [completed, setCompleted] = useState(false);
    const [buttonCompleted, setButtonCompleted] = useState('Confirm');
    const [labelTxid, setlabelTxid] = useState('');
    const [intervalBTCCheck, setIntervalBTCCheck] = useState(0);
    // const [labelTrx, setlabelTrx] = useState(t("fastbtc.topUpWalletModal.header_complete"));
    const [labelTrx, setlabelTrx] = useState("Double check that you are entering the correct BTC destination address.");

    const {auth}= props;
    const {web3}= auth;
    const { accountData } = auth;
    console.log('accountData.Owner');
    console.log(accountData.Owner);
    console.log('accountData.Owner');
    const [account, setAccount] = useState(null);

    useEffect(() => {
        connect();
    },[auth]);

    useEffect(() => {
        currentFeeData();
    }, [web3]);

    useEffect(() => {
        if (completed === false && intervalBTCCheck !== 0) {
            console.log("clearInterval", intervalBTCCheck);
            clearInterval(intervalBTCCheck);
            setIntervalBTCCheck(0);
        }
    }, [completed]);

    const connect = () =>  {
        setAccount(auth.account);
    };

    const currentFeeData = async () => {
        const fastBtcBridgeAddress = '0x10C848e9495a32acA95F6c23C92eCA2b2bE9903A';
        console.log('Reading fastBtcBridge Contract... address: ', fastBtcBridgeAddress);
        console.log(Web3.utils.toWei(props.rbtcAmount, 'ether'))
        console.log('Reading fastBtcBridge Contract... address: ', fastBtcBridgeAddress);
        if(web3!=null){
            const fastBtcBridge = new web3.eth.Contract(FastBtcBridge, fastBtcBridgeAddress);
            const calculateCurrentFee = () => {
                return new Promise((resolve, reject) => {
                    fastBtcBridge.methods.calculateCurrentFeeWei(Web3.utils.toWei(props.rbtcAmount, 'ether'))
                        .call().then(async feesPaid => {
                        const receivedAmount = new BigNumber(Web3.utils.toWei(props.rbtcAmount, 'ether'))
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

    const fastBtcBridgeAddress = '0x10C848e9495a32acA95F6c23C92eCA2b2bE9903A';
    console.log('sendTransaction: Reading fastBtcBridge Contract... address: ', fastBtcBridgeAddress);
    const fastBtcBridge = new web3.eth.Contract(FastBtcBridge, fastBtcBridgeAddress);

    const sendTransaction= async () => {
        // const fastBtcBridgeAddress = '0x10C848e9495a32acA95F6c23C92eCA2b2bE9903A';
        // console.log('sendTransaction: Reading fastBtcBridge Contract... address: ', fastBtcBridgeAddress);
        if(web3!=null){
            setlabelTrx('Waiting')
            setLabelColor('yellow')
            // const fastBtcBridge = new web3.eth.Contract(FastBtcBridge, fastBtcBridgeAddress);

            const fastBtcTransferToBtc= () => {
                return new Promise((resolve, reject) => {
                    setImgTrx('icon-processing.svg')
                    setIsVisible(false)
                    setlabelTrx('Waiting')
                    fastBtcBridge.methods.transferToBtc(props.rbtcAddress).send(
                        [props.rbtcAddress],
                        {
                            from: accountData.Owner,
                            value: toContract(web3.utils.toWei(`${parseFloat(props.rbtcAmount)}`, 'ether')),
                            gas: 300000
                        }).then(response => {
                        web3.eth.getTransactionReceipt(response.transactionHash)
                            .then(responseRSKTopics => {
                                setlabelTrx('Waiting')
                                setCompleted(true);
                                setIsVisible(true)
                                setButtonCompleted('Close')
                                setlabelTxid(responseRSKTopics['transactionHash']);
                                setCompleted(true);
                                if (
                                    responseRSKTopics.logs &&
                                    responseRSKTopics.logs.length > 0 &&
                                    responseRSKTopics.logs[0].topics &&
                                    responseRSKTopics.logs[0].topics.length === 3
                                ) {
                                    setIntervalBTCCheck(setInterval(() => {
                                        checkTransferBTCProgress(responseRSKTopics.logs[0].topics[1]);
                                    }, 30000));
                                }
                            })
                            .catch(error => {
                                //setIsPending(false);
                                setLabelColor("red");
                                setlabelTrx('Failed');
                                setCompleted(true);
                                setIsVisible(true)
                                setButtonCompleted('Close')
                                setlabelTxid(error['transactionHash']);
                                console.log("fail", error);
                            });
                        resolve(response);
                    })
                        .catch(error => {
                            setLabelColor("red");
                            setlabelTrx('Failed');
                            setCompleted(true);
                            setIsVisible(true)
                            setButtonCompleted('Close')
                            setlabelTxid(error['transactionHash']);
                            reject(error);
                            setCompleted(true);
                        });
                });
            };

            fastBtcTransferToBtc().then(result => {});
        }
    };

    const checkTransferBTCProgress = (transferId) => {
        setLabelColor("white");
        setlabelTrx("Initializing");
        fastBtcBridge.methods.getTransferByTransferId(transferId)
            .call()
            .then(responseBTC => {
                switch (responseBTC.status) {
                    case "0": {
                        setLabelColor("white");
                        setlabelTrx("Initializing");
                        break;
                    }
                    case "1": {
                        setLabelColor("white");
                        setlabelTrx("Validating");
                        break;
                    }
                    case "2": {
                        setLabelColor("white");
                        setlabelTrx("Pending");
                        break;
                    }
                    case "3": {
                        setLabelColor("green");
                        setlabelTrx("Confirmed");
                        setImgTrx("icon-confirmed.svg");
                        clearInterval(intervalBTCCheck);
                        setIntervalBTCCheck(null);
                        break;
                    }
                    case "4": {
                        console.log("44444444444444")
                        console.log(responseBTC.status)
                        setLabelColor("red");
                        setlabelTrx("Refunded");
                        clearInterval(intervalBTCCheck);
                        setIntervalBTCCheck(null);
                        break;
                    }
                }
                console.log(responseBTC);
            })
            .catch(error => {
                console.log(error);
            });
    };

    const handleSubmit=() => {
        if( completed==false ){
            sendTransaction()
        }
        if( completed==true ){
            handleClose()
        }
    }

    return (
        <Fragment>
            <div className="alert-message-modal">
                <div className="alert-message">
                    { (labelTrx=='Pending' || labelTrx=='Mined' || labelTrx=='Failed' || labelTrx=='Waiting'
                        || labelTrx=='Initializing' || labelTrx=='Validating') &&
                        <Fragment>
                            <p style={{'display':'flex','width':'100%'}}>
                                <img style={{'flexGrow':'0'}} className={'rotate'} src={`${window.location.origin+'/'+imgTrx }`} alt="" />
                                <span style={{'flexGrow':'1','textAlign':'center','marginTop':'5px','marginLeft':'-45px','color':labelColor}}><b>{labelTrx}</b></span>
                            </p>
                        </Fragment>}
                    { ( (labelTrx!='Pending' && labelTrx!='Mined' && labelTrx!='Failed' && labelTrx!='Waiting'
                        && labelTrx!='Initializing' && labelTrx!='Validating') || (labelTrx=='Confirmed')) &&
                        <p style={{'display':'flex','width':'100%'}}><img style={{'flexGrow':'0'}} src={`${window.location.origin+'/'+imgTrx}`} alt="332" />
                            <span style={{'flexGrow':'1','marginLeft':'10px'}}>{labelTrx}</span>
                        </p>}
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
                <div className="Amount strong">{props.rbtcAmount*1} rBTC</div>
            </div>

            <div className="AmountSummary">
                <div className="Detail">Receiving</div>
                <div className="Amount strong">{amountReceiving} BTC</div>
            </div>

            <div className="AmountSummary">
                <div className="Detail">Fee</div>
                <div className="Amount">{feesPaid} BTC</div>
            </div>

            {labelTxid &&
            <div className="AmountSummary">
                <div className="Detail">Tx ID</div>
                <div className="Amount">
                    <Copy textToShow={labelTxid?.slice(0, 5)+'...'+ labelTxid?.slice(-4)} textToCopy={labelTxid} />
                </div>
            </div>
            }

            <div className="GenerateBTC"  style={{ display: isVisible ? "block" : "none" }}>
                <Button type="primary" onClick={()=>handleSubmit()}>
                    <b>{buttonCompleted}</b>
                </Button>
            </div>
        </Fragment>

    );
}

