import React, { useContext } from 'react';
import { AuthenticateContext } from '../../../../Context/Auth';

function BTCX() {
    const auth = useContext(AuthenticateContext);
    const { accountData } = auth;

    return (
        <div className="Card CardSystemStatus">
            <h3 className="CardTitle" style={{ fontSize: '1.4em' }}>
                <img
                    width={45}
                    src={window.location.origin + '/Moc/icon-riskprox.svg'}
                    alt=""
                    style={{ marginRight: 10 }}
                /> BTCx
            </h3>

            <div className="CardMetricContent">
                <div>
                    <h3>BTCx USD</h3>
                    38,703.65
                    <h3>Total in the system</h3>
                    0.000000
                    <h3>Available to Mint</h3>
                    1.358330
                </div>
                <div className="separator" />
                <div>
                    <h3>Leverage</h3>
                    2.000000
                    <h3>Spot Coverage</h3>
                    2.000000
                </div>
            </div>
        </div>
    );
}

export default BTCX;
