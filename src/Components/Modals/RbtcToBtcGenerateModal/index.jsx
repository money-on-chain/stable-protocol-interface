import { Modal } from 'antd';
import React, {useContext, useEffect, useMemo, useState,Fragment} from 'react';
import { Button } from 'antd';
import WarningOutlined from '@ant-design/icons/WarningOutlined';
import CopyOutlined from '@ant-design/icons/CopyOutlined';
import { AuthenticateContext } from '../../../Context/Auth';
import Copy from '../../../Components/Page/Copy';
import './style.scss';
import rLogin from "../../../Lib/rLogin";
import Web3 from "web3";
import FastBtcBridge from "../../../Contracts/MoC/abi/FastBtcBridge.json";
import {toNumberFormat, btcInSatoshis, DYNAMIC_FEE_DIVISOR, toWei, weiToNumberFormat} from '../../../Helpers/math-helpers'
import Step2 from "./step2";

export default function RbtcToBtcGenerateModal(props) {

    let checkLoginFirstTime = true;
    const [provider, setProvider] = useState(null);
    const [account, setAccount] = useState(null);
    const [web3, setweb3] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [limits, setLimits] = useState(null);

    useEffect(() => {
        if (checkLoginFirstTime) {
            if (rLogin.cachedProvider) {
                connect();
            }
        }
    },checkLoginFirstTime);

    useEffect(() => {
        if (account) {
            loadBalanceData();
        }
    }, [account]);

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

    const loadBalanceData = async () => {
        const fastBtcBridgeAddress = '0x10C848e9495a32acA95F6c23C92eCA2b2bE9903A';
        console.log('Reading fastBtcBridge Contract... address: ', fastBtcBridgeAddress);
        const fastBtcBridge= new web3.eth.Contract(FastBtcBridge, fastBtcBridgeAddress);
        const fastBtcBridgeGetFees = () => {
            return new Promise((resolve, reject) => {
                fastBtcBridge.methods.currentFeeStructureIndex()
                    .call().then(async feeIndex => {
                    const minTransfer = await fastBtcBridge.methods.minTransferSatoshi().call();
                    const maxTransfer = await fastBtcBridge.methods.maxTransferSatoshi().call();
                    fastBtcBridge.methods.feeStructures(feeIndex)
                        .call().then(result => resolve(setLimits({
                        min: minTransfer, max: maxTransfer, baseFee: result.baseFeeSatoshi, dynamicFee: result.dynamicFee
                    })))
                        .catch(error => {
                            console.log(error);
                            reject(error);
                        });
                }).catch(error => {
                    console.log(error);
                    reject(error);
                });
            });
        };

        fastBtcBridgeGetFees().then(result => {
            console.log("execute");
        });
    };

    const renderFee = useMemo(() => {
        if (limits!=null) {
            if (!limits.dynamicFee || !limits.baseFee  ) {
                if (!limits.baseFee) {
                    return (
                        `${toNumberFormat((limits.dynamicFee / DYNAMIC_FEE_DIVISOR) * 100, 2)} %`
                    );
                }
                if (!limits.dynamicFee) {
                    return <>{toNumberFormat(limits.baseFee / btcInSatoshis, 8)} BTC</>;
                }
            }else{
                    return (
                        `${toNumberFormat(limits.baseFee / btcInSatoshis, 8)} BTC 
                ${toNumberFormat((limits.dynamicFee / DYNAMIC_FEE_DIVISOR) * 100, 2)} %`
                    );
            }
        }

    }, [limits]);

    const [currentStep, setCurrentStep]= useState(1);
    const  handleSubmit=(step) => {
        if( step==2 ){
            setCurrentStep(2)
        }
    }


    const {title='rBTC to BTC',alertText='Always generate the BTC deposit address, as the system might update it'} = props
    const [hasTokenQr, setHasTokenQr] = useState(false);
    const auth = useContext(AuthenticateContext);
    const { accountData = {} } = auth;
    const {visible = false, handleClose = () => {}} = props;
    const titleModal = (
        <div className='title'>
            <div className="CardLogo">
                <img width="32" src="https://static.moneyonchain.com/moc-alphatestnet/public/images/icon-sovryn_fastbtc.svg" alt=""/>
                <h1>Sovryn <br/>FastBTC</h1>
                <div className='title-text'>
                    <h1>{title}</h1>
                </div>
            </div>
        </div>
    );

    const footerModal = (
        <div className="alert-message">
            <WarningOutlined />
            <p>{alertText}</p>
        </div>
    );

    return (
        <Modal
            visible={visible}
            title={titleModal}
            footer={!hasTokenQr && footerModal}
            width={550}
            onCancel={handleClose}
            className="RbtcToBtcModal"
        >
            {currentStep==1 && (
                <Fragment>
            <p className="main-p">Please, review the conversion limits before proceeding with the rBTC to BTC conversion.</p>
            <div className='conversion-limits'>
                <b>Conversion limits</b>
                {limits!=null &&
                <p> Min: {toNumberFormat(limits.min / btcInSatoshis, 8)} BTC</p>
                }
                {limits!=null &&
                <p>Max: {toNumberFormat(limits.max / btcInSatoshis, 3)} BTC</p>
                }
                {limits!=null &&
                <p>Fee: {renderFee}</p>
                }
            </div>

            <p className="instructions"><strong>Instructions</strong></p>
            <ul className="instructions">
                <li>Please check and confirm the address you are sending to is a BTC address.</li>
                <li>Do not send anything other than rBTC.</li>
                <li>Do not send more rBTC than the MAX limit.</li>
                <li>Allow up to 90 mins for the transaction to precess.</li>
                <li>If BTC is not visible in your destination wallet after 90 mins, open a<a href='https://sovryn.freshdesk.com/support/tickets/new'><strong>support ticket</strong></a> at Sovryn.</li>
            </ul>

            {!hasTokenQr && (<div className="GenerateBTC">
                <Button type="primary" onClick={()=>handleSubmit(2)}>
                    <b>Continue </b>
                </Button>
            </div>)}

            { hasTokenQr && (<div className='generated-qr'>
                <div className="token">
                    <h3>Send BTC to this address</h3>
                    <div className='CopyableText'>
                        <CopyOutlined />
                        <p className='token'>tb1qhv...qvj4</p>
                    </div>
                </div>
                <div className="qr">

                </div>
            </div>)}
                </Fragment>)
            }
            {currentStep==2 &&
                <Step2></Step2>
            }
        </Modal>
    );
}
