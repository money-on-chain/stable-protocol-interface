import React, { useContext, useState, useEffect } from 'react';
import { AuthenticateContext } from '../../../../Context/Auth';
import { useTranslation } from "react-i18next";
import { Skeleton, Tooltip } from 'antd';
import { LargeNumber } from '../../../LargeNumber';
import {config} from '../../../../Config/config';
import { ReactComponent as LogoIcon } from '../../../../assets/icons/icon-tp.svg';
/*
import web3 from "web3";
import {setNumber, setToLocaleString} from "../../../../Helpers/helper";
import BigNumber from "bignumber.js";*/

function TP(props) {
    const auth = useContext(AuthenticateContext);
    const [t, i18n] = useTranslation(["global", 'moc', 'rdoc']);
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
                <LogoIcon
                    width={45}
                    alt=""
                    style={{ marginRight: 10 }}
                /> {t(`${AppProject}.wallets.TP.title`, { ns: ns })}
            </h3>

            <div className="CardMetricContent StableThemeMetric">
                {!loading
                    ? <div>
                        <h5>{t(`${AppProject}.metrics.TP.total`, { ns: ns })}</h5>
                        <span className={'space green'}><LargeNumber amount={props.total} currencyCode="TP" /></span>
                        <h5>{t(`${AppProject}.metrics.TP.availableRedeem`, { ns: ns })}</h5>
                        <span className={'green'}><LargeNumber amount={props.availableRedeem} currencyCode="TP" /></span>
                        <h5>{t(`${AppProject}.metrics.TP.availableMint`, { ns: ns })}</h5>
                        <span className={'green'}><LargeNumber amount={props.availableMint} currencyCode="TP" /></span>
                    </div>
                : <Skeleton active={true} />}
            </div>
        </div>
    );
}

export default TP;
