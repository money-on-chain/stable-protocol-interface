import { Fragment } from "react";
import { Row, Col } from 'antd';
import RewardsStakingOptions from "../../Components/Cards/RewardsStakingOptionsCard";
import RewardsBalanceCard from "../../Components/Cards/RewardsBalanceCard";
import YourAddressCard from '../../Components/Cards/YourAddressCard';

export default function Rewards(props) {
    return (
        <Fragment>
            <h1 className="PageTitle">MoC</h1>
            <h3 className="PageSubTitle">Manage your BPros</h3>
            <Row gutter={15}>
                <Col xs={24} md={12} xl={5}>
                    
                </Col>
                <Col xs={24} md={12} xl={4}>
                    <YourAddressCard/>
                </Col>
                <Col xs={24} md={24} xl={15}>
                    <RewardsStakingOptions />
                </Col>
            </Row>
        </Fragment>
    )
}