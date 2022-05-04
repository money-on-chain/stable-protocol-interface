import React, { useContext } from 'react';
import { AuthenticateContext } from '../../../../Context/Auth';

function DOC() {
    const auth = useContext(AuthenticateContext);
    const { accountData } = auth;

    return (
        <div className="Card CardSystemStatus">
            <h3 className="CardTitle" style={{ fontSize: '1.4em' }}>
                <img
                    width={45}
                    src={window.location.origin + '/Moc/icon-stable.svg'}
                    alt=""
                    style={{ marginRight: 10 }}
                /> DoC
            </h3>

            <div className="CardMetricContent">
                <div>
                    <h3>Total in the system</h3>
                    52,572.33
                    <h3>Available to redeem</h3>
                    52,572.33
                    <h3>Available to Mint</h3>
                    4,225.45
                </div>
            </div>
        </div>
    );
}

export default DOC;
