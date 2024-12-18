import React, { useEffect, useState, useContext } from 'react';
import { Modal, Alert } from 'antd';
import QRCode from 'react-qr-code';

import { initialState, Step, TxId } from '../../../lib/fastBTC/constants';
import Copy from '../../Page/Copy';
import { BTCButton } from './components/BTCButton';
import { getBtcAddress } from '../../../lib/fastBTC/fastBTCMethods';
import { AuthenticateContext } from '../../../context/Auth';
import TransactionScreen from './TransactionScreen';
import { config } from '../../../projects/config';
import { useProjectTranslation } from '../../../helpers/translations';

import { ReactComponent as LogoIconFastBTC } from '../../../assets/icons/icon-sovryn_fastbtc.svg';
import { ReactComponent as LogoIconAttention } from '../../../assets/icons/icon-atention.svg';

import './style.scss';
import IconStatusPending from '../../../assets/icons/status-pending.png';

export default function BtcToRbtcGenerateModal(props) {
    const auth = useContext(AuthenticateContext);
    useEffect(() => {
        auth.socket.initialize();
    }, []);

    const { visible = false, handleClose = () => {}, accountData } = props;
    const [t, i18n, ns] = useProjectTranslation();

    const AppProject = config.environment.AppProject;
    const [stateFBtc, setStateFBtc] = useState(initialState);
    const [underMaintenance, setUnderMaintenance] = useState(false);

    const address = accountData?.Owner;
    const socket = auth.socket;

    const cleanupState = () => {
        setStateFBtc(initialState);
    };

    useEffect(() => {
        return cleanupState;
    }, []);

    useEffect(() => {
        if (socket) {
            //Get tx limits
            socket.emit('txAmount', (limits) => {
                setStateFBtc((prevState) => ({
                    ...prevState,
                    limits
                }));
            });
        }
    }, [socket, stateFBtc.step]);

    useEffect(() => {
        if (socket) {
            const updateStateBTCtx = (tx) => {
                console.log('-----DETECTED DEPOSIT TX from ModalTopUp ------');
                console.log(tx);
                setStateFBtc((prevState) => ({
                    ...prevState,
                    step: Step.TRANSACTION,
                    txId: TxId.DEPOSIT,
                    depositTx: tx
                }));
            };
            const updateStateRBTCtx = (tx) => {
                console.log('-----DETECTED TRANSFER TX from ModalTopUp ------');
                console.log(tx);
                setStateFBtc((prevState) => ({
                    ...prevState,
                    step: Step.TRANSACTION,
                    txId: TxId.TRANSFER,
                    transferTx: tx
                }));
            };
            socket.on('depositTx', updateStateBTCtx);
            socket.on('transferTx', updateStateRBTCtx);
            return function cleanup() {
                console.log(
                    'Cleaning up socket subscription from fastBTC modal'
                );
                if (socket === undefined) {
                    return;
                }
                socket.off('depositTx', updateStateBTCtx);
                socket.off('transferTx', updateStateRBTCtx);
            };
        }
    }, [socket]);

    const getModalTitle = () => (
        <div className="ModalHeaderTitle">
            <div className="CardLogo">
                <LogoIconFastBTC width="32" height="32" alt="" />
                <h1>
                    Sovryn
                    <br />
                    FastBTC
                </h1>
            </div>
            <div className="title">
                <h1>BTC to rBTC</h1>
            </div>
        </div>
    );

    const ModalFooter = () => {
        return (
            <div className="AlertWarning" type="warning" icon="">
                <LogoIconAttention width="27" height="23" alt="" />
                <div>
                    {t(`${AppProject}.fastbtc.topUpWalletModal.footer`, {
                        ns: ns
                    })}
                </div>
            </div>
        );
    };
    return (
        <div className="top-up-wallet-modal-container">
            <Modal
                visible={visible}
                onCancel={handleClose}
                width={550}
                footer={stateFBtc.step === Step.MAIN && <ModalFooter />}
                title={getModalTitle()}
                wrapClassName="ModalTopUpContainer"
            >
                <div className="ModalTopUpBody">
                    {stateFBtc.step === Step.MAIN ||
                    stateFBtc.step === Step.WALLET ? (
                        <div className="">
                            <div className="ModalTopUpTitle">
                                <p className="subtitle">
                                    {t(
                                        `${AppProject}.fastbtc.topUpWalletModal.subtitle`,
                                        { ns: ns }
                                    )}
                                </p>
                            </div>
                            <div className="ModalTopUpContent">
                                <div className="TxLimits">
                                    <div className="BlueSection">
                                        <b>
                                            {t(
                                                `${AppProject}.fastbtc.topUpWalletModal.limits.header`,
                                                { ns: ns }
                                            )}
                                        </b>
                                        <ul>
                                            <li>
                                                {t(
                                                    `${AppProject}.fastbtc.topUpWalletModal.limits.min`,
                                                    {
                                                        ns: ns,
                                                        minValue: parseFloat(
                                                            stateFBtc.limits
                                                                .min < 0.0005
                                                                ? 0.0005
                                                                : stateFBtc.limits.min.toFixed(
                                                                      8
                                                                  )
                                                        )
                                                    }
                                                )}
                                            </li>
                                            <li>
                                                {t(
                                                    `${AppProject}.fastbtc.topUpWalletModal.limits.max`,
                                                    {
                                                        ns: ns,
                                                        maxValue: parseFloat(
                                                            stateFBtc.limits.max.toFixed(
                                                                8
                                                            )
                                                        )
                                                    }
                                                )}
                                            </li>
                                            <li>
                                                <p>Fee: 0.00005 BTC + 0.75 %</p>
                                            </li>
                                        </ul>
                                    </div>
                                    <b className="section-title">
                                        {t(
                                            `${AppProject}.fastbtc.topUpWalletModal.instructions.header`,
                                            { ns: ns }
                                        )}
                                    </b>
                                    <div className="TopUpInstructions">
                                        <ul>
                                            <li>
                                                {t(
                                                    `${AppProject}.fastbtc.topUpWalletModal.instructions.items.0`,
                                                    { ns: ns }
                                                )}
                                            </li>
                                            <li>
                                                {t(
                                                    `${AppProject}.fastbtc.topUpWalletModal.instructions.items.1`,
                                                    { ns: ns }
                                                )}
                                            </li>
                                            <li>
                                                {t(
                                                    `${AppProject}.fastbtc.topUpWalletModal.instructions.items.2`,
                                                    { ns: ns }
                                                )}
                                            </li>
                                            <li>
                                                If rBTC is not visible in your
                                                destination wallet after 60
                                                mins, open a
                                                <a
                                                    href="https://wiki.sovryn.com/en/faqs/faq-index"
                                                    target="_blank"
                                                >
                                                    <strong>
                                                        support ticket
                                                    </strong>
                                                </a>
                                                at Sovryn.
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                {underMaintenance ? (
                                    <Alert
                                        description={t(
                                            'fastbtc.topUpWalletModal.underMaintenance.alertDescription'
                                        )}
                                        type="info"
                                        className="under-maintenance-alert"
                                    />
                                ) : (
                                    <>
                                        <MainScreen
                                            state={stateFBtc}
                                            setState={setStateFBtc}
                                            address={address}
                                            underMaintenance={underMaintenance}
                                            socket={socket}
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    ) : (
                        <TransactionScreen
                            state={stateFBtc}
                            setState={setStateFBtc}
                        />
                    )}
                </div>
            </Modal>
        </div>
    );
}

const MainScreen = ({ state, setState, socket, address, underMaintenance }) => {
    const [t, i18n, ns] = useProjectTranslation();
    const AppProject = config.environment.AppProject;
    useEffect(() => {
        socket.initialize();
    }, []);
    useEffect(() => {
        if (!address) console.log('--- USER IS NOT LOGGED IN ----');
        if (!socket) console.log('---- SOCKET IS NOT CONNECTED ---');
        getBtcAddress(socket, address)
            .then((res) => {
                if (res.error != null) {
                    console.log('----- ERROR ----');
                    console.log(res.error);
                }
                console.log('------ EVERYTHING OK -------');
                const result = res.res;
                setState((prevState) => ({
                    ...prevState,
                    deposit: {
                        ...prevState.deposit,
                        address: result.btcadr,
                        receiver: result.web3adr
                    }
                }));
                return res;
            })
            .catch((e) => {
                console.log('------ ERRROR ------');
                console.log(e);
            });
        console.log(state.step, '"""', state.deposit.address);
    }, [state.deposit.address]);

    return (
        <div className="TxActions">
            {state.step === Step.WALLET && state.deposit.address !== '' && (
                <div className="AddressQrCode">
                    <div className="tw-text-lg tw-ml-8 tw-mb-2.5">
                        <b className="AddressTitle">
                            {t(
                                `${AppProject}.fastbtc.topUpWalletModal.txactions.sendBTCTitle`,
                                { ns: ns }
                            )}
                        </b>
                        <Copy
                            textToShow={
                                state.deposit.address.substring(0, 6) +
                                '...' +
                                state.deposit.address.substring(
                                    state.deposit.address.length - 4,
                                    state.deposit.address.length
                                )
                            }
                            textToCopy={state.deposit.address}
                            fastBTC={true}
                        />
                    </div>
                    <div
                        style={{
                            border: '2px solid',
                            padding: '3px 3px 0px 3px',
                            borderRadius: 5
                        }}
                    >
                        <QRCode
                            value={state.deposit.address}
                            size={150}
                            alt="qrCode"
                        />
                    </div>
                </div>
            )}

            {state.step === Step.WALLET && state.deposit.address === '' && (
                <div>
                    <img
                        src={IconStatusPending}
                        width={50}
                        height={50}
                        alt="pending"
                        className="img-status rotate"
                    />
                    <div>
                        {' '}
                        Please wait ... getting btc address deposit from fastbtc
                        servers.{' '}
                    </div>
                </div>
            )}

            <div className="MainActions">
                {state.step === Step.MAIN && (
                    <BTCButton
                        underMaintenance={underMaintenance}
                        onClick={() => {
                            setState((prevState) => ({
                                ...prevState,
                                step: Step.WALLET
                            }));
                        }}
                    />
                )}
            </div>
        </div>
    );
};
