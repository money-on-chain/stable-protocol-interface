import { Fragment } from 'react';
import SystemStatus from '../../Components/Cards/Metrics/SystemStatus'
import RBTC from '../../Components/Cards/Metrics/RBTC'
import MOC from '../../Components/Cards/Metrics/MOC'
import BTCX from '../../Components/Cards/Metrics/BTCX'
import DOC from '../../Components/Cards/Metrics/DOC'
import BPRO from '../../Components/Cards/Metrics/BPRO'
import Liquidity from '../../Components/Cards/Metrics/Liquidity'
import NextSettlement from '../../Components/Cards/Metrics/NextSettlement'
import { Row, Col, Tooltip } from 'antd';
import './style.scss'

function Metrics(props) {
    return (
        <Fragment>
            <h1 className="PageTitle">Metrics</h1>
            <h3 className="PageSubTitle">Current system information</h3>
            <Row gutter={15} className="MetricsCardsContainer">
                <Col span={10}>
                    <SystemStatus />
                </Col>
                <Col span={14}>
                    <RBTC />
                </Col>
            </Row>

            <Row style={{marginTop: 15}} gutter={15} className="MetricsCardsContainer">
                <Col span={6}>
                    <DOC />
                </Col>
                <Col span={9}>
                    <BPRO />
                </Col>
                <Col span={9}>
                    <BTCX />
                </Col>
            </Row>

            <Row style={{marginTop: 15}} gutter={15} className="MetricsCardsContainer">
                <Col span={6}>
                    <MOC />
                </Col>
                <Col span={9}>
                    <Liquidity />
                </Col>
                <Col span={9}>
                    <NextSettlement />
                </Col>
            </Row>
        </Fragment>
    )
}

export default Metrics;
