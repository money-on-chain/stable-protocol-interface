import {Col, Modal} from 'antd';
import React, { useContext, useState } from 'react';
import { Button } from 'antd';
import { AuthenticateContext } from '../../../context/Auth';
import CopyModal from "../../Page/CopyModal";
import {useTranslation} from "react-i18next";
export default function MintModal(props) {
    const auth = useContext(AuthenticateContext);
    const { accountData = {} } = auth;
    const {visible = false, handleClose = () => {}} = props;
    const [t, i18n]= useTranslation(["global",'moc'])

    return (
        <Modal
            title={t("global.Connected_Wallet", { ns: 'global' })}
            visible={visible}
            footer={''}
            width={400}
            onCancel={handleClose}
        >
            <div style={{marginTop: 10, display: 'flex', width: '100%', paddingLeft: 20, paddingRight: 20}}>
                <div className="YourAddress" style={{flexGrow: 1}}>
                    <h3>{t('global.TotalBalanceCard_address')}</h3>
                </div>
                <div className="StatusLogin" style={{flexGrow: 0}}>
                    <CopyModal textToShow={accountData.truncatedAddress} textToCopy={accountData.Owner}/>
                </div>
            </div>

            <div style={{marginTop: 10, display: 'flex', width: '100%', paddingLeft: 20, paddingRight: 20}}>
                <Col span={24} style={{ justifyContent: 'space-evenly' }}>
                    <Button style={{'float':'left','width':'120px'}} onClick={() => {auth.disconnect(); handleClose();}}>{t("global.Disconnect", { ns: 'global' })}</Button>
                    <Button style={{'float':'right','width':'120px'}} type="primary"  onClick={() => {handleClose();}}>{t("global.RewardsClaimButton_Modal_Close", { ns: 'global' })}</Button>
                </Col>
            </div>
        </Modal>
    );
}
