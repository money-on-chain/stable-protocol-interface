import React, { useContext, useState, useEffect } from 'react';
import { AuthenticateContext } from '../../../../Context/Auth';
import { getDatasMetrics } from '../../../../Helpers/helper';
import { useTranslation } from "react-i18next";
import { Skeleton, Tooltip } from 'antd';
import { LargeNumber } from '../../../LargeNumber';

function Stable(props) {
    const auth = useContext(AuthenticateContext);
    const { accountData } = auth;

    const getBpro = getDatasMetrics(auth);
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
                    src={'Moc/icon-stable.svg'}
                    alt=""
                    style={{ marginRight: 10 }}
                /> {t('MoC.wallets.STABLE.title', { ns: 'moc' })}
            </h3>

            <div className="CardMetricContent StableThemeMetric">
                {!loading
                    ? <div>
                        <h5>{t('MoC.metrics.STABLE.total', { ns: 'moc' })}</h5>
                        <span className={'space green'}><LargeNumber amount={props.total} currencyCode="STABLE" /></span>
                        {/* <Tooltip placement='top' title={getBpro['b0DocAmountTooltip']}>
                            <span className={'space green'}>{getBpro['b0DocAmount']}</span>
                        </Tooltip>*/}
                        <h5>{t('MoC.metrics.STABLE.availableRedeem', { ns: 'moc' })}</h5>
                        <span className={'green'}><LargeNumber amount={props.availableRedeem} currencyCode="STABLE" /></span>
                        {/* <Tooltip placement='top' title={getBpro['docAvailableToRedeemTooltip']}>
                            <span className={'green'}>{getBpro['docAvailableToRedeem']}</span>
                        </Tooltip>*/}
                        <h5>{t('MoC.metrics.STABLE.availableMint', { ns: 'moc' })}</h5>
                        <span className={'green'}><LargeNumber amount={props.availableMint} currencyCode="STABLE" /></span>
                        {/* <Tooltip placement='top' title={getBpro['docAvailableToMintTooltip']}>
                            <span className={'green'}>{getBpro['docAvailableToMint']}</span>
                        </Tooltip> */}
                    </div>
                : <Skeleton active={true} />}
            </div>
        </div>
    );
}

export default Stable;