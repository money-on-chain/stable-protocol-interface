import React, { useContext, useState, useEffect } from 'react';
import Modal from 'antd/lib/modal/Modal';

import {useProjectTranslation} from "../../../../helpers/translations";
import {config} from "../../../../projects/config";
import Exchange from "../../../v3/Exchange";
import {Button} from "antd";


export default function ModalExchange() {
    const [t, i18n, ns] = useProjectTranslation();
    const AppProject = config.environment.AppProject;
    const [visible, setVisible] = useState(false);

    const showModal = () => {
        setVisible(true);
    };

    const hideModal = () => {
        setVisible(false);
    };

    return (
        <div>
            <Button
                type="primary"
                onClick={showModal}
            >{t(`${AppProject}.wallet.send`, { ns: ns })}
            </Button>
            <Modal
                title="Exchange"
                width={650}
                visible={visible}
                onCancel={hideModal}
                footer={null}
                className="ModalExchange"
            >
                <Exchange/>

            </Modal>
        </div>
    )
}