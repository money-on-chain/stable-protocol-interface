import React, { useContext } from 'react';
import { AuthenticateContext } from '../../../../Context/Auth';

function MOC() {
    const auth = useContext(AuthenticateContext);
    const { accountData } = auth;

    return (
        <div className="Card CardSystemStatus">
            <h3 className="CardTitle" style={{ fontSize: '1.4em' }}>
                <img
                    width={45}
                    src={window.location.origin + '/Moc/icon-moc.svg'}
                    alt=""
                    style={{ marginRight: 10 }}
                /> MoC
            </h3>

            <div className="CardMetricContent">
                <div>
                    <h3>Current price</h3>
                    1.00
                </div>
            </div>
        </div>
    );
}

export default MOC;
