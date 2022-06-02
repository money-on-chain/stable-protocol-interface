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
    const [headerState, setHeaderState] = useState('Double check that you are entering the correct BTC destination address.');
    const [headerIcon, setHeaderIcon] = useState('icon-atention.svg');
    const [isVisible, setIsVisible] = useState(true)
    const [completed, setCompleted] = useState(false);
    const [buttonCompleted, setButtonCompleted] = useState('Confirm');
    const [labelTxid, setlabelTxid] = useState('');

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


    const sendTransaction= async () => {
        const fastBtcBridgeAddress = '0x10C848e9495a32acA95F6c23C92eCA2b2bE9903A';
        console.log('sendTransaction: Reading fastBtcBridge Contract... address: ', fastBtcBridgeAddress);
        if(web3!=null){
            setHeaderState('Pending')
            const fastBtcBridge = new web3.eth.Contract(FastBtcBridge, fastBtcBridgeAddress);

            const fastBtcTransferToBtc= () => {
                return new Promise((resolve, reject) => {
                    setHeaderIcon('icon-processing.svg')
                    setIsVisible(false)
                    setHeaderState('Pending')
                    fastBtcBridge.methods.transferToBtc(props.rbtcAddress).send(
                        [props.rbtcAddress],
                        {
                            from: accountData.Owner,
                            value: toContract(web3.utils.toWei(`${parseFloat(props.rbtcAmount)}`, 'ether')),
                            gas: 300000
                        }).then(response => {
                        web3.eth.getTransactionReceipt(response.transactionHash)
                            .then(responseBTC => {
                                setHeaderState('Mined')
                                setHeaderIcon('icon-confirmed.svg');
                                setCompleted(true);
                                setIsVisible(true)
                                setButtonCompleted('Close')
                                setlabelTxid(responseBTC['transactionHash']);
                            })
                            .catch(error => {
                                //setIsPending(false);
                                setHeaderState('Failed');
                                setCompleted(true);
                                setIsVisible(true)
                                setButtonCompleted('Close')
                                setlabelTxid(error['transactionHash']);
                                console.log("fail", error);
                            });
                        resolve(response);
                    })
                        .catch(error => {
                            setHeaderState('Failed');
                            setCompleted(true);
                            setIsVisible(true)
                            setButtonCompleted('Close')
                            setlabelTxid(error['transactionHash']);
                            reject(error);
                        });;
                });
            };

            fastBtcTransferToBtc().then(result => {});
        }
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
                    {(headerState=='Pending' || headerState=='Mined' || headerState=='Failed') && <Fragment><p style={{'display':'flex','width':'100%'}}><img style={{'flexGrow':'0'}} className={'rotate'} src={`${window.location.origin+'/'+headerIcon }`} alt="" /><span style={{'flexGrow':'1','textAlign':'center','marginTop':'5px','marginLeft':'-45px'}}><b>{headerState}</b></span></p></Fragment>}
                    {(headerState!='Pending' && headerState!='Mined' && headerState!='Failed') && <p style={{'display':'flex','width':'100%'}}><img style={{'flexGrow':'0'}} src={`${window.location.origin+'/'+headerIcon }`} alt="332" /><span style={{'flexGrow':'1','marginLeft':'10px'}}>{headerState}</span></p>}
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

