import React, { useContext, useState, useEffect } from 'react';
import { AuthenticateContext } from '../../../../Context/Auth';
import { getDatasMetrics } from '../../../../Helpers/helper';
import { useTranslation } from "react-i18next";
import { LargeNumber } from '../../../LargeNumber';
import { Skeleton } from 'antd';

function BTCX(props) {
    const auth = useContext(AuthenticateContext);
    const { accountData } = auth;

    const getBtcx = getDatasMetrics(auth);
    const [t, i18n] = useTranslation(["global", 'moc']);
    const [loading, setLoading] = useState(true);
    const timeSke= 1500

    useEffect(() => {
        setTimeout(() => setLoading(false), timeSke)
    },[auth]);

    return (
        <div className="Card CardSystemStatus">
            <h3 className="CardTitle" style={{ fontSize: '1.4em' }}>
                <img
                    width={45}
                    src={'Moc/icon-riskprox.svg'}
                    alt=""
                    style={{ marginRight: 10 }}
                /> {t('MoC.wallets.RISKPROX.title', { ns: 'moc' })}
            </h3>

            <div className="CardMetricContent BProxThemeMetric">
                {!loading
                    ? <>
                        <div>
                            <h5>{t('MoC.metrics.RISKPROX.usd', { ns: 'moc' })}</h5>
                            <span>
                                {/*<LargeNumber {...{ amount: getBtcx['btcx_usd'], currencyCode: 'RISKPROX', includeCurrency: true }} />*/}
                                <LargeNumber amount={props.usdValue} currencyCode={'USDPrice'} />
                            </span>
                            <h5>{t('MoC.metrics.RISKPROX.total', { ns: 'moc' })}</h5>
                            <span className={'red space'}>
                                <LargeNumber amount={props.total} currencyCode="RISKPROX" />
                                {/*getBtcx['interest']*/}
                            </span>
                            <h5>{t('MoC.metrics.RISKPROX.availableMint', { ns: 'moc' })}</h5>
                            <span className={'red'}>
                                <LargeNumber amount={props.availableMint} currencyCode="RISKPROX" />
                                {/*getBtcx['bprox2AvailableToMint']*/}
                            </span>
                        </div>
                        <div className="separator" /><div>
                            <h5>{t('MoC.metrics.RISKPROX.leverage', { ns: 'moc' })}</h5>
                            <span className={'space'}>
                                <LargeNumber amount={props.leverage} currencyCode="RISKPROX" />
                                {/*getBtcx['x2Leverage']*/}
                            </span>
                            <h5>{t('MoC.metrics.RISKPROX.coverage', { ns: 'moc' })}</h5>
                            <LargeNumber amount={props.coverage} currencyCode="RISKPROX" />
                            {/*getBtcx['x2Coverage']*/}
                        </div></>
                : <Skeleton active={true} />}
            </div>
        </div>
    );
}

export default BTCX;
