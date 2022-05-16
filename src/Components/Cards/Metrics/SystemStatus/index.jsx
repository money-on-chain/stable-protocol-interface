import React, {useContext} from 'react';
// import {CheckOutlined, CheckCircleFilled} from '@ant-design/icons';
import { CheckCircleFilled, CheckOutlined, CloseOutlined, CloseCircleFilled } from "@ant-design/icons";
import {AuthenticateContext} from "../../../../Context/Auth";
import {getDatasMetrics} from '../../../../Helpers/helper'
import { formatValueToContract } from '../../../../Lib/Formats';
import SystemOperations from "./operations";

const BigNumber = require('bignumber.js');
const iconCheckColor = '#09c199';
const iconCheckColorCloseOutlined = '#ed1c24';

function SystemStatus() {

    const auth = useContext(AuthenticateContext);

    const getDatas= getDatasMetrics(auth)


    // coverage === getDatas['globalCoverageClean']
    // paused === getDatas['paused']
    // blocksToSettlement === getDatas['blocksToSettlement']

    // const {className, operationsAvailable} = getConfigByCoverage(coverage, paused, blocksToSettlement, price_active);

    const configStatusGreen = {
        className: '#00a651',
        title: 'Fully Operational',
        subtitle:"The system is in optimum status",
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
        className: '#E9BF4A',
        title: 'Partially Operational',
        subtitle:"BPro cannot be redeemed. DoC cannot be minted",
        operationsAvailable: [
            "redeemSTABLEOnSettlement",
            "mintRISKPRO",
            "mintRISKPROX",
            "redeemRISKPROX"
        ]
    }

    const configStatusOrange = {
        className: '#ef8a13',
        title: 'Opportunity Mode',
        subtitle: "BPro at a discount price!",
        operationsAvailable: [
            "mintRISKPRO",
            "mintRISKPROX",
            "redeemRISKPROX"
        ]
    }

    const configStatusRed = {
        className: '#ed1c24',
        title: "Protected Mode",
        subtitle: "No operations allowed",
        operationsAvailable: [
            "mintRISKPROX",
            "redeemRISKPROX"
        ]
    }


    const configStatusPaused = {
        className: '#ed1c24',
        operationsAvailable: []
    }

    const configStatusSettlement = {
        className: '#ed1c24',
        operationsAvailable: []
    }

    const configStatusNoPrice = {
        className: '#ed1c24',
        operationsAvailable: []
    }


    const getConfigByCoverage = ( coverage, paused, blocksToSettlement, price_active ) => {

        if (!price_active) {console.log("11111111111111111111111")
            return configStatusNoPrice;}

        if (paused) {console.log("22222222222222222222")
            return configStatusPaused;}

        if (blocksToSettlement<1) {console.log("33333333333333333")
            console.log(blocksToSettlement)
            console.log("33333333333333333")
            return configStatusSettlement;}

        const coverageIsGreaterOrEqualThan = (numberInEther) => new BigNumber(coverage).gte(formatValueToContract(numberInEther, "COV"));

        if (coverageIsGreaterOrEqualThan(4)) {
            console.log("444444444444444")
            console.log(coverageIsGreaterOrEqualThan(4))
            console.log("444444444444444")
            return configStatusGreen;
        } else if (coverageIsGreaterOrEqualThan(2)) {console.log("555555555555555555")
            return configStatusYellow;
        } else if (coverageIsGreaterOrEqualThan(1.5)) {console.log("66666666666666666666")
            return configStatusOrange;
        } else {console.log("777777777777777777777")
            return configStatusRed;
        }
    }


    const customTitle= (title) => {
        if ( title!==undefined ){
            return title.replace(' ', '<br/>')
        }
    }


    const price_active= true
    const {className, operationsAvailable,title,subtitle} = getConfigByCoverage(getDatas['globalCoverageClean'], getDatas['paused'], getDatas['blocksToSettlement'], price_active);
    console.log('className***************************************');
    console.log(className);
    console.log(getDatas['globalCoverageClean']);
    console.log(getDatas['paused']);
    console.log(getDatas['blocksToSettlement']);
    console.log("stateStatus");
    // console.log(stateStatus);
    // console.log(!!stateStatus);
    console.log("stateStatus");
    console.log(price_active);
    console.log(operationsAvailable);
    console.log(title);
    console.log('className***************************************');

    return (
        <div className="Card CardSystemStatus">
            <h3 className="CardTitle">System Status</h3>
            <div className="CardMetricContent" style={{marginTop: 0, justifyItems: 'center'}}>
                <div>
                    <div className="CardMetricContent" style={{alignItems: 'center', justifyItems: 'center', marginTop: 0}}>
                        <CheckCircleFilled style={{marginLeft: 5, fontSize: 30, color: className}} />
                        {/*<div style={{color: className, fontWeight: 500, marginLeft: 10}}>Fully <br/> Operational</div>*/}
                        <div style={{color: className, fontWeight: 500, marginLeft: 10}} dangerouslySetInnerHTML={{ __html: customTitle(title) }}></div>
                    </div>
                    <h5 style={{marginLeft: 35}}>{subtitle}</h5>
                </div>
                <div>
                    <h3>Global Coverage</h3>
                    <span style={{color: className}}>{getDatas['globalCoverage']} </span>
                </div>
            </div>
            <h3 className="CardTitle" style={{marginTop: 50}}>System Operations</h3>
            {/*<div className="CardMetricContent" style={{marginTop: 10}}>*/}
            {/*    <div>*/}
            {/*        <h3><CheckOutlined style={{color: iconCheckColor}} /> Mint DoC</h3>*/}
            {/*        <h3><CheckOutlined style={{color: iconCheckColor}} /> Redeem DoC</h3>*/}
            {/*    </div>*/}
            {/*    <div className="separator" style={{height: 100}} />*/}
            {/*    <div>*/}
            {/*        <h3><CheckOutlined style={{color: iconCheckColor}} /> Mint BPro</h3>*/}
            {/*        <h3><CheckOutlined style={{color: iconCheckColor}} /> Redeem BPro</h3>*/}
            {/*        <h3><CheckOutlined style={{color: iconCheckColor}} /> Mint BTCx</h3>*/}
            {/*        <h3><CheckOutlined style={{color: iconCheckColor}} /> Redeem BTCx</h3>*/}
            {/*    </div>*/}
            {/*</div>*/}
            <div className="CardMetricContent" style={{marginTop: 10}}>
                <SystemOperations statusClassName={className} operationsAvailable={operationsAvailable} />
            </div>
        </div>
    )
}

export default SystemStatus
