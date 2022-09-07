import React, { useContext, useState, useEffect } from 'react';
import { AuthenticateContext } from '../../../../Context/Auth';
import { useTranslation } from "react-i18next";
import { Skeleton } from 'antd';
import { LargeNumber } from '../../../LargeNumber';
import {config} from '../../../../Config/config'; 

function Liquidity(props) {
    const auth = useContext(AuthenticateContext);
    const [t, i18n] = useTranslation(["global", 'moc']);
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
                {t(`${appMode}.metrics.bucketsInTokens.title`, { ns: ns })} {t(`${appMode}.Tokens_RISKPRO_name`, { ns: ns })} | {t(`${appMode}.metrics.bucketsInTokens.title`, { ns: ns })} {t(`${appMode}.Tokens_RISKPROX_name`, { ns: ns })}
            </h3>

            <div className="CardMetricContent BProThemeMetric">
               {!loading
                ? <><div>
                        <h5>{t(`${appMode}.metrics.bucketsInTokens.total`, { ns: ns })} {t(`${appMode}.Tokens_RESERVE_name`, { ns: ns })}</h5>
                        <LargeNumber amount={props.b0BTCAmount} currencyCode={'RESERVE'} />
                        <h5>{t(`${appMode}.metrics.bucketsInTokens.total`, { ns: ns })} {t(`${appMode}.Tokens_STABLE_name`, { ns: ns })}</h5>
                        <LargeNumber amount={props.b0DocAmount} currencyCode={'STABLE'} />
                        <h5>{t(`${appMode}.metrics.bucketsInTokens.total`, { ns: ns })} {t(`${appMode}.Tokens_RISKPRO_name`, { ns: ns })}</h5>
                        <LargeNumber amount={props.b0BproAmount} currencyCode={'RISKPRO'} />
                    </div>
                    <div className="separator" /><div>
                        <h5>{t(`${appMode}.metrics.bucketsInTokens.total`, { ns: ns })} {t(`${appMode}.Tokens_RESERVE_name`, { ns: ns })}</h5>
                        <LargeNumber amount={props.x2BTCAmount} currencyCode={'RESERVE'} />
                        <h5>{t(`${appMode}.metrics.bucketsInTokens.total`, { ns: ns })} {t(`${appMode}.Tokens_STABLE_name`, { ns: ns })}</h5>
                        <LargeNumber amount={props.x2DocAmount} currencyCode={'STABLE'} />
                        <h5>{t(`${appMode}.metrics.bucketsInTokens.total`, { ns: ns })} {t(`${appMode}.Tokens_RISKPROX_name`, { ns: ns })}</h5>
                        <LargeNumber amount={props.x2BproAmount} currencyCode={'RISKPROX'} />
                    </div></>
                : <Skeleton active={true} />}
            </div>
        </div>
    );
}

export default Liquidity;
