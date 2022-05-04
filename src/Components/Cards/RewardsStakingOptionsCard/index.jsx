import React, { useEffect, useState } from 'react';
import { Row, Col, Tabs, Button, Table } from 'antd';
import moment from "moment";
import PerformanceChart from '../../../Components/PerformanceChart';
import { LargeNumber } from '../../LargeNumber';
import CoinSelect from '../../Form/CoinSelect';
import StakingOptionsModal from '../../Modals/StakingOptionsModal';
import './style.scss';

const { TabPane } = Tabs;
const token = "MOC";

const withdrawalStatus = {
    pending: "PENDING",
    available: "AVAILABLE"
  };

const getColumns = renderActionsFunction => [
    {
        title: "AMOUNT",
        dataIndex: "amount",
        key: "amount",
        render: amount => (
            <><LargeNumber className="" amount={amount} currencyCode="MOC" /> MOC</>
        )
    },
    {
        title: "EXPIRATION",
        dataIndex: "expiration",
        key: "expiration",
        render: expiration => moment(parseInt(expiration) * 1000).format("L LT")
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      render: status =>
        status === withdrawalStatus.available
          ? "Ready to Withdraw"
          : "Processing unstake"
    },
    {
      title: "OPERATIONS",
      key: "operations",
      render: renderActionsFunction
    }
]

export default function RewardsStakingOptions(props) {

    // falta los SETS
  const [stakingAmountInputValue, setStakingAmountInputValue] = useState("0");
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

    const [withdrawalId, setWithdrawalId] = useState("0");

    useEffect(() => {
        setStakingBalances();
    }, []);

    const setStakingBalances = () => {
        setMocBalance(props.UserBalanceData?.mocBalance);
    };

    const renderStaking = () => {
        return (
            <div className="StakingTabContent">
                <Row>
                    <Col xs={4}>
                        <PerformanceChart />
                    </Col>
                    <Col xs={20}>
                        <Row className="RewardsOptionsOverview">
                            <div>
                                Available to Stake
                                <h3 className="amount">
                                    <LargeNumber amount={mocBalance} currencyCode="REWARD"/> MOC
                                </h3>
                            </div>
                            <div style={{textAlign: 'right' }}>
                                Staked
                                <h3 className="amount">
                                    <LargeNumber amount={stackedBalance} currencyCode="REWARD" /> MOC
                                </h3>
                            </div>
                        </Row>
                        <Row style={{ marginTop: '1em' }}>
                            <Col xs={24}>
                                <CoinSelect
                                    label="MoC Tokens I want to stake"
                                    value={'MOC'}
                                    AccountData={props.AccountData}
                                    UserBalanceData={props.UserBalanceData}
                                    token={token}
                                    onInputValueChange={() => setStakingAmountInputValue(mocBalance)}
                                    inputValueInWei={stakingAmountInputValue}
                                />
                            </Col>
                        </Row>
                        <Row style={{ marginTop: '1em' }}>
                            <Col xs={24}>
                                <span>Staking MoC Tokens receive rewards from the MoC Staking Rewards Program.
                                    You will be able to unstake at any time with a release delay of 30 days (no rewards received during this period).
                                    After this period you will be able to "Withdraw".
                                </span>
                            </Col>
                        </Row>
                        <Row>
                            <Button
                                type="primary"
                                className="StakingBtn"
                                onClick={() => {
                                    setModalAmount(stakingAmountInputValue);
                                    setModalMode("staking");}}
                            >Stake</Button>
                        </Row>
                    </Col>
                </Row>
            </div>)
    };

    const renderUnstaking = () => {
        return (
            <div className="StakingTabContent">
                <Row>
                    <Col xs={4}>
                        <PerformanceChart />
                    </Col>
                    <Col xs={20}>
                        <Row className="RewardsOptionsOverview">
                            <div>
                                Available to Unstake
                                <h3 className="amount">
                                    <LargeNumber amount={stackedBalance} currencyCode="REWARD"/> MOC
                                </h3>
                            </div>
                            {parseFloat(lockedBalance) > 0 && (
                                <div>
                                    Locked by voting
                                    <h3 className="amount">
                                        <LargeNumber amount={lockedBalance} currencyCode="REWARD" /> MOC
                                    </h3>
                                </div>
                            )}
                        </Row>
                        <Row style={{ marginTop: '1em' }}>
                            <Col xs={24}>
                                <CoinSelect
                                    label="MoC Tokens I want to unstake"
                                    value={token}
                                    AccountData={props.AccountData}
                                    onInputValueChange={() => setUnstakingAmountInputValue(stackedBalance)}
                                    inputValueInWei={unstakingAmountInputValue}
                                />
                            </Col>
                        </Row>
                        <Row style={{ marginTop: '1em' }}>
                            <Col xs={24}>
                                <span>
                                Unstaking will take 30 days. During this period no MoC Rewards will be received.
                                <a onClick={() => setSelectedTab("2")}>Go to Withdraw</a> either to restake your MoC tokens anytime or to withdraw after 30 days period.
                                </span>
                            </Col>
                        </Row>
                        <Row>
                            <Button
                                type="primary"
                                className="StakingBtn"
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
                    columns={getColumns(renderWithdrawTableActions)}
                    pagination={{ pageSize: 4 }}
                    dataSource={pendingWithdrawals}
                    rowKey="id"
                />
                <Row className="WithdrawTabFooter">
                  <Col xs={24} md={8}>
                    <div className="WithdrawCTALabel">
                      <span className="grey">Processing unstake</span>
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
                        <span className="grey">Ready to Withdraw</span>
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
                        disabled={blockedWithdrawals.includes(record.id)}
                        onClick={() => {
                            setWithdrawalId(record.id);
                            setModalAmount(record.amount);
                            setModalMode("restake");
                        }}
                    >Restake</Button>
                </Col>
                <Col xs={1}/>
                <Col xs={11}>
                <Button
                    disabled={
                    record.status === withdrawalStatus.pending || blockedWithdrawals.includes(record.id)
                    }
                    onClick={() => {
                    setWithdrawalId(record.id);
                    setModalAmount(record.amount);
                    setModalMode("withdraw");
                    }}
                >Withdraw</Button>
                </Col>
            </Row>
        </>
    );

    const onStakingModalConfirm = (operationStatus, txHash) => {
        const operationInfo = {
          operationStatus,
          txHash
        };
    
        // setOperationModalInfo(operationInfo);
        // setIsOperationModalVisible(true);
        // resetBalancesAndValues();
      };

    return (
        <div className="Card RewardsStakingOptions">
            <h3 className="CardTitle">MoC Staking Rewards</h3>
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
        </div>
    );
}