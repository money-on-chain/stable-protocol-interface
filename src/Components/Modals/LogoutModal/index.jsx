import { Modal } from 'antd';
import { useContext, useState } from 'react';
import { Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { AuthenticateContext } from '../../../Context/Auth';
export default function MintModal(props) {
    const auth = useContext(AuthenticateContext);
    const { accountData = {} } = auth;
    const {visible = false, handleClose = () => {}} = props;

    return (
        <Modal
            visible={visible}
            footer={''}
            width={400}
            onCancel={handleClose}
        >
            <div style={{marginTop: 30, display: 'flex', width: '100%', paddingLeft: 20, paddingRight: 20}}>
                <div className="YourAddress" style={{flexGrow: 1}}>
                    <h3>Your Address</h3>
                    <h4>{accountData.truncatedAddress}</h4>
                </div>
                <div className="StatusLogin" style={{flexGrow: 0}}>
                    <h3>Status</h3>
                    <h3 style={{color: '#079a7a'}}>Connected</h3>
                </div>
            </div>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyItems: 'center',
                width: '100%',
                marginTop: 20
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
                <h3 style={{marginTop: 20}}>Disconnect</h3>
            </div>
        </Modal>
    );
}
