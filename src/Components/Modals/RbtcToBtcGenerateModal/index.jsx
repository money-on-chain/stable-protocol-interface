import { Modal } from 'antd';
import React, { useContext, useEffect, useMemo, useState, Fragment } from 'react';
import { Button } from 'antd';
import WarningOutlined from '@ant-design/icons/WarningOutlined';
import CopyOutlined from '@ant-design/icons/CopyOutlined';
import { AuthenticateContext } from '../../../Context/Auth';
import Copy from '../../../Components/Page/Copy';
import './style.scss';
import rLogin from "../../../Lib/rLogin";
import Web3 from "web3";
import FastBtcBridge from "../../../Contracts/MoC/abi/FastBtcBridge.json";
import { toNumberFormat, btcInSatoshis, DYNAMIC_FEE_DIVISOR, toWei, weiToNumberFormat } from '../../../Helpers/math-helpers';
import { useTranslation } from "react-i18next";
import Step2 from "./step2";

export default function RbtcToBtcGenerateModal(props) {

    // let checkLoginFirstTime = true;
    const [account, setAccount] = useState(null);
    const [limits, setLimits] = useState(null);
    const auth = useContext(AuthenticateContext);
    const { web3 } = auth
    const [t, i18n] = useTranslation(["global", 'moc']);

    useEffect(() => {
        // if (checkLoginFirstTime) {
        connect();
        // }
    }, [auth]);

    useEffect(() => {
        if (account) {
            loadBalanceData();
        }
    }, [account]);

    const connect = () => {
        setAccount(auth.account);
    };

    const loadBalanceData = async () => {
        const fastBtcBridgeAddress = '0x10C848e9495a32acA95F6c23C92eCA2b2bE9903A';
        console.log('Reading fastBtcBridge Contract... address: ', fastBtcBridgeAddress);
        if (web3 != null) {
            const fastBtcBridge = new web3.eth.Contract(FastBtcBridge, fastBtcBridgeAddress);
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
        }
    };

    const renderFee = useMemo(() => {
        if (limits != null) {
            if (!limits.dynamicFee || !limits.baseFee) {
                if (!limits.baseFee) {
                    return (
                        `${toNumberFormat((limits.dynamicFee / DYNAMIC_FEE_DIVISOR) * 100, 2)} %`
                    );
                }
                if (!limits.dynamicFee) {
                    return <>{toNumberFormat(limits.baseFee / btcInSatoshis, 8)} BTC</>;
                }
            } else {
                return (
                    `${toNumberFormat(limits.baseFee / btcInSatoshis, 8)} BTC 
                ${toNumberFormat((limits.dynamicFee / DYNAMIC_FEE_DIVISOR) * 100, 2)} %`
                );
            }
        }

    }, [limits]);

    const [currentStep, setCurrentStep] = useState(1);
    const handleSubmit = (step) => {
        setCurrentStep(2)
    }

    const resetFields = () => {
        setCurrentStep(1)
    }


    const { title = 'rBTC to BTC', alertText = 'Always generate the BTC deposit address, as the system might update it' } = props
    const [hasTokenQr, setHasTokenQr] = useState(false);
    const { accountData = {} } = auth;
    const { visible = false, handleClose = () => { } } = props;
    const titleModal = (
        <div className='title'>
            <div className="CardLogo">
                <img width="32" src="https://static.moneyonchain.com/moc-alphatestnet/public/images/icon-sovryn_fastbtc.svg" alt="" />
                <h1>Sovryn <br />FastBTC</h1>
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
            footer={!hasTokenQr}
            width={550}
            onCancel={handleClose}
            className="RbtcToBtcModal"
            afterClose={() => resetFields()}
        >
            {currentStep == 1 && (
                <Fragment>
                    <p className="main-p">{t('MoC.fastbtc.topUpWalletModal.subtitle_pegout', { ns: 'moc' })}</p>
                    <div className='conversion-limits'>
                        <b>{t('MoC.fastbtc.topUpWalletModal.limits_pegout.header', { ns: 'moc' })}</b>
                        {limits != null &&
                            <p> Min: {toNumberFormat(limits.min / btcInSatoshis, 8)} BTC</p>
                        }
                        {limits != null &&
                            <p>Max: {toNumberFormat(limits.max / btcInSatoshis, 3)} BTC</p>
                        }
                        {limits != null &&
                            <p>Fee: {renderFee}</p>
                        }
                    </div>

                    <p className="instructions"><strong>{t('MoC.fastbtc.topUpWalletModal.instructions_pegout.header', { ns: 'moc' })}</strong></p>
                    <ul className="instructions">
                        <li>{t('MoC.fastbtc.topUpWalletModal.instructions_pegout.items.0', { ns: 'moc' })}</li>
                        <li>{t('MoC.fastbtc.topUpWalletModal.instructions_pegout.items.1', { ns: 'moc' })}</li>
                        <li>{t('MoC.fastbtc.topUpWalletModal.instructions_pegout.items.2', { ns: 'moc' })}</li>
                        <li>{t('MoC.fastbtc.topUpWalletModal.instructions_pegout.items.3', { ns: 'moc' })}</li>
                        <li>If BTC is not visible in your destination wallet after 90 mins, open a<a href='https://sovryn.freshdesk.com/support/tickets/new'><strong> support ticket</strong></a> at Sovryn.</li>
                    </ul>

                    {!hasTokenQr && (<div className="GenerateBTC">
                        <Button type="primary" onClick={() => handleSubmit(2)}>
                            <b>Continue </b>
                        </Button>
                    </div>)}

                    {hasTokenQr && (<div className='generated-qr'>
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
            {currentStep == 2 &&
                <Step2 auth={auth} handleClose={handleClose} min={toNumberFormat(limits.min / btcInSatoshis, 8)} max={toNumberFormat(limits.max / btcInSatoshis, 3)} fee={renderFee}></Step2>
            }
        </Modal>
    );
}
