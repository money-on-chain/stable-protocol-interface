import { Modal } from 'antd';
import React, {
    useContext,
    useEffect,
    useMemo,
    useState,
    Fragment
} from 'react';
import { Button } from 'antd';
import CopyOutlined from '@ant-design/icons/CopyOutlined';

import { AuthenticateContext } from '../../../context/Auth';
import FastBtcBridge from '../../../contracts/FastBtcBridge.json';
import {
    toNumberFormat,
    btcInSatoshis,
    DYNAMIC_FEE_DIVISOR
} from '../../../helpers/math-helpers';
import Step2 from './step2';
import { config } from '../../../projects/config';
import { useProjectTranslation } from '../../../helpers/translations';
import { ReactComponent as LogoIconFastBTC } from '../../../assets/icons/icon-sovryn_fastbtc.svg';
import './style.scss';

export default function RbtcToBtcGenerateModal(props) {
    // let checkLoginFirstTime = true;
    const [account, setAccount] = useState(null);
    const [limits, setLimits] = useState(null);
    const auth = useContext(AuthenticateContext);
    const { web3 } = auth;
    const [t, i18n, ns] = useProjectTranslation();
    const AppProject = config.environment.AppProject;

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
        const fastBtcBridgeAddress = config.environment.fastBtcBridgeAddress;
        console.log(
            'Reading fastBtcBridge Contract... address: ',
            fastBtcBridgeAddress
        );
        if (web3 != null) {
            const fastBtcBridge = new web3.eth.Contract(
                FastBtcBridge,
                fastBtcBridgeAddress
            );
            const fastBtcBridgeGetFees = () => {
                return new Promise((resolve, reject) => {
                    fastBtcBridge.methods
                        .currentFeeStructureIndex()
                        .call()
                        .then(async (feeIndex) => {
                            const minTransfer = await fastBtcBridge.methods
                                .minTransferSatoshi()
                                .call();
                            const maxTransfer = await fastBtcBridge.methods
                                .maxTransferSatoshi()
                                .call();
                            fastBtcBridge.methods
                                .feeStructures(feeIndex)
                                .call()
                                .then((result) =>
                                    resolve(
                                        setLimits({
                                            min: minTransfer,
                                            max: maxTransfer,
                                            baseFee: result.baseFeeSatoshi,
                                            dynamicFee: result.dynamicFee
                                        })
                                    )
                                )
                                .catch((error) => {
                                    console.log(error);
                                    reject(error);
                                });
                        })
                        .catch((error) => {
                            console.log(error);
                            reject(error);
                        });
                });
            };

            fastBtcBridgeGetFees().then((result) => {
                console.log('execute');
            });
        }
    };

    const renderFee = useMemo(() => {
        if (limits != null) {
            if (!limits.dynamicFee || !limits.baseFee) {
                if (!limits.baseFee) {
                    return `${toNumberFormat(
                        (limits.dynamicFee / DYNAMIC_FEE_DIVISOR) * 100,
                        2
                    )} %`;
                }
                if (!limits.dynamicFee) {
                    return (
                        <>
                            {toNumberFormat(limits.baseFee / btcInSatoshis, 8)}{' '}
                            BTC
                        </>
                    );
                }
            } else {
                return `${toNumberFormat(
                    limits.baseFee / btcInSatoshis,
                    8
                )} BTC 
                ${toNumberFormat(
                    (limits.dynamicFee / DYNAMIC_FEE_DIVISOR) * 100,
                    2
                )} %`;
            }
        }
    }, [limits]);

    const [currentStep, setCurrentStep] = useState(1);
    const handleSubmit = (step) => {
        setCurrentStep(2);
    };

    const resetFields = () => {
        setCurrentStep(1);
    };

    const {
        title = 'rBTC to BTC',
        alertText = 'Always generate the BTC deposit address, as the system might update it'
    } = props;
    const [hasTokenQr, setHasTokenQr] = useState(false);
    //const { accountData = {} } = auth;
    const { visible = false, handleClose = () => {} } = props;
    const titleModal = (
        <div className="title">
            <div className="CardLogo">
                <LogoIconFastBTC width="32" height="32" alt="" />
                <h1>
                    Sovryn <br />
                    FastBTC
                </h1>
                <div className="title-text">
                    <h1>{title}</h1>
                </div>
            </div>
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
                    <p className="main-p">
                        {t(
                            `${AppProject}.fastbtc.topUpWalletModal.subtitle_pegout`,
                            { ns: ns }
                        )}
                    </p>
                    <div className="conversion-limits">
                        <b>
                            {t(
                                `${AppProject}.fastbtc.topUpWalletModal.limits_pegout.header`,
                                { ns: ns }
                            )}
                        </b>
                        {limits != null && (
                            <p>
                                {' '}
                                Min:{' '}
                                {toNumberFormat(
                                    limits.min / btcInSatoshis,
                                    8
                                )}{' '}
                                BTC
                            </p>
                        )}
                        {limits != null && (
                            <p>
                                Max:{' '}
                                {toNumberFormat(limits.max / btcInSatoshis, 3)}{' '}
                                BTC
                            </p>
                        )}
                        {limits != null && <p>Fee: {renderFee}</p>}
                    </div>

                    <p className="instructions">
                        <strong>
                            {t(
                                `${AppProject}.fastbtc.topUpWalletModal.instructions_pegout.header`,
                                { ns: ns }
                            )}
                        </strong>
                    </p>
                    <ul className="instructions">
                        <li>
                            {t(
                                `${AppProject}.fastbtc.topUpWalletModal.instructions_pegout.items.0`,
                                { ns: ns }
                            )}
                        </li>
                        <li>
                            {t(
                                `${AppProject}.fastbtc.topUpWalletModal.instructions_pegout.items.1`,
                                { ns: ns }
                            )}
                        </li>
                        <li>
                            {t(
                                `${AppProject}.fastbtc.topUpWalletModal.instructions_pegout.items.2`,
                                { ns: ns }
                            )}
                        </li>
                        <li>
                            {t(
                                `${AppProject}.fastbtc.topUpWalletModal.instructions_pegout.items.3`,
                                { ns: ns }
                            )}
                        </li>
                        <li>
                            If BTC is not visible in your destination wallet
                            after 90 mins, open a
                            <a
                                href="https://wiki.sovryn.com/en/faqs/faq-index"
                                target="_blank"
                            >
                                <strong> support ticket</strong>
                            </a>
                            at Sovryn.
                        </li>
                    </ul>

                    {!hasTokenQr && (
                        <div className="GenerateBTC">
                            <Button
                                type="primary"
                                onClick={() => handleSubmit(2)}
                            >
                                <b>Continue </b>
                            </Button>
                        </div>
                    )}

                    {hasTokenQr && (
                        <div className="generated-qr">
                            <div className="token">
                                <h3>Send BTC to this address</h3>
                                <div className="CopyableText">
                                    <CopyOutlined />
                                    <p className="token">tb1qhv...qvj4</p>
                                </div>
                            </div>
                            <div className="qr"></div>
                        </div>
                    )}
                </Fragment>
            )}
            {currentStep == 2 && (
                <Step2
                    auth={auth}
                    handleClose={handleClose}
                    min={toNumberFormat(limits.min / btcInSatoshis, 8)}
                    max={toNumberFormat(limits.max / btcInSatoshis, 3)}
                    fee={renderFee}
                ></Step2>
            )}
        </Modal>
    );
}
