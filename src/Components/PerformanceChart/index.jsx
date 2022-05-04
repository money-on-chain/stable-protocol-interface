import React, { useState } from 'react';
import './style.scss';
import { Row, Col, Tabs } from 'antd';

export default function PerformanceChart(props) {
    const [percent, setPercent] = useState(0);
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
                        <div className="Bar Percent Hidden" style={{ height }}/>
                        <div className="Bar">
                            <div>MoC</div>
                        </div>
                    </div>
                    <div className="ChartColumn">
                        <div className="Bar Percent Gray" style={{ height }}/>
                        <div className="Bar">
                            <div>MoC<br/>+<br/>Staking</div>
                        </div>
                    </div>
                </div>
            </Row>
            <Row className="ChartFooter">
                <Col xs={24}>
                    <h1>{percent > 0 && `${percent}%`}</h1>
                    <h4>MoC Staking Annualized Performance</h4>
                </Col>
            </Row>
        </div>
    )
}
