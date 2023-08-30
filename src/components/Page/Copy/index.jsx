import { notification } from 'antd';
import { config } from '../../../projects/config';
import React from 'react';

import IconCopy from './../../../assets/icons/copy2.png';

export default function Copy(props) {
    const {
        textToShow = '',
        textToCopy = '',
        fastBTC = false,
        typeUrl = ''
    } = props;

    const onClick = () => {
        navigator.clipboard.writeText(textToCopy);
        notification.open({
            message: 'Copied',
            description: `${textToCopy} to clipboard`,
            placement: 'bottomRight'
        });
    };

    let url_set = config.environment.explorerUrl + '/address/' + textToCopy;
    switch (typeUrl) {
        case 'tx':
            url_set = config.environment.explorerUrl + '/tx/' + textToCopy;
            break;
        default:
            break;
    }

    return (
        <>
            <div>
                {textToCopy && (
                    <img
                        onClick={onClick}
                        width={17}
                        height={17}
                        src={IconCopy}
                        alt=""
                        style={{
                            marginRight: 10,
                            cursor: 'pointer',
                            flexGrow: '0',
                            marginTop: '3px'
                        }}
                    />
                )}
                <span style={{ display: fastBTC && 'flex', fontSize: '12px' }}>
                    <a
                        style={{
                            color: '#09c199',
                            flexGrow: '1',
                            fontweight: 'bold'
                        }}
                        href={url_set}
                        target="_blank"
                    >
                        {textToShow}
                    </a>
                </span>
            </div>
        </>
    );
}
