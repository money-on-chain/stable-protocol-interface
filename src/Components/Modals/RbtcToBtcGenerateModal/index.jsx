import { Modal } from 'antd';
import React, { useContext, useState } from 'react';
import { Button } from 'antd';
import WarningOutlined from '@ant-design/icons/WarningOutlined';
import CopyOutlined from '@ant-design/icons/CopyOutlined';
import { AuthenticateContext } from '../../../Context/Auth';
import Copy from '../../../Components/Page/Copy';
import './style.scss';
export default function RbtcToBtcGenerateModal(props) {
    const {title='rBTC to BTC',alertText='Always generate the BTC deposit address, as the system might update it'} = props
    const [hasTokenQr, setHasTokenQr] = useState(false);
    const auth = useContext(AuthenticateContext);
    const { accountData = {} } = auth;
    const {visible = false, handleClose = () => {}} = props;
    const titleModal = (
        <div className='title'>
            <div className="CardLogo">
                <img width="32" src="https://static.moneyonchain.com/moc-alphatestnet/public/images/icon-sovryn_fastbtc.svg" alt=""/>
                <h1>Sovryn <br/>FastBTC</h1>
                <div className='title-text'>
                    <h1>{title}</h1>
                </div>
            </div>
        </div>
    );

    const footerModal = (
        <div className="alert-message">
            <WarningOutlined />
            <p>{alertText}</p>
        </div>
    );

    return (
        <Modal
            visible={visible}
            title={titleModal}
            footer={!hasTokenQr && footerModal}
            width={400}
            onCancel={handleClose}
            className="RbtcToBtcModal"
        >
            <p className="main-p">Please, review the conversion limits before proceeding with the rBTC to BTC conversion.</p>
            <div className='conversion-limits'>
                <b>Conversion limits</b>
                <p>Min: 0 BTC</p>
                <p>Max: 0 BTC</p>
            </div>

            <p className="instructions"><strong>Instructions</strong></p>
            <ul className="instructions">
                <li>Do not deposit anything other than BTC.</li>
                <li>Do not send more BTC than the MAX limit.</li>
                <li>Allow up to 60 mins for the transaction to process.</li>
                <li>If rBTC is not visible in your wallet after 60 mins open a <a href='https://sovryn.freshdesk.com/support/tickets/new'><strong>support ticket</strong></a> at Sovryn.</li>
            </ul>

            {!hasTokenQr && (<div className="GenerateBTC">
                <Button type="primary" onClick={()=>setHasTokenQr(true)}>
                    <b>Generate BTC <br/>Deposit Address</b>
                </Button>
            </div>)}

            { hasTokenQr && (<div className='generated-qr'>
                <div className="token">
                    <h3>Send BTC to this address</h3>
                    <div className='CopyableText'>
                        <CopyOutlined />
                        <p className='token'>tb1qhv...qvj4</p>
                    </div>
                </div>
                <div className="qr">

                </div>
            </div>)}
        </Modal>
    );
}
