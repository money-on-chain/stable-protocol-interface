import React, { useContext } from 'react';
import { AuthenticateContext } from '../../../../Context/Auth';
import { getDatasMetrics } from '../../../../Helpers/helper';
import { useTranslation } from "react-i18next";
import { LargeNumber } from '../../../LargeNumber';

function BTCX() {
    const auth = useContext(AuthenticateContext);
    const { accountData } = auth;

    const getBtcx = getDatasMetrics(auth);
    const [t, i18n] = useTranslation(["global", 'moc']);

    return (
        <div className="Card CardSystemStatus">
            <h3 className="CardTitle" style={{ fontSize: '1.4em' }}>
                <img
                    width={45}
                    src={window.location.origin + '/Moc/icon-riskprox.svg'}
                    alt=""
                    style={{ marginRight: 10 }}
                /> {t('MoC.wallets.RISKPROX.title', { ns: 'moc' })}
            </h3>

            <div className="CardMetricContent">
                <div>
                    <h3>{t('MoC.metrics.RISKPROX.usd', { ns: 'moc' })}</h3>
                    <span>
                    <LargeNumber {...{ amount: getBtcx['btcx_usd'], currencyCode: 'RISKPROX', includeCurrency: true }} />
                    </span>
                    <h3>{t('MoC.metrics.RISKPROX.total', { ns: 'moc' })}</h3>
                    <span className={'red space'}>{getBtcx['interest']}</span>
                    <h3>{t('MoC.metrics.RISKPROX.availableMint', { ns: 'moc' })}</h3>
                    <span className={'red'}>{getBtcx['bprox2AvailableToMint']}</span>
                </div>
                <div className="separator" />
                <div>
                    <h3>{t('MoC.metrics.RISKPROX.leverage', { ns: 'moc' })}</h3>
                    <span className={'space'}>{getBtcx['x2Leverage']}</span>
                    <h3>{t('MoC.metrics.RISKPROX.coverage', { ns: 'moc' })}</h3>
                    {getBtcx['x2Coverage']}
                </div>
            </div>
        </div>
    );
}

export default BTCX;
