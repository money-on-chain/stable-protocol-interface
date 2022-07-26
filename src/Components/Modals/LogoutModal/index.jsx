import { Modal } from 'antd';
import { useContext, useState } from 'react';
import { Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { AuthenticateContext } from '../../../Context/Auth';
import Copy from '../../../Components/Page/Copy';
import {useTranslation} from "react-i18next";
export default function MintModal(props) {
    const auth = useContext(AuthenticateContext);
    const { accountData = {} } = auth;
    const {visible = false, handleClose = () => {}} = props;
    const [t, i18n]= useTranslation(["global",'moc'])

    return (
        <Modal
            visible={visible}
            footer={''}
            width={400}
            onCancel={handleClose}
        >
            <div style={{marginTop: 10, display: 'flex', width: '100%', paddingLeft: 20, paddingRight: 20}}>
                <div className="YourAddress" style={{flexGrow: 1}}>
                    <h3>{t('global.Header_yourAddress')}</h3>
                    <Copy textToShow={accountData.truncatedAddress} textToCopy={accountData.Owner}/>
                </div>
                <div className="StatusLogin" style={{flexGrow: 0}}>
                    <h3>{t('global.Header_status')}</h3>
                    <h3 style={{color: '#079a7a'}}>{t('global.Header_connected')}</h3>
                </div>
            </div>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyItems: 'center',
                width: '100%',
                marginTop: 10
            }}>
                <Button
                    className="ArrowButton"
                    icon={<LogoutOutlined style={{fontSize: 34}} />}
                    style={{
                        width: 70,
                        height: 70,
                        justifySelf: 'center'
                    }}
                    onClick={() => {
                        auth.disconnect();
                        handleClose();
                    }}
                />
                <h3 style={{marginTop: 15}}>{t('global.Header_logout')}</h3>
            </div>
        </Modal>
    );
}
