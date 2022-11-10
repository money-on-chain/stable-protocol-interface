import React from 'react';
import {useTranslation} from "react-i18next";
import {config} from '../../projects/config';
import { ReactComponent as LogoIcon } from '../../assets/icons/icon-alert.svg';


function AlertLabel(props) {

    const [t, i18n] = useTranslation(["global", 'moc','rdoc']);
    const ns = config.environment.AppProject === 'MoC' ? 'moc' : 'rdoc';
    const AppProject = config.environment.AppProject;
    return (
        <div className="AlertLabel">
            <LogoIcon alt="Alert Icon" />
            <div className="AlertText">
                <p>
                    <strong>{t(`${AppProject}.modal-send.beCareful`, {ns: ns})}</strong>
                </p>
                <p>{t(`${AppProject}.modal-send.alertAddress`, {ns: ns})}.</p>
            </div>
        </div>
    );
}

export default AlertLabel;
