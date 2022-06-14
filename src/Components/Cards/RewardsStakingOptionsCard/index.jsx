import React, { useEffect, useState, useContext } from 'react';
import {Row, Col, Tabs, Button, Table, Alert} from 'antd';
import moment from "moment";
import PerformanceChart from '../../../Components/PerformanceChart';
import { LargeNumber } from '../../LargeNumber';
import CoinSelect from '../../Form/CoinSelect';
import StakingOptionsModal from '../../Modals/StakingOptionsModal';
import { AuthenticateContext } from '../../../Context/Auth';
import BigNumber from "bignumber.js";
import OperationStatusModal from '../../Modals/OperationStatusModal/OperationStatusModal';
import { useTranslation } from "react-i18next";
import './style.scss';
import InputWithCurrencySelector from '../../Form/InputWithCurrencySelector';

const { TabPane } = Tabs;
const token = "MOC";

const withdrawalStatus = {
    pending: "PENDING",
    available: "AVAILABLE"
};

const getColumns = (renderActionsFunction, t) => [
    {
        title: t('global.RewardsOptions_Withdraw_Amount', { ns: 'global' }),
        dataIndex: "amount",
        key: "amount",
        render: amount => (
            <><LargeNumber className="WithdrawalAmount" amount={amount} currencyCode="MOC" /> MOC</>
        )
    },
    {
        title: t('global.RewardsOptions_Withdraw_Expiration', { ns: 'global' }),
        dataIndex: "expiration",
        key: "expiration",
        render: expiration => moment(parseInt(expiration) * 1000).format("L LT")
    },
    {
        title: t('global.RewardsOptions_Withdraw_Status', { ns: 'global' }),
        dataIndex: "status",
        key: "status",
        render: status =>
            status === withdrawalStatus.available
                ? t('global.StakingOptions_AvailableToWithdraw', { ns: 'global' })
                : t('global.StakingOptions_PendingExpiration', { ns: 'global' })
    },
    {
        title: "OPERATIONS",
        key: "operations",
        render: renderActionsFunction
    }
]

