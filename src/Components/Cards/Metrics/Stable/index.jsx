import React, { useContext, useState, useEffect } from 'react';
import { AuthenticateContext } from '../../../../Context/Auth';
import { useTranslation } from "react-i18next";
import { Skeleton, Tooltip } from 'antd';
import { LargeNumber } from '../../../LargeNumber';
import {config} from '../../../../Config/config';

function Stable(props) {
    const auth = useContext(AuthenticateContext);
    const [t, i18n] = useTranslation(["global", 'moc', 'rdoc']);
    const ns = config.environment.AppProject === 'MoC' ? 'moc' : 'rdoc';
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
                    src={auth.urlBaseFull +"icon-stable.svg"}
                    alt=""
                    style={{ marginRight: 10 }}
                /> {t(`${AppProject}.wallets.STABLE.title`, { ns: ns })}
            </h3>

            <div className="CardMetricContent StableThemeMetric">
                {!loading
                    ? <div>
                        <h5>{t(`${AppProject}.metrics.STABLE.total`, { ns: ns })}</h5>
                        <span className={'space green'}><LargeNumber amount={props.total} currencyCode="STABLE" /></span>
                        <h5>{t(`${AppProject}.metrics.STABLE.availableRedeem`, { ns: ns })}</h5>
                        <span className={'green'}><LargeNumber amount={props.availableRedeem} currencyCode="STABLE" /></span>
                        <h5>{t(`${AppProject}.metrics.STABLE.availableMint`, { ns: ns })}</h5>
                        <span className={'green'}><LargeNumber amount={props.availableMint} currencyCode="STABLE" /></span>
                    </div>
                : <Skeleton active={true} />}
            </div>
        </div>
    );
}

export default Stable;
