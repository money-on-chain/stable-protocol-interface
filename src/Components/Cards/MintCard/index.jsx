import {ArrowRightOutlined} from '@ant-design/icons'
import { Row, Col } from 'antd'
import './style.scss'
import React, { Fragment } from 'react';
import {Button} from 'antd'
import {useNavigate} from "react-router-dom";
import CoinSelect from '../../Form/CoinSelect'

export default function MintCard(props) {
    const navigate = useNavigate();

    return (
        <div className="Card MintCard">
            <h3 className="CardTitle">Mint</h3>
            <Row gutter={15}>
                <Col span={12}>
                    <CoinSelect label="You Exchange" />
                </Col>
                <Col span={12}>
                    <CoinSelect label="You Receive" />
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <div style={{marginTop: 20}}>
                        <div>1 RBTC = 44,081.18 USD</div>
                        <div className="TextLegend">* Amounts may be different at<br/> transaction confirmation</div>
                    </div>
                </Col>
                <Col span={12} style={{display: 'flex', alignItems: 'end', justifyContent: 'end'}}>
                    <Row style={{marginTop: 20}} gutter={15}>
                        <Col span={12}>
                            <Button type="ghost">Clear</Button>
                        </Col>
                        <Col span={12}>
                            <Button type="primary">Mint</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}