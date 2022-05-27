import './style.scss'
import { Row, Col, Tooltip, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AuthenticateContext } from '../../../Context/Auth';
const BigNumber = require('bignumber.js');

export default function BtcToRbtc(props) {
    const{
        title = 'BTC to rBTC Peg In',
        description = 'Convert BTC from the Bitcoin network to rBTC Smart Bitcoins using the integrated FastBTC from Sovryn.',
        btnAction = ()=>{},
        btnText = 'Convert rBTC to BTC'
    } = props;

    const {accountData}= useContext(AuthenticateContext);

    return (
        <div className="Card BtoRCard">
            <Row>
                <Col xs={24}>
                    <div className="title">
                        <div className="CardLogo">
                            <h1>{ title }</h1>
                        </div>
                    </div>
                </Col>
            </Row>
            <Row className="m-b">
                <Col xs={8}>
                    <div className='text-center'>
                        <img className="logo-img" width="111"
                             src="https://static.moneyonchain.com/moc-alphatestnet/public/images/icon-btc_to_rbtc.svg"
                             alt=""/>
                    </div>
                </Col>
                <Col xs={13}>
                    <p>{description}</p>
                    {accountData.Wallet &&
                    <Button type="primary" onClick={btnAction}>
                        <b>{btnText}</b>
                    </Button>}
                </Col>
                <Col xs={3}/>
            </Row>

        </div>

    )
}