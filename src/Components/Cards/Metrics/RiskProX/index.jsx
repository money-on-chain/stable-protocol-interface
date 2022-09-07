import React, { useContext, useState, useEffect } from 'react';
import { AuthenticateContext } from '../../../../Context/Auth';
import { useTranslation } from "react-i18next";
import { LargeNumber } from '../../../LargeNumber';
import { Skeleton } from 'antd';
import {config} from '../../../../Config/config';

function RiskProX(props) {
    const auth = useContext(AuthenticateContext);

    const [t, i18n] = useTranslation(["global", 'moc', 'rdoc']);
    const ns = config.environment.AppMode === 'MoC' ? 'moc' : 'rdoc';
    const appMode = config.environment.AppMode;
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
                    src={auth.urlBaseFull+'icon-riskprox.svg'}
                    alt=""
                    style={{ marginRight: 10 }}
                /> {t(`${appMode}.wallets.RISKPROX.title`, { ns: ns })}
            </h3>

            <div className="CardMetricContent BProxThemeMetric">
                {!loading
                    ? <>
                        <div>
                            <h5>{t(`${appMode}.metrics.RISKPROX.usd`, { ns: ns })}</h5>
                            <span>
                                <LargeNumber amount={props.usdValue} currencyCode={'USDPrice'} />
                            </span>
                            <h5 style={{ marginTop: '2em' }}>{t(`${appMode}.metrics.RISKPROX.total`, { ns: ns })}</h5>
                            <span className={'red space'}>
                                <LargeNumber amount={props.total} currencyCode="RISKPROX" />
                            </span>
                            <h5>{t(`${appMode}.metrics.RISKPROX.availableMint`, { ns: ns })}</h5>
                            <span className={'red'}>
                                <LargeNumber amount={props.availableMint} currencyCode="RISKPROX" />
                            </span>
                        </div>
                        <div className="separator" /><div>
                            <h5>{t(`${appMode}.metrics.RISKPROX.leverage`, { ns: ns })}</h5>
                            <span className={'space'}>
                                <LargeNumber amount={props.leverage} currencyCode="RISKPROX" />
                            </span>
                            <h5>{t(`${appMode}.metrics.RISKPROX.coverage`, { ns: ns })}</h5>
                            <LargeNumber amount={props.coverage} currencyCode="RISKPROX" />
                        </div></>
                : <Skeleton active={true} />}
            </div>
        </div>
    );
}

export default RiskProX;
