import { Row, Col, Tooltip, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AuthenticateContext } from '../../../Context/Auth';
import {useTranslation} from "react-i18next";
const BigNumber = require('bignumber.js');

export default function BtcToRbtc(props) {

    async function loadAssets() {
        try {

                let css1= await import('./'+process.env.REACT_APP_ENVIRONMENT_APP_PROJECT+'/style.scss')

        } catch (error) {
            console.log(`Ocurrió un error al cargar imgs: ${error}`);
        }
    }
    loadAssets()

    const [t, i18n]= useTranslation(["global",'moc'])
    const{
        title = 'BTC to rBTC Peg In',
        description = t('MoC.fastbtc.getRBTC_description', {ns: 'moc'}),
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
                             src={'/icons/'+process.env.REACT_APP_ENVIRONMENT_APP_PROJECT+'/icon-btc_to_rbtc.svg'}
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