import { Fragment } from "react";
import { Row, Col } from 'antd';
import RewardsStakingOptions from "../../Components/Cards/RewardsStakingOptionsCard";

export default function Rewards(props) {
    return (
        <Fragment>
            <h1 className="PageTitle">MoC</h1>
            <h3 className="PageSubTitle">Manage your BPros</h3>
            <Row>
                <Col>
                    <RewardsStakingOptions />
                </Col>
            </Row>
        </Fragment>
    )
}