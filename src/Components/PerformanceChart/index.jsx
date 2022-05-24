import React, { useState } from 'react';
import './style.scss';
import { Row, Col, Tabs } from 'antd';
import { useTranslation } from "react-i18next";

export default function PerformanceChart(props) {
    const [percent, setPercent] = useState(0);
    const [t, i18n] = useTranslation(["global", 'moc'])

    let height = percent && percent > 0 ? percent * 190 / 100 : 0;
    fetch("https://api.moneyonchain.com/api/calculated/moc_last_block_performance").then(async response => {
        const data = await response.json();
        setPercent(data.annualized_value.toFixed(2));
    });
    return (
        <div>
            <Row>
                <div className="ChartGraphic">
                    <div className="ChartColumn">
                        <div className="Bar Percent Hidden" style={{ height }} />
                        <div className="Bar">
                            <div>{t('MoC.app.code', { ns: 'moc' })}</div>
                        </div>
                    </div>
                    <div className="ChartColumn">
                        <div className="Bar Percent Gray" style={{ height }} />
                        <div className="Bar">
                            <div>{t('MoC.app.code', { ns: 'moc' })}<br />+<br />{t('MoC.staking', { ns: 'moc' })}</div>
                        </div>
                    </div>
                </div>
            </Row>
            <Row className="ChartFooter">
                <Col xs={24}>
                    <h1>{percent > 0 && `${percent}%`}</h1>
                    <h4>{t('MoC.Staking_AnnualizedPerformanceTitle', { ns: 'moc' })}</h4>
                </Col>
            </Row>
        </div>
    )
}
