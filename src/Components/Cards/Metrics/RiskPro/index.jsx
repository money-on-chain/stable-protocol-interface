import React, { useContext, useState, useEffect } from 'react';
import { AuthenticateContext } from '../../../../Context/Auth';
import { useTranslation } from "react-i18next";
import { LargeNumber } from '../../../LargeNumber';
import { Skeleton } from 'antd';
import { config} from '../../../../Config/config';

function RiskPro(props) {
    const auth = useContext(AuthenticateContext);
    const [t, i18n] = useTranslation(["global", 'moc','rdoc']);
    const ns = config.environment.AppProject.toLowerCase();
    const AppProject = config.environment.AppProject;
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
                    src={auth.urlBaseFull+"icon-riskpro.svg" }
                    alt=""
                    style={{ marginRight: 10 }}
                /> {t(`${AppProject}.wallets.RISKPRO.title`, { ns: ns })}
            </h3>

            <div className="CardMetricContent BProThemeMetric">
                {!loading
                    ? <>
                        <div>
                            <h5>{t(`${AppProject}.metrics.RISKPRO.usd`, { ns: ns })}</h5>
                            <span className={'space'}>
                                <LargeNumber amount={props.usdValue} currencyCode={'USDPrice'} />
                            </span>
                            <h5>{t(`${AppProject}.metrics.RISKPRO.leverage`, { ns: ns })}</h5>
                            <span className={'space'}>
                                <LargeNumber amount={props.leverage} currencyCode="RISKPRO" />
                            </span>
                        </div>
                        <div className="separator" /><div>
                            <h5>{t(`${AppProject}.metrics.RISKPRO.total`, { ns: ns })}</h5>
                            <LargeNumber amount={props.total} currencyCode="RISKPRO" />
                            <h5>{t(`${AppProject}.metrics.RISKPRO.availableRedeem`, { ns: ns })}</h5>
                            <LargeNumber amount={props.availableRedeem} currencyCode="RISKPRO" />
                            <h5>{t(`${AppProject}.metrics.RISKPRO.bproDiscountPriceUsd`, { ns: ns })}</h5>
                            <LargeNumber amount={props.bproDiscountPriceUsd} currencyCode={'USDPrice'} />
                        </div></>
                : <Skeleton />}
            </div>
        </div>
    );
}

export default RiskPro;
