import React, { useContext, useState, useEffect } from 'react';
import { CheckCircleFilled } from "@ant-design/icons";
import { AuthenticateContext } from "../../../../Context/Auth";
import { getDatasMetrics } from '../../../../Helpers/helper'
import { formatValueToContract } from '../../../../Lib/Formats';
import SystemOperations from "./operations";
import { useTranslation } from "react-i18next";
import { Skeleton, Tooltip } from 'antd';

const BigNumber = require('bignumber.js');

function SystemStatus(props) {

    const auth = useContext(AuthenticateContext);

    const getDatas = getDatasMetrics(auth)
    const [t, i18n] = useTranslation(["global", 'moc'])

    const [loading, setLoading] = useState(true);
    const timeSke= 1500

    useEffect(() => {
        setTimeout(() => setLoading(false), timeSke)
    },[auth]);


    const configStatusGreen = {
        className: 'statusGreen',
        title: t('MoC.metrics.statusGreen.title', {ns: 'moc'}),
        subtitle: t('MoC.metrics.statusGreen.subtitle', {ns: 'moc'}),
        operationsAvailable: [
            "mintSTABLE",
            "redeemSTABLEOnSettlement",
            "redeemSTABLEOutsideOfSettlement",
            "mintRISKPRO",
            "redeemRISKPRO",
            "mintRISKPROX",
            "redeemRISKPROX"
        ]
    }

    const configStatusYellow = {
        className: 'statusYellow',
        title: t('MoC.metrics.statusYellow.title', {ns: 'moc'}),
        subtitle: t('MoC.metrics.statusYellow.subtitle', {ns: 'moc'}),
        operationsAvailable: [
            "redeemSTABLEOnSettlement",
            "mintRISKPRO",
            "mintRISKPROX",
            "redeemRISKPROX"
        ]
    }

    const configStatusOrange = {
        className: 'statusOrange',
        title: t('MoC.metrics.statusOrange.title', {ns: 'moc'}),
        subtitle: t('MoC.metrics.statusOrange.subtitle', {ns: 'moc'}),
        operationsAvailable: [
            "mintRISKPRO",
            "mintRISKPROX",
            "redeemRISKPROX"
        ]
    }

    const configStatusRed = {
        className: 'statusRed',
        title: t('MoC.metrics.statusRed.title', {ns: 'moc'}),
        subtitle: t('MoC.metrics.statusRed.subtitle', {ns: 'moc'}),
        operationsAvailable: [
            "mintRISKPROX",
            "redeemRISKPROX"
        ]
    }


    const configStatusPaused = {
        className: 'statusPaused',
        operationsAvailable: []
    }

    const configStatusSettlement = {
        className: 'statusSettlement',
        operationsAvailable: []
    }

    const configStatusNoPrice = {
        className: 'statusNoPrice',
        operationsAvailable: []
    }


    const getConfigByCoverage = (coverage, paused, blocksToSettlement, price_active) => {

        if (!price_active) {
            console.log("11111111111111111111111")
            return configStatusNoPrice;
        }

        if (paused) {
            console.log("22222222222222222222")
            return configStatusPaused;
        }

        if (blocksToSettlement < 1) {
            console.log("33333333333333333")
            return configStatusSettlement;
        }

        const coverageIsGreaterOrEqualThan = (numberInEther) => new BigNumber(coverage).gte(formatValueToContract(numberInEther, "COV"));

        if (coverageIsGreaterOrEqualThan(4)) {
            console.log(coverageIsGreaterOrEqualThan(4))
            return configStatusGreen;
        } else if (coverageIsGreaterOrEqualThan(2)) {
            return configStatusYellow;
        } else if (coverageIsGreaterOrEqualThan(1.5)) {
            return configStatusOrange;
        } else {
            return configStatusRed;
        }
    }


    const customTitle = (title) => {
        if (title !== undefined) {
            return title.replace(' ', '<br/>')
        }
    }


    const price_active = true
    const { className, operationsAvailable } = getConfigByCoverage(props.coverage, props.paused, props.blocksToSettlement, price_active);

    return (
        <div className="Card CardSystemStatus">
            <h3 className="CardTitle">System Status</h3>
            <div className="CardMetricContent" style={{ marginTop: 0, justifyItems: 'center' }}>
                {!loading
                    ? <><div>
                            <div className="CardMetricContent" style={{ alignItems: 'center', justifyItems: 'center', marginTop: 0 }}>
                                <CheckCircleFilled style={{ marginLeft: 5, fontSize: 30 }} className={className} />
                                <div className={className} style={{ fontWeight: 500, marginLeft: 10, fontSize: '19.6px' }} dangerouslySetInnerHTML={{ __html: customTitle(t("MoC.metrics.".concat(className.concat('.title')), { ns: 'moc' })) }}></div>
                            </div>
                            <h5 style={{ marginLeft: 35 }}> {t("MoC.metrics.".concat(className.concat('.subtitle')), { ns: 'moc' })} </h5>
                        </div>
                        <div>
                            <h5>{t('global.Metrics_globalCoverage', { ns: 'global' })}</h5>
                            <Tooltip placement="top" title={getDatas['globalCoverageTooltip']}>
                                <span className={className} style={{fontSize: 21 }}>
                                    {getDatas['globalCoverage']}
                                </span>
                            </Tooltip>
                        </div>
                    </> : <Skeleton active={true} />
                }
            </div>
            <h3 className="CardTitle" style={{ marginTop: 50 }}>{t('MoC.metrics.systemOperations.title', { ns: 'moc' })}</h3>
            <div className="CardMetricContent" style={{ marginTop: 10 }}>
                {!loading
                   ? <SystemOperations statusClassName={className} operationsAvailable={operationsAvailable} />
                   : <Skeleton active={true} />
                }
            </div>
        </div>
    )
}

export default SystemStatus
