import { Modal, Button, Spin } from 'antd';
import { useEffect, useState, useContext } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { LargeNumber } from '../../LargeNumber';
import { AuthenticateContext } from '../../../Context/Auth';
import './style.scss';

export default function StakingOptionsModal(props) {
    const auth = useContext(AuthenticateContext);
    const { mode, onClose, visible, amount, onConfirm, withdrawalId, setBlockedWithdrawals } = props;
    const [step, setStep] = useState(0);

    useEffect(() => {
        if (auth.UserBalanceData?.mocAllowance > amount) setStep(2);
    }, []);

    if (!mode) return null;

    const setAllowance = () => {
        setStep(1);

        // ?? approveMocToken(true)
    };

    const renderStaking = () => {
        const steps = {
            '0': () => {
                return (
                    <>
                        <h1 className="StakingOptionsModal_Title">Set Allowance</h1>
                        <div className="StakingOptionsModal_Content">
                            <p>Before continuing with the staking you must set the allowance so that the staking system can access the tokens.
                                This has to be done only once and it doesn't lock any tokens from your wallet.
                            </p>
                            <Button
                                type="primary"
                                onClick={() => setAllowance()}
                            >Authorize
                            </Button>
                        </div>
                    </>
                )
            },
            '1': () => {
                return (
                    <>
                        <h1 className="StakingOptionsModal_Title">Set Allowance</h1>
                        <div className="StakingOptionsModal_Content AllowanceLoading">
                            <Spin indicator={<LoadingOutlined />} />
                            <p>Processing Allowance, please wait.</p>
                        </div>
                    </>
                )
            },
            '2': () => {
                return (
                    <>
                        <h1 className="StakingOptionsModal_Title">Stake</h1>
                        <div className="StakingOptionsModal_Content">
                            <div className="InfoContainer">
                                <span className="title">Amount to Stake</span>
                                <span className="value amount">
                                    <LargeNumber amount={amount} currencyCode="RESERVE" />{' '}
                                    <span>MOC</span>
                                </span>
                            </div>
                            <p>Staked MoCs will receive rewards from the MoC Staking Rewards Program.
                                You can unstake your MoC's whenever you want, the withdraw process will take 30 days
                            </p>
                            <div className="ActionButtonsRow">
                                <Button
                                    type="default"
                                    onClick={onClose}
                                >Cancel</Button>
                                <Button
                                    type="primary"
                                    // onClick={depositMoCs}
                                >Confirm</Button>
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
                <h1 className="StakingOptionsModal_Title">Unstake</h1>
                <div className="StakingOptionsModal_Content">
                    <div className="InfoContainer">
                        <span className="title">Amount to Unstake</span>
                        <span className="value amount">
                            <LargeNumber amount={amount} currencyCode="RESERVE" />{' '}
                            <span>MOC</span>
                        </span>
                    </div>
                    <p>You will be able to withdraw your MoC Tokens to your wallet in 30 days. You can restake them anytime in this period.</p>
                    <div className="ActionButtonsRow">
                        <Button
                            type="default"
                            onClick={onClose}
                        >Cancel</Button>
                        <Button
                            type="primary"
                            // onClick={unstakeMoCs}
                        >Confirm</Button>
                    </div>
                </div>
            </>
        );
    };

    const renderWithdraw = () => {
        return (
            <>
                <h1 className="StakingOptionsModal_Title">Withdraw</h1>
                <div className="StakingOptionsModal_Content">
                    <div className="InfoContainer">
                        <span className="title">Amount to Withdraw</span>
                        <span className="value amount">
                            <LargeNumber amount={amount} currencyCode="RESERVE" />{' '}
                            <span>MOC</span>
                        </span>
                    </div>
                    <p>After withdrawal your MoCs tokens will be available in your wallet</p>
                    <div className="ActionButtonsRow">
                        <Button
                            type="default"
                            onClick={onClose}
                        >Cancel</Button>
                        <Button
                            type="primary"
                            // onClick={withdrawMoCs}
                        >Confirm</Button>
                    </div>
                </div>
            </>
        );
    };

    const renderRestaking = () => {
        return (
            <>
                <h1 className="StakingOptionsModal_Title">Restake</h1>
                <div className="StakingOptionsModal_Content">
                    <div className="InfoContainer">
                        <span className="title">Amount to Restake</span>
                        <span className="value amount">
                            <LargeNumber amount={amount} currencyCode="RESERVE" />{' '}
                            <span>MOC</span>
                        </span>
                    </div>
                    <p>After confirming, this amount of MoC Tokens will be removed from the processing queue and staked again.
                        They will immediately start receiving MoC Staking Rewards.
                    </p>
                    <div className="ActionButtonsRow">
                        <Button
                            type="default"
                            onClick={onClose}
                        >Cancel</Button>
                        <Button
                            type="primary"
                            // onClick={restakeMoCs}
                        >Confirm</Button>
                    </div>
                </div>
            </>
        );
    };

    const render = () => {
        const modes = {
            staking: renderStaking,
            unstaking: renderUnstaking,
            withdrwa: renderWithdraw,
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
