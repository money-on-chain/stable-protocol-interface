import Modal from 'antd/lib/modal/Modal';
import React from 'react';
import {Button} from 'antd';
import './style.scss'
import {useTranslation} from "react-i18next";
import Copy from "../../Page/Copy";

const OperationStatusModal = ({ className, visible, onCancel, title, operationStatus, txHash }) => {
  const [t, i18n]= useTranslation(["global",'moc'])
    return (
        <Modal
            className={'OperationStatusModal ' + className || ''}
            footer={null}
            visible={visible}
            onCancel={onCancel}
        >
            {<h1>{title || t('global.RewardsClaimButton_Modal_Title')}</h1>}
            <div className="InfoContainer" style={{ padding: 45}}>
                <span className="title">{t('global.RewardsClaimButton_Modal_TxStatus')}</span>
                <span className={`value ${operationStatus}`}>
                    {t(`global.RewardsClaimButton_Modal_TxStatus_${operationStatus}`)}
                </span>
            </div>
            <div className="InfoContainer">
                <span className="title">{t('global.RewardsClaimButton_Modal_Hash')}</span>
                <Copy textToShow='Copy' textToCopy={txHash}/>
            </div>
            <a href={`${window.explorerUrl}/tx/${txHash}`} target="_blank">
                {t('global.RewardsClaimButton_Modal_ViewOnExplorer')}
            </a>
            <Button
                lowerCase
                text={t('global.RewardsClaimButton_Modal_Close')}
                onClick={onCancel}
            ></Button>
        </Modal>
    );
};

export default OperationStatusModal;
