import React from 'react';
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

function GetChecksFor(props) {

    const iconCheckColor = '#09c199';
    const iconCheckColorCloseOutlined = '#ed1c24';
    const [t, i18n] = useTranslation(["global", 'moc'])

    const isAvailable = (operation) => props.operationsAvailable.find(element => element === operation);
    return (<div className="InfoColumn___">
        {props.operations.map(operation =>
            <div key={operation} className={`datas-opera ${isAvailable(operation) ? 'isAvailable' : ''}`} style={{'margin-left':0}}>
                {isAvailable(operation) ? <CheckOutlined style={{color: iconCheckColor}} /> : <CloseOutlined  style={{color: iconCheckColorCloseOutlined}}/> }
                <h3 style={{display:'inline-block'}}>{'\u00A0'}{t(`MoC.metrics.systemOperations.${operation}`,{ns: 'moc'})}</h3>
            </div>
        )}
    </div>)
}
export default GetChecksFor