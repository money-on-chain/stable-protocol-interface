import React, { useContext, useState, useEffect } from 'react';
import Modal from 'antd/lib/modal/Modal';

import {useProjectTranslation} from "../../../helpers/translations";
import Swap from "../Swap";
import { Button } from 'antd';
import './style.scss';


export default function ModalTokenMigration(props) {

    const [visible, setVisible] = useState(false);

    const showModal = () => {
        setVisible(true);
    };

    const hideModal = () => {
        setVisible(false);
    };

    const [t, i18n, ns] = useProjectTranslation();

    return (
        <div className="ShowTokenMigration">
            <div className="NotificationMigration">
                <div className="Important">Important</div>
                <div className="Information">RIF Dollar on Chain (RDOC) is changing to RIF US Dollar (USDRIF). You need to swap your RIF Dollar on Chain (RDOC) to operate with the updated DAPP. You will no longer be able to see your RDOC balances in the DAPP. Please swap your tokens using the Swap Now button.</div>
                <div className="Action"><Button className="btnSwap" onClick={showModal}>Swap Now</Button></div>
            </div>
            <Modal
                title=""
                width={460}
                visible={visible}
                onCancel={hideModal}
                footer={null}
                className="ModalTokenMigration"
            >
                <Swap {...props} onCloseModal={hideModal} />
            </Modal>
        </div>
    )
}