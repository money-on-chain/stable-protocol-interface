import React, { useContext, useState, useEffect } from 'react';
import { Skeleton } from 'antd';
import { AuthenticateContext } from '../../../../context/Auth';
import { LargeNumber } from '../../../LargeNumber';
import { config } from '../../../../projects/config';
import { useProjectTranslation } from '../../../../helpers/translations';

function Liquidity(props) {
    const auth = useContext(AuthenticateContext);
    const [t, i18n, ns] = useProjectTranslation();
    const AppProject = config.environment.AppProject;
    const [loading, setLoading] = useState(true);
    const timeSke = 1500;

    useEffect(() => {
        setTimeout(() => setLoading(false), timeSke);
    }, [auth]);

    return (
        <div className="Card CardSystemStatus">
            <h3
                className="CardTitle"
                style={{
                    fontSize: '1.4em',
                    display: 'inline-flex',
                    'align-items': 'center'
                }}
            >
                {t(`${AppProject}.metrics.bucketsInTokens.title`, { ns: ns })}{' '}
                {t(`${AppProject}.Tokens_TC_name`, { ns: ns })} |{' '}
                {t(`${AppProject}.metrics.bucketsInTokens.title`, { ns: ns })}{' '}
                {t(`${AppProject}.Tokens_TX_name`, { ns: ns })}
            </h3>

            <div className="CardMetricContent BProThemeMetric">
                {!loading ? (
                    <>
                        <div>
                            <h5>
                                {t(
                                    `${AppProject}.metrics.bucketsInTokens.total`,
                                    { ns: ns }
                                )}{' '}
                                {t(`${AppProject}.Tokens_RESERVE_name`, {
                                    ns: ns
                                })}
                            </h5>
                            <LargeNumber
                                amount={props.b0BTCAmount}
                                currencyCode={'RESERVE'}
                            />
                            <h5>
                                {t(
                                    `${AppProject}.metrics.bucketsInTokens.total`,
                                    { ns: ns }
                                )}{' '}
                                {t(`${AppProject}.Tokens_TP_name`, { ns: ns })}
                            </h5>
                            <LargeNumber
                                amount={props.b0DocAmount}
                                currencyCode={'TP'}
                            />
                            <h5>
                                {t(
                                    `${AppProject}.metrics.bucketsInTokens.total`,
                                    { ns: ns }
                                )}{' '}
                                {t(`${AppProject}.Tokens_TC_name`, { ns: ns })}
                            </h5>
                            <LargeNumber
                                amount={props.b0BproAmount}
                                currencyCode={'TC'}
                            />
                        </div>
                        <div className="separator" />
                        <div>
                            <h5>
                                {t(
                                    `${AppProject}.metrics.bucketsInTokens.total`,
                                    { ns: ns }
                                )}{' '}
                                {t(`${AppProject}.Tokens_RESERVE_name`, {
                                    ns: ns
                                })}
                            </h5>
                            <LargeNumber
                                amount={props.x2BTCAmount}
                                currencyCode={'RESERVE'}
                            />
                            <h5>
                                {t(
                                    `${AppProject}.metrics.bucketsInTokens.total`,
                                    { ns: ns }
                                )}{' '}
                                {t(`${AppProject}.Tokens_TP_name`, { ns: ns })}
                            </h5>
                            <LargeNumber
                                amount={props.x2DocAmount}
                                currencyCode={'TP'}
                            />
                            <h5>
                                {t(
                                    `${AppProject}.metrics.bucketsInTokens.total`,
                                    { ns: ns }
                                )}{' '}
                                {t(`${AppProject}.Tokens_TX_name`, { ns: ns })}
                            </h5>
                            <LargeNumber
                                amount={props.x2BproAmount}
                                currencyCode={'TX'}
                            />
                        </div>
                    </>
                ) : (
                    <Skeleton active={true} />
                )}
            </div>
        </div>
    );
}

export default Liquidity;
