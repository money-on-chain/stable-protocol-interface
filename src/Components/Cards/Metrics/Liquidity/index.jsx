import React, { useContext } from 'react';
import { AuthenticateContext } from '../../../../Context/Auth';

function Liquidity() {
    const auth = useContext(AuthenticateContext);
    const { accountData } = auth;

    return (
        <div className="Card CardSystemStatus">
            <h3 className="CardTitle" style={{ fontSize: '1.4em' }}>
                Liquidity BPro | Liquidity BTCx
            </h3>

            <div className="CardMetricContent">
                <div>
                    <h3>Total rBTC</h3>
                    5.774093
                    <h3>Total DoC</h3>
                    52,572.33
                    <h3>Total BPro</h3>
                    7.949298
                </div>
                <div className="separator" />
                <div>
                    <h3>Total rBTC</h3>
                    0.000000
                    <h3>Total DoC</h3>
                    0.00
                    <h3>Total BTCx</h3>
                    0.000000
                </div>
            </div>
        </div>
    );
}

export default Liquidity;
