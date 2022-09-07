import React from 'react';
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { config } from '../../../../Config/config';

function GetChecksFor(props) {

    const iconCheckColor = '#09c199';
    const iconCheckColorCloseOutlined = '#ed1c24';
    const [t, i18n] = useTranslation(["global", 'moc','rdoc']);
    const ns = config.environment.AppMode === 'MoC' ? 'moc' : 'rdoc';
    const appMode = config.environment.AppMode;

    const isAvailable = (operation) => props.operationsAvailable.find(element => element === operation);
    return (<div className="InfoColumn___">
        {props.operations.map(operation =>
            <div key={operation} className={`datas-opera ${isAvailable(operation) ? 'isAvailable' : ''}`} style={{'margin-left':0}}>
                {isAvailable(operation) ? <CheckOutlined style={{color: iconCheckColor}} /> : <CloseOutlined  style={{color: iconCheckColorCloseOutlined}}/> }
                <h3 style={{display:'inline-block'}}>{'\u00A0'}{t(`${appMode}.metrics.systemOperations.${operation}`,{ns: ns})}</h3>
            </div>
        )}
    </div>)
}
export default GetChecksFor