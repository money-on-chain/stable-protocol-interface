import { Row, Col } from 'antd'
import { useState } from 'react';
import {Modal} from 'antd'
import { currencies as currenciesDetail} from '../../../Config/currentcy';

export default function MintModal(props) {

    const {
        title = '',
        visible = false,
        handleClose = () => {},
        handleConfirm = () => {},
        color = '',
        token = ''
    } = props;
    const [confirmLoading, setConfirmLoading] = useState(false);

    const tokenName = currenciesDetail.find(x => x.value === token).label;

    const handleOk = () => {
        setConfirmLoading(true);
        setTimeout(() => {
            setConfirmLoading(false);
        }, 2000);
    };

    return (
        <Modal
            title={title}
            visible={visible}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleClose}
            cancelText="Cancel"
            okText="Confirm"
        >
            <div className="TabularContent">
                <div className="AlignedAndCentered">
                    <span className="Name Bold">Exchanging</span>
                    <span className="Value Bold">0.000000 RBTC</span>
                </div>
                <div className="AlignedAndCentered">
                    <span className="Name Bold">Receiving</span>
                    <div className="Value">
                        <div className="Bold" style={{color}}>0.000000 {tokenName}</div>
                        <div className="Gray">0.00 USD</div>
                    </div>
                </div>

                <div className="AlignedAndCentered">
                    <div className="Name">
                        <div className="Gray">Fee (0.05%)</div>
                        <div className="Legend">
                            This fee will be deduced from the transaction value transferred
                        </div>
                    </div>
                    <span className="Value">0.00 MOC</span>
                </div>
            </div>
        </Modal>
    )
}