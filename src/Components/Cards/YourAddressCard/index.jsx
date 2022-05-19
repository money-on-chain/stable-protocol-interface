import { Row, Col, Button } from 'antd';
import React, { useState } from 'react';
import { useContext } from 'react'
import QRCode from 'react-qr-code';
import { AuthenticateContext } from "../../../Context/Auth";
import SendModal from '../../Modals/SendModal';
import Copy from "../../Page/Copy";
import { useTranslation } from "react-i18next";

export default function YourAddressCard(props) {
    const { tokenName = '', height = '' } = props;
    const auth = useContext(AuthenticateContext);
    const { accountData = {} } = auth;
    const [showSendModal, setShowSendModal] = useState(false);

    const checkShowSendModal = () => {
        setShowSendModal(true);
    };

    const [t, i18n] = useTranslation(["global", 'moc'])

    return (
        <div className="Card CardYourAddress" style={{ height: height }}>
            <h3 className="CardTitle">{t("MoC.wallets.ownAddressLabel", { ns: 'moc' })}</h3>
            <Row>
                <Col span={24} style={{ textAlign: 'center' }}>
                    <QRCode value={accountData.Wallet} size="128" />
                </Col>
                <Col span={24} style={{ textAlign: 'center' }}>
                    <Copy textToShow={accountData.truncatedAddress} textToCopy={accountData.Wallet} />
                </Col>
                <Col span={24} style={{ textAlign: 'center' }}>
                    <a style={{ color: '#09c199' }}>{t("MoC.rns.register", { ns: 'moc' })}</a>
                </Col>
            </Row>
            <Row style={{ display: 'flex', justifyContent: 'center' }} className="SendBtn">
                <Col>
                    <Button type="primary" onClick={checkShowSendModal}>
                        {t("MoC.wallet.send", { ns: 'moc' })}
                    </Button>
                </Col>
            </Row>
            <SendModal
                token={tokenName}
                visible={showSendModal}
                handleCancel={() => setShowSendModal(false)}
                currencyOptions={props.currencyOptions}
                UserBalanceData={auth.userBalanceData}
                AccountData={auth.accountData}
            />
        </div>
    )
}