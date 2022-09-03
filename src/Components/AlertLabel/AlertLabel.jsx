import React from 'react';
import {useTranslation} from "react-i18next";


function AlertLabel(props) {

    async function loadAssets() {
        try {

                let css1= await import('./'+process.env.REACT_APP_ENVIRONMENT_APP_PROJECT+'/style.scss')

        } catch (error) {
            console.log(`Ocurrió un error al cargar imgs: ${error}`);
        }
    }
    loadAssets()

    const [t, i18n] = useTranslation(["global", 'moc'])
    return (
        <div className="AlertLabel">
            <img src={"global/icon-alert.svg"} alt="Alert Icon" />
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
