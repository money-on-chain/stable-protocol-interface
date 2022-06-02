import React from 'react';
import GetChecksFor from "./getChecksFor";

function SystemOperations(props) {
    return (
        <div style={{'margin': 0}}>
            <div className="InfoColumnsContainer__ CardMetricContent" style={{'margin': 0}}>
                <GetChecksFor operations={["mintSTABLE","redeemSTABLEOutsideOfSettlement"]} operationsAvailable={props.operationsAvailable}></GetChecksFor>
                <div className="separator" style={{height: 100}}/>
                <GetChecksFor operations={["mintRISKPRO",
                    "redeemRISKPRO",
                    "mintRISKPROX",
                    "redeemRISKPROX"]} operationsAvailable={props.operationsAvailable}></GetChecksFor>
            </div>
        </div>
    )
}
export default SystemOperations