import { Row, Col } from 'antd'
import './style.scss'
import { Select, Input } from 'antd';
import React from 'react';
const { Option } = Select;

export default function CoinSelect(props) {
    return (
        <div className="CoinSelect">
            <label className="FormLabel">{ props.label }</label>
            <Row>
                <Col span={16}>
                    <Input type="number" placeholder="0.00" style={{ width: '100%' }} />
                </Col>
                <Col span={8}>
                    <Select defaultValue="RBTC" style={{ width: '100%' }}>
                        <Option value="RBTC">
                            <img
                                width={30}
                                src={window.location.origin + '/icon-rbtclogo.svg'}
                                alt="icon-rbtc"
                            /> RBTC
                        </Option>
                        <Option value="DOC">
                            <img
                                width={30}
                                src={window.location.origin + '/icon-stable.svg'}
                                alt="icon-doc"
                            /> DOC
                        </Option>
                    </Select>
                </Col>
            </Row>
            <Row style={{marginTop: 10}}>
                <Col span={12}>
                    <a className="FormLabel Selectable">Add total available</a>
                </Col>
                <Col span={12}>
                    <div className="Number">0.005222 RBTC</div>
                </Col>
            </Row>
        </div>
    )
}