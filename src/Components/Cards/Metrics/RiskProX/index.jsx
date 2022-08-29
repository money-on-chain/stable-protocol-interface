import React, { useContext, useState, useEffect } from 'react';
import { AuthenticateContext } from '../../../../Context/Auth';
import { useTranslation } from "react-i18next";
import { LargeNumber } from '../../../LargeNumber';
import { Skeleton } from 'antd';

function RiskProX(props) {
    const auth = useContext(AuthenticateContext);

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
                    src={process.env.REACT_APP_ENVIRONMENT_APP_PROJECT+'/icon-riskprox.svg'}
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
                                <LargeNumber amount={props.usdValue} currencyCode={'USDPrice'} />
                            </span>
                            <h5 style={{ marginTop: '2em' }}>{t('MoC.metrics.RISKPROX.total', { ns: 'moc' })}</h5>
                            <span className={'red space'}>
                                <LargeNumber amount={props.total} currencyCode="RISKPROX" />
                            </span>
                            <h5>{t('MoC.metrics.RISKPROX.availableMint', { ns: 'moc' })}</h5>
                            <span className={'red'}>
                                <LargeNumber amount={props.availableMint} currencyCode="RISKPROX" />
                            </span>
                        </div>
                        <div className="separator" /><div>
                            <h5>{t('MoC.metrics.RISKPROX.leverage', { ns: 'moc' })}</h5>
                            <span className={'space'}>
                                <LargeNumber amount={props.leverage} currencyCode="RISKPROX" />
                            </span>
                            <h5>{t('MoC.metrics.RISKPROX.coverage', { ns: 'moc' })}</h5>
                            <LargeNumber amount={props.coverage} currencyCode="RISKPROX" />
                        </div></>
                : <Skeleton active={true} />}
            </div>
        </div>
    );
}

export default RiskProX;
