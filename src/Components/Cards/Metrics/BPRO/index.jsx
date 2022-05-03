import React, { useContext } from 'react';
import { AuthenticateContext } from '../../../../Context/Auth';

function BPRO() {
    const auth = useContext(AuthenticateContext);
    const { accountData } = auth;

    return (
        <div className="Card CardSystemStatus">
            <h3 className="CardTitle" style={{ fontSize: '1.4em' }}>
                <img
                    width={45}
                    src={window.location.origin + '/Moc/icon-riskpro.svg'}
                    alt=""
                    style={{ marginRight: 10 }}
                /> BPro
            </h3>

            <div className="CardMetricContent">
                <div>
                    <h3>BPro USD</h3>
                    21,435.02
                    <h3>Current Leverage</h3>
                    1.308535
                </div>
                <div className="separator" />
                <div>
                    <h3>Total in the system</h3>
                    7.949298
                    <h3>Available to redeem</h3>
                    0.591385
                    <h3>Discount price</h3>
                    21,435.02
                </div>
            </div>
        </div>
    );
}

export default BPRO;
