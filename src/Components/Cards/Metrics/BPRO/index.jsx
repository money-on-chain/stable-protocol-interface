import React, { useContext } from 'react';
import { AuthenticateContext } from '../../../../Context/Auth';
import { getDatasMetrics } from '../../../../Helpers/helper';
import { useTranslation } from "react-i18next";

function BPRO() {
    const auth = useContext(AuthenticateContext);
    const { accountData } = auth;

    const getBpro = getDatasMetrics(auth);
    const [t, i18n] = useTranslation(["global", 'moc']);

    return (
        <div className="Card CardSystemStatus">
            <h3 className="CardTitle" style={{ fontSize: '1.4em' }}>
                <img
                    width={45}
                    src={window.location.origin + '/Moc/icon-riskpro.svg'}
                    alt=""
                    style={{ marginRight: 10 }}
                /> {t('MoC.wallets.RISKPRO.title', { ns: 'moc' })}
            </h3>

            <div className="CardMetricContent">
                <div>
                    <h3>{t('MoC.metrics.RISKPRO.usd', { ns: 'moc' })}</h3>
                    <span className={'space'}>{getBpro['bpro_usd']}</span>
                    <h3>{t('MoC.metrics.RISKPRO.leverage', { ns: 'moc' })}</h3>
                    {getBpro['b0Leverage']}
                </div>
                <div className="separator" />
                <div>
                    <h3>{t('MoC.metrics.RISKPRO.total', { ns: 'moc' })}</h3>
                    {getBpro['b0BproAmount']}
                    <h3>{t('MoC.metrics.RISKPRO.availableRedeem', { ns: 'moc' })}</h3>
                    {getBpro['bproAvailableToRedeem']}
                    <h3>{t('MoC.metrics.RISKPRO.bproDiscountPriceUsd', { ns: 'moc' })}</h3>
                    {getBpro['bpro_usd']}
                </div>
            </div>
        </div>
    );
}

export default BPRO;
