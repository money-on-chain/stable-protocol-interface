import {ArrowRightOutlined} from '@ant-design/icons'
import { Row, Col } from 'antd'
import React from 'react'
import {Button} from 'antd'
import {useNavigate} from "react-router-dom";

const styleCentered = {
    display: 'flex',
    alignItems: 'center',
    justifyItems: 'center',
};

export default function TokenSummaryCard(props) {
    const navigate = useNavigate();
    const {tokenName = '', color= '#000', page=''} = props;
    return (
        <Row className="Card TokenSummaryCard">
            <Col
                span={8}
                style={{
                    ...styleCentered,
                    textAlign: 'right',
                }}
            >
                <Row className="ArrowHomeIndicators" style={{width: '100%'}}>
                    <Col
                        span={8}
                        style={{
                            ...styleCentered,
                            justifyContent: 'flex-start',
                        }}
                    >
                        <img
                            width={45}
                            src={window.location.origin + `/Moc/icon-${tokenName}.svg`}
                            alt="icon-wallet"
                        />
                    </Col>
                    <Col
                        span={16}
                        style={{
                            ...styleCentered,
                            justifyContent: 'flex-end',
                            textAlign: 'right'
                        }}
                    >
                        <span className="Number" style={{color}}>969.97</span>
                    </Col>
                </Row>
            </Col>
            <Col span={14} style={{
                ...styleCentered,
                flexDirection: 'column',
                justifyContent: 'center',
                textAlign: 'right',
            }}>
                <div className="Numbers Left">
                    <div className="Number Few">969.97 RBTC</div>
                    <div className="Number Few">969.97 USD</div>
                </div>
            </Col>
            <Col span={2} style={{
                ...styleCentered,
                justifyContent: 'flex-end'
            }}>
                <Button
                    className="ArrowButton"
                    type="primary"
                    shape="circle"
                    onClick={() => navigate(page)}
                    icon={ <ArrowRightOutlined /> }
                />
            </Col>
        </Row>
    )
}