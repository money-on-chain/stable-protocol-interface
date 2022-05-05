import React, { useContext } from 'react';
import { AuthenticateContext } from '../../../../Context/Auth';
import {getDatasMetrics} from '../../../../Helpers/helper'

function BPRO() {
    const auth = useContext(AuthenticateContext);
    const { accountData } = auth;

    const getBpro= getDatasMetrics(auth)

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
                    <span className={'space'}>{getBpro['bpro_usd']}</span>
                    <h3>Current Leverage</h3>
                    {getBpro['b0Leverage']}
                </div>
                <div className="separator" />
                <div>
                    <h3>Total in the system</h3>
                    {getBpro['b0BproAmount']}
                    <h3>Available to redeem</h3>
                    {getBpro['bproAvailableToRedeem']}
                    <h3>Discount price</h3>
                    {getBpro['bpro_usd']}
                </div>
            </div>
        </div>
    );
}

export default BPRO;
