import { Row, Col, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AuthenticateContext } from '../../../Context/Auth';
import {useTranslation} from "react-i18next";
import { config } from '../../../Config/config';
import { ReactComponent as LogoIconRBTC } from '../../../assets/icons/icon-btc_to_rbtc.svg';


export default function BtcToRbtc(props) {

    const auth = useContext(AuthenticateContext);
    const [t, i18n]= useTranslation(["global",'moc', 'rdoc']);
    const ns = config.environment.AppProject === 'MoC' ? 'moc' : 'rdoc';
    const AppProject = config.environment.AppProject;
    const{
        title = 'BTC to rBTC Peg In',
        description = t(`${AppProject}.fastbtc.getRBTC_description`, {ns: ns}),
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
                        <LogoIconRBTC className="logo-img" width="111" height="111" alt=""/>
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