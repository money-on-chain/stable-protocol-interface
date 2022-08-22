import React, { useContext, useState, useEffect } from 'react';
import { AuthenticateContext } from '../../../../Context/Auth';
import { useTranslation } from "react-i18next";
import { Skeleton } from 'antd';
import { LargeNumber } from '../../../LargeNumber';

function MOC(props) {
    const auth = useContext(AuthenticateContext);
    const { accountData } = auth;

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
                    src={process.env.PUBLIC_URL + "/Moc/icon-moc.svg" }
                    alt=""
                    style={{ marginRight: 10 }}
                /> {t('MoC.metrics.Moc.title', { ns: 'moc' })}
            </h3>

            <div className="CardMetricContent MocThemeMetric">
                {!loading
                    ? <div>
                        <h5>{t('MoC.metrics.Moc.price', { ns: 'moc' })}</h5>
                        <LargeNumber amount={props.mocPrice} currencyCode="MOCMetrics" tooltip="topLeft"/>
                    </div>
                : <Skeleton active={true} />}
            </div>
        </div>
    );
}

export default MOC;
