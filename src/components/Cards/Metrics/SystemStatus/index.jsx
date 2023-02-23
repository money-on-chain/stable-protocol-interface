import React, { useContext, useState, useEffect } from 'react';
import { CheckCircleFilled } from "@ant-design/icons";
import BigNumber from "bignumber.js";
import { Skeleton, Tooltip } from 'antd';

import { AuthenticateContext } from "../../../../context/Auth";
import { getDatasMetrics } from '../../../../helpers/helper'
import { formatValueToContract } from '../../../../helpers/Formats';
import SystemOperations from "./operations";
import {config} from '../../../../projects/config';
import { useProjectTranslation } from '../../../../helpers/translations';


function SystemStatus(props) {

    const auth = useContext(AuthenticateContext);

    const getDatas = getDatasMetrics(auth)
    const [t, i18n, ns]= useProjectTranslation();
    const AppProject = config.environment.AppProject;

    const [loading, setLoading] = useState(true);
    const timeSke= 1500

    useEffect(() => {
        setTimeout(() => setLoading(false), timeSke)
    },[auth]);


    const configStatusGreen = {
        className: 'statusGreen',
        title: t(`${AppProject}.metrics.statusGreen.title`, {ns: ns}),
        subtitle: t(`${AppProject}.metrics.statusGreen.subtitle`, {ns: ns}),
        operationsAvailable: [
            "mintSTABLE",
            "redeemSTABLEOnSettlement",
            "redeemSTABLEOutsideOfSettlement",
            "mintRISKPRO",
            "redeemRISKPRO",
            "redeemRISKPROX"
        ]
    }

    const configStatusYellow = {
        className: 'statusYellow',
        title: t(`${AppProject}.metrics.statusYellow.title`, {ns: ns}),
        subtitle: t(`${AppProject}.metrics.statusYellow.subtitle`, {ns: ns}),
        operationsAvailable: [
            "redeemSTABLEOnSettlement",
            "redeemSTABLEOutsideOfSettlement",
            "mintRISKPRO",
            "redeemRISKPROX"
        ]
    }

    const configStatusOrange = {
        className: 'statusOrange',
        title: t(`${AppProject}.metrics.statusOrange.title`, {ns: ns}),
        subtitle: t(`${AppProject}.metrics.statusOrange.subtitle`, {ns: ns}),
        operationsAvailable: [
            "mintRISKPRO",
            "redeemRISKPROX"
        ]
    }

    const configStatusRed = {
        className: 'statusRed',
        title: t(`${AppProject}.metrics.statusRed.title`, {ns: ns}),
        subtitle: t(`${AppProject}.metrics.statusRed.subtitle`, {ns: ns}),
        operationsAvailable: [
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


    const getConfigByCoverage = (coverage, adjustedTargetCoverage, paused, blocksToSettlement, price_active) => {

        if (!price_active) {
            return configStatusNoPrice;
        }

        if (paused) {
            return configStatusPaused;
        }

        if (blocksToSettlement < 1) {
            return configStatusSettlement;
        }

        if (new BigNumber(coverage).gte(new BigNumber(adjustedTargetCoverage))) {
            return configStatusGreen;
        } else if (new BigNumber(coverage).gte(formatValueToContract(config.globalCoverage.warning, "COV"))) {
            return configStatusYellow;
        } else if (new BigNumber(coverage).gte(formatValueToContract(config.globalCoverage.dangerous, "COV"))) {
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
    const { className, operationsAvailable } = getConfigByCoverage(props.coverage, props.adjustedTargetCoverage, props.paused, props.blocksToSettlement, price_active);

    return (
        <div className="Card CardSystemStatus">
            <h3 className="CardTitle">System Status</h3>
            <div className="CardMetricContent" style={{ marginTop: 0, justifyItems: 'center' }}>
                {!loading
                    ? <><div>
                            <div className="CardMetricContent" style={{ alignItems: 'center', justifyItems: 'center', marginTop: 0 }}>
                                <CheckCircleFilled style={{ marginLeft: 5, fontSize: 30 }} className={className} />
                                <div className={className} style={{ fontWeight: 500, marginLeft: 10, fontSize: '19.6px' }} dangerouslySetInnerHTML={{ __html: customTitle(t(`${AppProject}.metrics.`.concat(className.concat('.title')), { ns: ns })) }}></div>
                            </div>
                            <h5 style={{ marginLeft: 35 }}> {t(`${AppProject}.metrics.`.concat(className.concat('.subtitle')), { ns: ns })} </h5>
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
            <h3 className="CardTitle" style={{ marginTop: 50 }}>{t(`${AppProject}.metrics.systemOperations.title`, { ns: ns })}</h3>
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
