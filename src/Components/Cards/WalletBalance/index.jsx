import './style.scss'
import React, { Fragment } from 'react';
import { useContext } from 'react'
import { Row, Col } from 'antd';
import WalletBalancePie from "../WalletBalancePie";
import Copy from "../../Page/Copy";
import {AuthenticateContext} from "../../../Context/Auth";
import {useTranslation} from "react-i18next";


function WalletBalance(props) {




    const auth = useContext(AuthenticateContext);
    const { accountData = {} } = auth;
    const [t, i18n]= useTranslation(["global",'moc'])


    return (
        <div className="WalletBalance mrc-15" style={{height: '100%'}}>
            <div className="mrb-15">{t("global.TotalBalanceCard_totalBalance", { ns: 'global' })}</div>
            <WalletBalancePie/>
                <div className="TotalBalanceBottom justify-content-initial">
                    <div className="CopyableText ">
                        <span className="title">Address</span>
                        <div>
                            <Copy textToShow={accountData.truncatedAddress} textToCopy={accountData.Wallet}/>
                        </div>
                    </div>
                    <div className="ModalSendContainer">
                        {/*<button type="button" className="ButtonPrimary  lowerCase ">Send</button>*/}
                    </div>
                </div>
        </div>
    )
}

export default WalletBalance