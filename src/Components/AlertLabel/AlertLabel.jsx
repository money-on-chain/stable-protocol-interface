import React from 'react';
import {useTranslation} from "react-i18next";
import {config} from '../../Config/config';


function AlertLabel(props) {

    const [t, i18n] = useTranslation(["global", 'moc','rdoc']);
    const ns = config.environment.AppMode === 'MoC' ? 'moc' : 'rdoc';
    const appMode = config.environment.AppMode;
    return (
        <div className="AlertLabel">
            <img src={process.env.REACT_APP_PUBLIC_URL+"global/icon-alert.svg"} alt="Alert Icon" />
            <div className="AlertText">
                <p>
                    <strong>{t(`${appMode}.modal-send.beCareful`, {ns: ns})}</strong>
                </p>
                <p>{t(`${appMode}.modal-send.alertAddress`, {ns: ns})}.</p>
            </div>
        </div>
    );
}

export default AlertLabel;
