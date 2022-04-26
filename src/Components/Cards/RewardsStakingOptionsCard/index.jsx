import React, { useEffect, useState } from 'react';
import { Row, Col, Tabs } from 'antd';
import PerformanceChart from '../../../Components/PerformanceChart';
import { LargeNumber } from '../../LargeNumber';
import './style.scss';

const { TabPane } = Tabs;

export default function RewardsStakingOptions(props) {

    // falta los SETS
    const [stackedBalance, setStakedBalance] = useState("0");
    const [mocBalance, setMocBalance] = useState("0");

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
                    </Col>
                </Row>
            </div>)
    };

    return (
        <div className="Card RewardsStakingOptions">
            <h3 className="CardTitle">MoC Staking Rewards</h3>
            <Tabs defaultActiveKey="1">
                <TabPane tab="Stake" key="1">
                    {renderStaking()}
                </TabPane>
                <TabPane tab="Unstake" key="2">

                </TabPane>
                <TabPane tab="Withdraw" key="3">

                </TabPane>
            </Tabs>
        </div>
    );
}