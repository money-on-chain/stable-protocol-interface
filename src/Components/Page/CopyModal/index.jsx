import { notification } from 'antd';
import React from "react";
import { config } from '../../../Config/config';

export default function CopyModal(props) {

    const {textToShow = '', textToCopy = '', fastBTC = false} = props;

    const onClick = () => {
        navigator.clipboard.writeText(textToCopy);
        notification.open({
            message: 'Copied',
            description: `${textToCopy} to clipboard`,
            placement: 'bottomRight'
        });
    };

    return (
        <><span style={{ display: fastBTC && 'flex','fontSize':'12px',color:'#09C199'}}>
            <a className="" href={`${config.explorerUrl}/address/${textToCopy}`} target="_blank">
                {textToShow}
            </a>
        </span>
        &nbsp;&nbsp;&nbsp;<img onClick={onClick}
                               width={15}
                               height={17}
                               src={'copy-verde.png'}
                               alt=""
                               style={{marginRight: 10, cursor: 'pointer',marginTop: -10}}
    /></>
    );
}
