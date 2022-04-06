import './style.scss'
import React, { Fragment } from 'react';
import { useContext } from 'react'
import { Row, Col } from 'antd';
import WalletBalancePie from "../WalletBalancePie";
import Copy from "../../Page/Copy";
import {AuthenticateContext} from "../../../Context/Auth";


function WalletBalance(props) {




    const auth = useContext(AuthenticateContext);
    const { accountData = {} } = auth;


    return (
        <Row className="WalletBalance">
            <Col>Your Wallet Balance</Col>
            <WalletBalancePie/>
                <div className="TotalBalanceBottom">
                    <div className="CopyableText ">
                        <span className="title">Address</span>
                        <div>
                            <Copy textToShow={accountData.truncatedAddress} textToCopy={accountData.Wallet}/>
                        </div>
                    </div>
                    <div className="ModalSendContainer">
                        <button type="button" className="ButtonPrimary  lowerCase ">Send</button>
                    </div>
                </div>
        </Row>
    )
}

export default WalletBalance