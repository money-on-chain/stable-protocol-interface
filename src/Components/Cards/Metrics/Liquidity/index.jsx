import React, { useContext, useState, useEffect } from 'react';
import { AuthenticateContext } from '../../../../Context/Auth';
import { getDatasMetrics } from '../../../../Helpers/helper';
import { useTranslation } from "react-i18next";
import { Skeleton } from 'antd';

function Liquidity() {
    const auth = useContext(AuthenticateContext);
    const { accountData } = auth;

    const getDatas = getDatasMetrics(auth);
    const [t, i18n] = useTranslation(["global", 'moc']);
    const [loading, setLoading] = useState(true);
    const timeSke= 1500

    useEffect(() => {
        setTimeout(() => setLoading(false), timeSke)
    },[auth]);

    return (
        <div className="Card CardSystemStatus">
            <h3 className="CardTitle" style={{ fontSize: '1.4em' }}>
                {t('MoC.metrics.bucketsInTokens.title', { ns: 'moc' })} {t('MoC.Tokens_RISKPRO_name', { ns: 'moc' })} | {t('MoC.metrics.bucketsInTokens.title', { ns: 'moc' })} {t('MoC.Tokens_RISKPROX_name', { ns: 'moc' })}
            </h3>

            <div className="CardMetricContent">
               {!loading
                ? <><div>
                        <h3>{t('MoC.metrics.bucketsInTokens.total', { ns: 'moc' })} {t('MoC.Tokens_RESERVE_name', { ns: 'moc' })}</h3>
                        {getDatas['liquidity_totalBTCAmount']}
                        <h3>{t('MoC.metrics.bucketsInTokens.total', { ns: 'moc' })} {t('MoC.Tokens_STABLE_name', { ns: 'moc' })}</h3>
                        {getDatas['liquidity_docAvailableToRedeem']}
                        <h3>{t('MoC.metrics.bucketsInTokens.total', { ns: 'moc' })} {t('MoC.Tokens_RISKPRO_name', { ns: 'moc' })}</h3>
                        {getDatas['liquidity_b0BproAmount']}
                    </div>
                    <div className="separator" /><div>
                        <h3>{t('MoC.metrics.bucketsInTokens.total', { ns: 'moc' })} {t('MoC.Tokens_RESERVE_name', { ns: 'moc' })}</h3>
                        {getDatas['liquidity_interest']}
                        <h3>{t('MoC.metrics.bucketsInTokens.total', { ns: 'moc' })} {t('MoC.Tokens_STABLE_name', { ns: 'moc' })}</h3>
                        {getDatas['liquidity_x2DocAmount']}
                        <h3>{t('MoC.metrics.bucketsInTokens.total', { ns: 'moc' })} {t('MoC.Tokens_RISKPROX_name', { ns: 'moc' })}</h3>
                        {getDatas['liquidity_x2BproAmount']}
                    </div></>
                : <Skeleton active={true} />}
            </div>
        </div>
    );
}

export default Liquidity;