export default function RewardsStakingOptions(props) {

    const auth = useContext(AuthenticateContext);
    // falta los SETS
    const [stakingAmountInputValue, setStakingAmountInputValue] = useState("0.00");
    const [unstakingAmountInputValue, setUnstakingAmountInputValue] = useState("0");
    const [modalMode, setModalMode] = useState(null);
    const [stackedBalance, setStakedBalance] = useState("0");
    const [mocBalance, setMocBalance] = useState("0");
    const [lockedBalance, setLockedBalance] = useState("0");
    const [modalAmount, setModalAmount] = useState("0");
    const [selectedTab, setSelectedTab] = useState("0");
    const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
    const [blockedWithdrawals, setBlockedWithdrawals] = useState([]);
    const [totalPendingExpiration, setTotalPendingExpiration] = useState("0");
    const [totalAvailableToWithdraw, setTotalAvailableToWithdraw] = useState("0");
    const [operationModalInfo, setOperationModalInfo] = useState({});
    const [isOperationModalVisible, setIsOperationModalVisible] = useState(false);
    const [cleanInputCount, setUntouchCount] = useState(0);

    const [withdrawalId, setWithdrawalId] = useState("0");
    const [t, i18n] = useTranslation(["global", 'moc'])

    useEffect(() => {
        setStakingBalances();
    }, []);

    const setStakingBalances = async () => {
        let [_stakedBalance, _lockedBalance, _pendingWithdrawals] = ["0", "0", []];
        if (props.UserBalanceData) {
            setMocBalance(props.UserBalanceData.mocBalance);
            [_stakedBalance, _lockedBalance, _pendingWithdrawals] = await Promise.all([
                auth.getStackedBalance(),
                auth.getLockedBalance(),
                auth.getPendingWithdrawals()
            ]);
        }
        const pendingWithdrawalsFormatted = _pendingWithdrawals
            .filter(withdrawal => withdrawal.expiration)
            .map(withdrawal => {
                const status = new Date(parseInt(withdrawal.expiration) * 1000) > new Date()
                    ? withdrawalStatus.pending
                    : withdrawalStatus.available;

                return {
                    ...withdrawal,
                    status
                };
            });
        let pendingExpirationAmount = "0";
        let readyToWithdrawAmount = "0";

        pendingWithdrawalsFormatted.forEach(({ status, amount }) => {
            if (status === withdrawalStatus.pending) {
                pendingExpirationAmount = BigNumber.sum(pendingExpirationAmount, amount).toFixed(0);
            } else {
                readyToWithdrawAmount = BigNumber.sum(readyToWithdrawAmount, amount).toFixed(0);
            }
        });
        setLockedBalance(_lockedBalance);
        setStakedBalance(_stakedBalance);
        setTotalPendingExpiration(pendingExpirationAmount);
        setTotalAvailableToWithdraw(readyToWithdrawAmount);
        setPendingWithdrawals(pendingWithdrawalsFormatted);
    };

    const onValueStakingChange = (newValueStakingChange) => {
        console.log('newValueStakingChange',newValueStakingChange);
        setStakingAmountInputValue(newValueStakingChange);
    };

    const onStakingInputValueChange = value => {
        console.log('newValueStakingChange',value);
        setStakingAmountInputValue(value);
      };

    const clickButtonStake = (amountInputValue) => {
        console.log(amountInputValue);
        if (amountInputValue > 0) {
          // setModalAmount(amountInputValue);
          setModalMode("staking");
        } else {
          alert("Please fill amount you want to stake");
        }
      };

    const renderStaking = () => {
        var btnDisable = false;
        if (!props.UserBalanceData) {
            btnDisable = true;
        }
        if(stakingAmountInputValue>0){
            btnDisable = false;
        }
        return (
            <div className="StakingTabContent">
                <Row>
                    <Col xs={4}>
                        {auth.isLoggedIn &&
                        <PerformanceChart />}
                    </Col>
                    <Col xs={20}>
                        <Row className="RewardsOptionsOverview">
                            <div>
                                {t("global.RewardsOptions_AvailableToStake", { ns: 'global' })}
                                <h3 className="amount">
                                    <LargeNumber amount={mocBalance} currencyCode="REWARD" /> {t("MoC.Tokens_MOC_code", { ns: 'moc' })}
                                </h3>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                {t("global.RewardsOptions_Staked", { ns: 'global' })}
                                <h3 className="amount">
                                    <LargeNumber amount={stackedBalance} currencyCode="REWARD" /> {t("MoC.Tokens_MOC_code", { ns: 'moc' })}
                                </h3>
                            </div>
                        </Row>
                        <Row style={{ marginTop: '1em' }}>
                            <Col xs={24}>
                                {/* <CoinSelect
                                    label={t('global.RewardsOptions_AmountToStakePlaceholder', { ns: 'global' })}
                                    value={'MOC'}
                                    AccountData={props.AccountData}
                                    UserBalanceData={props.UserBalanceData}
                                    token={token}
                                    onInputValueChange={onStakingInputValueChange}
                                    inputValueInWei={stakingAmountInputValue}
                                    currencyOptions={'MOC'}
                                /> */}
                                <InputWithCurrencySelector
                                    cleanInputCount={cleanInputCount}
                                    title={t("global.RewardsOptions_AmountToStakePlaceholder")}
                                    currencySelected={'MOC'}
                                    onCurrencySelect={() => {
                                    }}
                                    // onCurrencySelect={onChangeCurrencyYouExchange}
                                    inputValueInWei={stakingAmountInputValue}
                                    onInputValueChange={onStakingInputValueChange}
                                    currencyOptions={['MOC']}
                                    // onValidationStatusChange={onYouExchangeValidityChange}
                                    onValidationStatusChange={() => {
                                    }}
                                    maxValueAllowedInWei={mocBalance}
                                    showMaxValueAllowed
                                    validate={auth}
                                />
                            </Col>
                        </Row>
                        <Row style={{ marginTop: '1em' }}>
                            <Col xs={24}>
                                <span>
                                    {t('global.RewardsOptions_AmountToStakeNote', { ns: 'global' })}
                                </span>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: '2.1em' }}>
                            <Button
                                disabled={btnDisable}
                                type="primary"
                                className="StakingBtn"
                                style={{ fontWeight: 700 }}
                                onClick={() => {
                                    clickButtonStake(stakingAmountInputValue);
                                  }}
                            >Stake</Button>
                        </Row>
                    </Col>
                </Row>
            </div>)
    };

    const renderUnstaking = () => {
        var btnDisable = false;
        if (!props.UserBalanceData) {
            btnDisable = true;
        }
        return (
            <div className="StakingTabContent">
                <Row>
                    <Col xs={4}>
                        {auth.isLoggedIn &&
                        <PerformanceChart />}
                    </Col>
                    <Col xs={20}>
                        <Row className="RewardsOptionsOverview">
                            <div>
                                {t('global.RewardsOptions_AvailableToUnstake', { ns: 'global' })}
                                <h3 className="amount">
                                    <LargeNumber amount={stackedBalance} currencyCode="REWARD" /> {t('MoC.Tokens_MOC_code', { ns: 'moc' })}
                                </h3>
                            </div>
                            {parseFloat(lockedBalance) > 0 && (
                                <div>
                                    {t('global.RewardsOptions_Locked', { ns: 'global' })}
                                    <h3 className="amount">
                                        <LargeNumber amount={lockedBalance} currencyCode="REWARD" /> {t('MoC.Tokens_MOC_code', { ns: 'moc' })}
                                    </h3>
                                </div>
                            )}
                        </Row>
                        <Row style={{ marginTop: '1em' }}>
                            <Col xs={24}>
                                <InputWithCurrencySelector
                                    cleanInputCount={cleanInputCount}
                                    title={t("global.RewardsOptions_AmountToUnstakePlaceholder")}
                                    currencySelected={'MOC'}
                                    onCurrencySelect={() => {
                                    }}
                                    // onCurrencySelect={onChangeCurrencyYouExchange}
                                    inputValueInWei={unstakingAmountInputValue}
                                    onInputValueChange={() => setUnstakingAmountInputValue(stackedBalance)}
                                    currencyOptions={['MOC']}
                                    // onValidationStatusChange={onYouExchangeValidityChange}
                                    onValidationStatusChange={() => {
                                    }}
                                    maxValueAllowedInWei={stackedBalance}
                                    showMaxValueAllowed
                                    validate={auth}
                                />
                                {/* <CoinSelect
                                    label={t('global.RewardsOptions_AmountToUnstakePlaceholder', { ns: 'global' })}
                                    value={token}
                                    AccountData={props.AccountData}
                                    onInputValueChange={() => setUnstakingAmountInputValue(stackedBalance)}
                                    inputValueInWei={unstakingAmountInputValue}
                                />*/ }
                            </Col>
                        </Row>
                        <Row style={{ marginTop: '1em' }}>
                            <Col xs={24}>
                                <span>
                                    {t('global.RewardsOptions_UnstakingNote.first', { ns: 'global' })}
                                    <a onClick={() => setSelectedTab("2")}>{t('global.RewardsOptions_UnstakingNote.link', { ns: 'global' })}</a> {t('global.RewardsOptions_UnstakingNote.second', { ns: 'global' })}
                                </span>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: '3.7em' }}>
                            <Button
                                disabled={btnDisable}
                                type="primary"
                                className="StakingBtn"
                                style={{ fontWeight: 700 }}
                                onClick={() => {
                                    setModalAmount(unstakingAmountInputValue);
                                    setModalMode("unstaking");
                                }}
                            >Unstake</Button>
                        </Row>
                    </Col>
                </Row>
            </div>
        )
    };

    const renderWithdraw = () => {
        return (
            <>
                <Table
                    columns={getColumns(renderWithdrawTableActions, t)}
                    pagination={{ pageSize: 4 }}
                    dataSource={pendingWithdrawals}
                    rowKey="id"
                />
                <Row className="WithdrawTabFooter">
                    <Col xs={24} md={8}>
                        <div className="WithdrawCTALabel">
                            <span className="grey">{t('global.StakingOptions_PendingExpiration', { ns: 'global' })}</span>
                            <div className="bolder">
                                <LargeNumber
                                    className="amount"
                                    amount={totalPendingExpiration}
                                    currencyCode="REWARD"
                                />{" "}
                                MoCs
                            </div>
                        </div>
                    </Col>
                    <Col xs={24} md={16}>
                        <Row>
                            <Col xs={12} md={10}>
                                <span className="grey">{t('global.StakingOptions_AvailableToWithdraw', { ns: 'global' })}</span>
                                <div className="bolder">
                                    <LargeNumber
                                        className="amount"
                                        amount={totalAvailableToWithdraw}
                                        currencyCode="REWARD"
                                    />{" "}
                                    MoCs
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </>
        )
    };

    const renderWithdrawTableActions = (_text, record) => (
        <>
            <Row>
                <Col xs={11}>
                    <Button
                        type="primary"
                        disabled={blockedWithdrawals.includes(record.id)}
                        onClick={() => {
                            setWithdrawalId(record.id);
                            setModalAmount(record.amount);
                            setModalMode("restake");
                        }}
                    >{t("global.StakingOptions_Restake")}</Button>
                </Col>
                <Col xs={1} />
                <Col xs={11}>
                    <Button
                        type="primary"
                        disabled={
                            record.status === withdrawalStatus.pending || blockedWithdrawals.includes(record.id)
                        }
                        onClick={() => {
                            setWithdrawalId(record.id);
                            setModalAmount(record.amount);
                            setModalMode("withdraw");
                        }}
                    >{t("global.StakingOptions_Withdraw")}</Button>
                </Col>
            </Row>
        </>
    );
    const resetBalancesAndValues = () => {
        setStakingBalances();
        setUnstakingAmountInputValue("0");
        setStakingAmountInputValue("0");
        setUntouchCount(prev => prev + 1);
    };

    const onStakingModalConfirm = (operationStatus, txHash) => {
        const operationInfo = {
            operationStatus,
            txHash
        };

        setOperationModalInfo(operationInfo);
        setIsOperationModalVisible(true);
        resetBalancesAndValues();
    };

    return (
        <div className="Card RewardsStakingOptions">
            <h3 className="CardTitle">{t("global.RewardsOptions_Title")}</h3>
            <Tabs
                activeKey={selectedTab}
                onChange={n => setSelectedTab(n)}
            >
                <TabPane tab="Stake" key={0}>
                    {renderStaking()}
                </TabPane>
                <TabPane tab="Unstake" key={1}>
                    {renderUnstaking()}
                </TabPane>
                <TabPane tab="Withdraw" key={2}>
                    {renderWithdraw()}
                </TabPane>
            </Tabs>
            <StakingOptionsModal
                mode={modalMode}
                visible={modalMode !== null}
                onClose={() => setModalMode(null)}
                withdrawalId={withdrawalId}
                amount={modalAmount}
                onConfirm={onStakingModalConfirm}
                setBlockedWithdrawals={setBlockedWithdrawals}
            />
            <OperationStatusModal
                visible={isOperationModalVisible}
                onCancel={() => setIsOperationModalVisible(false)}
                operationStatus={operationModalInfo.operationStatus}
                txHash={operationModalInfo.txHash}
            />
        </div>
    );
}