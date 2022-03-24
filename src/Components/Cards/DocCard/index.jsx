import {ArrowRightOutlined} from '@ant-design/icons'
import { Row, Col } from 'antd'
import './style.scss'
import React from 'react'
import {Button} from 'antd'
import {useNavigate} from "react-router-dom";

export default function DocCard(props) {
    const navigate = useNavigate();

    return (
        <Row className="Card DocCard">
            <Col span={8}>
                <Row>
                    <Col span={10}>
                        <img
                            width={45}
                            src={window.location.origin + '/icon-stable.svg'}
                            alt="icon-wallet"
                        />
                    </Col>
                    <Col
                        span={14}
                        style={{
                            textAlign: 'right',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end'
                        }}>
                        <span className="Number Doc">969.97</span>
                    </Col>
                </Row>
            </Col>
            <Col span={14} style={{
                flexDirection: 'column',
                textAlign: 'right',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end'
            }}>
                <div className="Numbers Left">
                    <div className="Number Few">969.97 RBTC</div>
                    <div className="Number Few">969.97 USD</div>
                </div>
            </Col>
            <Col span={2} style={{ textAlign: 'right' }}>
                <Button
                    className="ArrowButton"
                    type="primary"
                    shape="circle"
                    onClick={() => navigate('/mint/doc')}
                    icon={ <ArrowRightOutlined /> }
                />
            </Col>
        </Row>
    )
}