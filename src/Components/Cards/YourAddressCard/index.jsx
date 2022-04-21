import { Row, Col, Button } from 'antd';
import React from 'react';
import { useContext } from 'react'
import QRCode from 'react-qr-code';
import {AuthenticateContext} from "../../../Context/Auth";
import Copy from "../../Page/Copy";

export default function YourAddressCard(props) {
    const {tokenName = ''} = props;
    const auth = useContext(AuthenticateContext);
    const { accountData = {} } = auth;

    return (
        <div className="Card CardYourAddress">
            <h3 className="CardTitle">Your Address</h3>
            <Row>
                <Col span={24} style={{ textAlign: 'center' }}>
                    <QRCode value={accountData.Wallet} size="128" />
                </Col>
                <Col span={24} style={{ textAlign: 'center' }}>
                    <Copy textToShow={accountData.truncatedAddress} textToCopy={accountData.Wallet}/>
                </Col>
                <Col span={24} style={{ textAlign: 'center' }}>
                    <a style={{ color: '#09c199' }}>Register your domain name</a>
                </Col>
            </Row>
            <Row style={{ display: 'flex', justifyContent: 'center'}}>
                <Col>
                    <Button type="primary" >
                        Send
                    </Button>
                </Col>
            </Row>
        </div>
    )
}