import { Row, Col, Button } from 'antd';
import React, {Fragment, useState} from 'react';
import { useContext } from 'react'
import {AuthenticateContext} from "../../../Context/Auth";
import SendModal from '../../Modals/SendModal';
import AddressContainer from '../../AddressContainer/AddressContainer';
import {useTranslation} from "react-i18next";

export default function YourAddressCard(props) {
    const { height = '', iconWallet, tokenToSend, className, view } = props;
    const auth = useContext(AuthenticateContext);
    const { accountData = {} } = auth;
    const [t, i18n]= useTranslation(["global",'moc'])
    const isLoggedIn = auth?.userBalanceData;

    var { address = '' } = auth.userBalanceData || {};
    if (!isLoggedIn) {
        address = '';
    }

    const classname = `SendToken ${className}`;

    return (
        <div className="Card SendTokenContainer" style={{ height: height, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
            <h3 className="CardTitle">{t('MoC.wallets.ownAddressLabel', {ns: 'moc'})} </h3>
            <div className={classname}>
                <AddressContainer {...{ address }} accountData={accountData} />
            </div>
            <Row style={{ display: 'flex', justifyContent: 'center'}} className="SendBtn">
                <Col>
                    {auth.isLoggedIn && <Fragment>
                    <SendModal
                        {...{ tokensToSend: [tokenToSend], iconWallet}}
                        currencyOptions={props.currencyOptions}
                        userState={auth}
                        view={view}
                    /></Fragment>}
                </Col>
            </Row>
        </div>
    )
}