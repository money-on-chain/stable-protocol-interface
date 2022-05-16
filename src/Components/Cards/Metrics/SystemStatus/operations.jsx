import React from 'react';
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

const BigNumber = require('bignumber.js');
const iconCheckColor = '#09c199';
const iconCheckColorCloseOutlined = '#ed1c24';
    /////////////////////////////////////////////para checks//////////////////////////////////////////////

    const metrics_values= {
        "title":"System Operations",
        "mintSTABLE":"Mint DoC",
        "redeemSTABLEOnSettlement":"Redeem DoC on Settlement",
        "redeemSTABLEOutsideOfSettlement":"Redeem DoC",
        "mintRISKPRO":"Mint BPro",
        "redeemRISKPRO":"Redeem BPro",
        "mintRISKPROX":"Mint BTCx",
        "redeemRISKPROX":"Redeem BTCx"
    }

    const getChecksFor = (operations, operationsAvailable) => {
        const isAvailable = (operation) => operationsAvailable.find(element => element === operation);

        return <div className="InfoColumn___">
            {operations.map(operation =>
                <div key={operation} className={`datas-opera ${isAvailable(operation) ? 'isAvailable' : ''}`} style={{'margin-left':0}}>
                    {isAvailable(operation) ? <CheckOutlined style={{color: iconCheckColor}} /> : <CloseOutlined  style={{color: iconCheckColorCloseOutlined}}/> }
                    <h3 style={{display:'inline-block'}}>{'\u00A0'}{''+metrics_values[operation]}</h3>
                </div>
            )}
        </div>
    }



function SystemOperations(props) {


    return (
        <div style={{'margin': 0}}>
            <div className="InfoColumnsContainer__ CardMetricContent" style={{'margin': 0}}>
                {getChecksFor([
                        "mintSTABLE",
                        "redeemSTABLEOutsideOfSettlement"
                    ],
                    props.operationsAvailable
                )}
                <div className="separator" style={{height: 100}}/>
                {getChecksFor([
                        "mintRISKPRO",
                        "redeemRISKPRO",
                        "mintRISKPROX",
                        "redeemRISKPROX"
                    ],
                    props.operationsAvailable
                )}
            </div>
        </div>
    )
    /*
const SystemOperations = ({ operationsAvailable }) => (

    <div style={{'margin':0}} >
        <div className="InfoColumnsContainer__ CardMetricContent" style={{'margin':0}}>
            {getChecksFor([
                    "mintSTABLE",
                    "redeemSTABLEOutsideOfSettlement"
                ],
                operationsAvailable
            )}
            <div className="separator" style={{height: 100}} />
            {getChecksFor([
                    "mintRISKPRO",
                    "redeemRISKPRO",
                    "mintRISKPROX",
                    "redeemRISKPROX"
                ],
                operationsAvailable
            )}
        </div>
    </div>
);*/
}
export default SystemOperations
