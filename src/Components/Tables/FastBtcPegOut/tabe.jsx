import { Tabs } from 'antd';
import React from 'react';
import FastBtcPegOut from "./index";
const { TabPane } = Tabs;

const onChange = (key) => {
    console.log(key);
};

const Tabe= () => (
    <Tabs defaultActiveKey="1" onChange={onChange}>
        <TabPane tab="Peg In" key="1">

        </TabPane>
        <TabPane tab="Peg Out" key="2">
            <FastBtcPegOut></FastBtcPegOut>
        </TabPane>
    </Tabs>
);

export default Tabe;