import React from 'react';
import {config} from '../../projects/config';
import { ReactComponent as LogoIcon } from '../../assets/icons/icon-alert.svg';
import { useProjectTranslation } from '../../helpers/translations';

function AlertLabel(props) {

    const [t, i18n, ns]= useProjectTranslation();
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
