import { Row, Col, Button } from 'antd';
import React from 'react';

export default function YourAddressCard(props) {
    const {tokenName = ''} = props;

    return (
        <div className="Card CardYourAddress">
            <h3 className="CardTitle">Your Address</h3>
            <Row>

            </Row>
            <Row>
                <Col>
                <Button type="primary" >
                    Send
                </Button>
                </Col>
            </Row>
        </div>
    )
}