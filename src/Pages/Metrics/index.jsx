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
import { useTranslation } from "react-i18next";
import './style.scss'

function Metrics(props) {
    const [t, i18n] = useTranslation(["global", 'moc']);

    return (
        <Fragment>
            <h1 className="PageTitle">{t('global.Metrics_title', { ns: 'global' })}</h1>
            <h3 className="PageSubTitle">{t('global.Metrics_subtitle', { ns: 'global' })}</h3>
            <Row gutter={15} className="MetricsCardsContainer">
                <Col className={'SystemStatusSection'}>
                    <SystemStatus />
                </Col>
                <Col className={'RBTCSection'}>
                    <RBTC />
                </Col>
            </Row>

            <Row style={{ marginTop: 15 }} gutter={15} className="MetricsCardsContainer">
                <Col className={'MetricsCardsDOC'}>
                    <DOC />
                </Col>
                <Col className={'MetricsCardsBPRO'}>
                    <BPRO />
                </Col>
                <Col className={'MetricsCardsBTCX'}>
                    <BTCX />
                </Col>
            </Row>

            <Row style={{ marginTop: 15 }} gutter={15} className="MetricsCardsContainer">
                <Col className={'MetricsCardsMOC'}>
                    <MOC />
                </Col>
                <Col className={'MetricsCardsLiquidity'}>
                    <Liquidity />
                </Col>
                <Col className={'MetricsCardsNextSettlement'}>
                    <NextSettlement />
                </Col>
            </Row>
        </Fragment>
    )
}

export default Metrics;
