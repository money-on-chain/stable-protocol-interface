import './style.scss';
import React from 'react';
import {useTranslation} from "react-i18next";


function AlertLabel(props) {

    const [t, i18n] = useTranslation(["global", 'moc'])
    return (
        <div className="AlertLabel">
            <img src={window.location.origin + '/icon-alert.svg'} alt="Alert Icon" />
            <div className="AlertText">
                <p>
                    <strong>{t('MoC.modal-send.beCareful', {ns: 'moc'})}</strong>
                </p>
                <p>{t('MoC.modal-send.alertAddress', {ns: 'moc'})}.</p>
            </div>
        </div>
    );
}

export default AlertLabel;
