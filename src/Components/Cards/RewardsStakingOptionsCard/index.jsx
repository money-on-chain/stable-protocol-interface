import React, { useEffect, useState } from 'react';
import { Row, Col, Tabs } from 'antd';

const { TabPane } = Tabs;

export default function RewardsStakingOptions(props) {
    return (
        <div className="Card RewardsStakingOptions">
            <h3 className="CardTitle">MoC Staking Rewards</h3>
            <Tabs defaultActiveKey="1">
                <TabPane tab="Stake" key="1">

                </TabPane>
                <TabPane tab="Unstake" key="2">

                </TabPane>
                <TabPane tab="Withdraw" key="3">

                </TabPane>
            </Tabs>
        </div>
    );
}