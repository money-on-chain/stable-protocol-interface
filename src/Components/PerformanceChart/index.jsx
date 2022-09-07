import React, { useState } from 'react';

import { Row, Col, Tabs } from 'antd';
import { useTranslation } from "react-i18next";
import { config } from '../../Config/config';

export default function PerformanceChart(props) {

    const [percent, setPercent] = useState(0);
    const [t, i18n] = useTranslation(["global", 'moc', 'rdoc']);
    const ns = config.environment.AppMode === 'MoC' ? 'moc' : 'rdoc';
    const appMode = config.environment.AppMode;

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
                            <div>{t(`${appMode}.app.code`, { ns: ns })}</div>
                        </div>
                    </div>
                    <div className="ChartColumn">
                        <div className="Bar Percent Gray" style={{ height }} />
                        <div className="Bar">
                            <div>{t(`${appMode}.app.code`, { ns: ns })}<br />+<br />{t(`${appMode}.staking`, { ns: ns })}</div>
                        </div>
                    </div>
                </div>
            </Row>
            <Row className="ChartFooter">
                <Col xs={24}>
                    <h1>{percent > 0 && `${percent}%`}</h1>
                    <h4>{t(`${appMode}.Staking_AnnualizedPerformanceTitle`, { ns: ns })}</h4>
                </Col>
            </Row>
        </div>
    )
}
