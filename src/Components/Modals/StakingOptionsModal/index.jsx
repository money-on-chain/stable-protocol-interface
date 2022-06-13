import { Modal, Button, Spin, notification } from 'antd';
import { useEffect, useState, useContext } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { LargeNumber } from '../../LargeNumber';
import { AuthenticateContext } from '../../../Context/Auth';
import Web3 from 'web3';
import './style.scss';
import {useTranslation} from "react-i18next";

export default function StakingOptionsModal(props) {
    const auth = useContext(AuthenticateContext);
    const { accountData = {} } = auth;
    const { mode, onClose, visible, amount, onConfirm, withdrawalId, setBlockedWithdrawals } = props;
    const [step, setStep] = useState(0);

   const amountInEth = Web3.utils.fromWei(amount);
   const [t, i18n]= useTranslation(["global",'moc'])

    useEffect(() => {
        // if (auth.UserBalanceData?.mocAllowance > amount) setStep(2);
    }, []);
    console.log('mode', mode);
    if (!mode) return null;


    //methods
    const setAllowance = async () => {
        setStep(1);
        // setStep(2); // sacar
        await auth.approveMoCToken(true, (error) => {
        }).then(res => {
                setStep(2);
                return null;
            })
            .catch(e => {
                console.error(e);
                notification['error']({
                    message: "Operations",
                    description: "Something went wrong! Transaction rejected!",
                    duration: 10
                });
            });
    };

    const depositMoCs = async () => {
        onClose();
        await auth.stakingDeposit(amountInEth, accountData.Wallet, (error, txHash) => {
            if (error) {
                return error;
            }
            const status = 'pending';
            onConfirm(status, txHash);
        })
        .then(res => {
            const status = res.status ? 'success' : 'error';
            onConfirm(status, res.transactionHash);
            return null;
        })
        .catch(e => {
            notification['error']({
                message: t('global.RewardsError_Title'),
                description: t('global.RewardsError_Message'),
                duration: 10
            });
        })
    };

    const restakeMoCs = async () => {
        onClose();
        await auth.cancelWithdraw(withdrawalId, (error, txHash) => {
                if (error) return error;

                const status = 'pending';
                onConfirm(status, txHash);
                setBlockedWithdrawals(prev => [...prev, withdrawalId]);
            })
            .then(res => {
                const status = res.status ? 'success' : 'error';
                onConfirm(status, res.transactionHash);
                setBlockedWithdrawals(prev => prev.filter(val => val !== withdrawMoCs));
                return null;
            })
            .catch(e => {
                console.error(e);
                notification['error']({
                    message: t('global.RewardsError_Title'),
                    description: t('global.RewardsError_Message'),
                    duration: 10
                });
            });
    };

    const unstakeMoCs = async () => {
        onClose();
        await auth.unstake(amountInEth, (error, txHash) => {
                if (error) return error;

                const status = 'pending';
                onConfirm(status, txHash);
            })
            .then(res => {
                const status = res.status ? 'success' : 'error';
                onConfirm(status, res.transactionHash);
                return null;
            })
            .catch(e => {
                console.error(e);
                notification['error']({
                    message: t('global.RewardsError_Title'),
                    description: t('global.RewardsError_Message'),
                    duration: 10
                });
            });
    };
    const withdrawMoCs = () => {
        onClose();
        auth.withdraw(withdrawalId, (error, txHash) => {
                if (error) return error;

                const status = 'pending';
                onConfirm(status, txHash);
                setBlockedWithdrawals(prev => [...prev, withdrawalId]);
            })
            .then(res => {
                const status = res.status ? 'success' : 'error';
                onConfirm(status, res.transactionHash);
                setBlockedWithdrawals(prev => prev.filter(val => val !== withdrawMoCs));
                return null;
            })
            .catch(e => {
                console.error(e);
                notification['error']({
                    message: t('global.RewardsError_Title'),
                    description: t('global.RewardsError_Message'),
                    duration: 10
                });
            });
    };

    // renders
    const renderStaking = () => {
        const steps = {
            '0': () => {
                return (
                    <>
                        <h1 className="StakingOptionsModal_Title">{t('global.StakingOptionsModal_SetAllowance')}</h1>
                        <div className="StakingOptionsModal_Content">
                            <p>{t('global.StakingOptionsModal_AllowanceDescription')}
                            </p>
                            <Button
                                type="primary"
                                onClick={() => setAllowance()}
                            >{t('global.StakingOptionsModal_Authorize')}
                            </Button>
                        </div>
                    </>
                )
            },
            '1': () => {
                return (
                    <>
                        <h1 className="StakingOptionsModal_Title">{t('global.StakingOptionsModal_SetAllowance')}</h1>
                        <div className="StakingOptionsModal_Content AllowanceLoading">
                            <Spin indicator={<LoadingOutlined />} />
                            <p>{t('global.StakingOptionsModal_ProccessingAllowance')}</p>
                        </div>
                    </>
                )
            },
            '2': () => {
                return (
                    <>
                        <h1 className="StakingOptionsModal_Title">{t('global.StakingOptionsModal_Title')}</h1>
                        <div className="StakingOptionsModal_Content">
                            <div className="InfoContainer">
                                <span className="title">{t('global.StakingOptionsModal_AmountToStake')}</span>
                                <span className="value amount">
                                    <LargeNumber amount={amount} currencyCode="RESERVE" />{' '}
                                    <span>{t('MoC.Tokens_MOC_code', {ns: 'moc'})}</span>
                                </span>
                            </div>
                            <p>{t('global.StakingOptionsModal_StakingDescription')}</p>
                            <div className="ActionButtonsRow">
                                <Button
                                    type="default"
                                    onClick={onClose}
                                >{t('global.StakingOptionsModal_Cancel')}</Button>
                                <Button
                                    type="primary"
                                    onClick={depositMoCs}
                                >{t('global.StakingOptionsModal_Comfirm')}</Button>
                            </div>
                        </div>
                    </>
                );
            }
        }

        return steps[step] ? steps[step]() : null;
    };

    const renderUnstaking = () => {
        return (
            <>
                <h1 className="StakingOptionsModal_Title">{t('global.StakingOptionsModal_UnstakeTitle')}</h1>
                <div className="StakingOptionsModal_Content">
                    <div className="InfoContainer">
                        <span className="title">{t('global.StakingOptionsModal_AmountToUnstake')}</span>
                        <span className="value amount">
                            <LargeNumber amount={amount} currencyCode="RESERVE" />{' '}
                            <span>{t('MoC.Tokens_MOC_code', {ns: 'moc'})}</span>
                        </span>
                    </div>
                    <p>{t('global.StakingOptionsModal_UnstakingDescription')}</p>
                    <div className="ActionButtonsRow">
                        <Button
                            type="default"
                            onClick={onClose}
                        >{t('global.StakingOptionsModal_Cancel')}</Button>
                        <Button
                            type="primary"
                            onClick={unstakeMoCs}
                        >{t('global.StakingOptionsModal_Comfirm')}</Button>
                    </div>
                </div>
            </>
        );
    };

    const renderWithdraw = () => {
        return (
            <>
                <h1 className="StakingOptionsModal_Title">{t('global.StakingOptionsModal_WithdrawTitle')}</h1>
                <div className="StakingOptionsModal_Content">
                    <div className="InfoContainer">
                        <span className="title">{t('global.StakingOptionsModal_AmountToWithdraw')}</span>
                        <span className="value amount">
                            <LargeNumber amount={amount} currencyCode="RESERVE" />{' '}
                            <span>{t('MoC.Tokens_MOC_code', {ns: 'moc'})}</span>
                        </span>
                    </div>
                    <p>{t('global.StakingOptionsModal_WithdrawDescription')}</p>
                    <div className="ActionButtonsRow">
                        <Button
                            type="default"
                            onClick={onClose}
                        >{t('global.StakingOptionsModal_Cancel')}</Button>
                        <Button
                            type="primary"
                            onClick={withdrawMoCs}
                        >{t('global.StakingOptionsModal_Comfirm')}</Button>
                    </div>
                </div>
            </>
        );
    };

    const renderRestaking = () => {
        return (
            <>
                <h1 className="StakingOptionsModal_Title">{t('global.StakingOptionsModal_RestakeTitle')}</h1>
                <div className="StakingOptionsModal_Content">
                    <div className="InfoContainer">
                        <span className="title">{t('global.StakingOptionsModal_AmountToRestake')}</span>
                        <span className="value amount">
                            <LargeNumber amount={amount} currencyCode="RESERVE" />{' '}
                            <span>{t('MoC.Tokens_MOC_code', {ns: 'moc'})}</span>
                        </span>
                    </div>
                    <p>{t('global.StakingOptionsModal_RestakeDescription')}</p>
                    <div className="ActionButtonsRow">
                        <Button
                            type="default"
                            onClick={onClose}
                        >{t('global.StakingOptionsModal_Cancel')}</Button>
                        <Button
                            type="primary"
                            onClick={restakeMoCs}
                        >{t('global.StakingOptionsModal_Comfirm')}</Button>
                    </div>
                </div>
            </>
        );
    };

    const render = () => {
        const modes = {
            staking: renderStaking,
            unstaking: renderUnstaking,
            withdraw: renderWithdraw,
            restake: renderRestaking
        };

        return modes[mode]();
    };

    return (
        <Modal
            className="StakingOptionsModal"
            visible={visible}
            onCancel={onClose}
            footer={null}
        >
            {render()}
        </Modal>
    )
}
