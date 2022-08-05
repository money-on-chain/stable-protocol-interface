import { notification } from 'antd';
import {config} from "../../../Config/config";
import React from "react";

export default function Copy(props) {

    const {textToShow = '', textToCopy = '', fastBTC = false, typeUrl=''} = props;

    const onClick = () => {
        navigator.clipboard.writeText(textToCopy);
        notification.open({
            message: 'Copied',
            description: `${textToCopy} to clipboard`,
            placement: 'bottomRight'
        });
    };

    let url_set=config.explorerUrl+'/address/'+textToCopy
    switch (typeUrl){
        case "tx":
            url_set=config.explorerUrl+'/tx/'+textToCopy
            break;
    }

    return (
        <><div style={{display:"flex"}}>
            <img onClick={onClick}
                 width={17}
                 height={17}
                 src={process.env.PUBLIC_URL + '/Moc/copy2.png'}
                 alt=""
                 style={{marginRight: 10, cursor: 'pointer','flexGrow':'0','marginTop':'3px'}}
            />
            <span style={{ display: fastBTC && 'flex','fontSize':'12px'}}>
            <a  className={'copy-txt'} style={{ 'flexGrow':'1'}} href={url_set} target="_blank">
                {textToShow}
            </a>
        </span>
        </div></>
    );
}
