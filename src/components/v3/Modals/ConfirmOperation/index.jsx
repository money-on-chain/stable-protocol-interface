
import React, { useContext, useState, useEffect } from 'react';
import Modal from 'antd/lib/modal/Modal';

import {useProjectTranslation} from "../../../../helpers/translations";
import {config} from "../../../../projects/config";
import ConfirmOperation from "../../../v3/ConfirmOperation";
import {Button} from "antd";


export default function ModalConfirmOperation() {

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
        <div className="ShowModalConfirmOperation">
            <Button
                type="primary"
                className="btnConfirm"
                onClick={showModal}
            >Exchange</Button>
            <Modal
                title="Exchange Details"
                width={505}
                visible={visible}
                onCancel={hideModal}
                footer={null}
                className="ModalConfirmOperation"
            >
                <ConfirmOperation/>
            </Modal>
        </div>
    )
}