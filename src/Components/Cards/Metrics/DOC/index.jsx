import React, { useContext } from 'react';
import { AuthenticateContext } from '../../../../Context/Auth';
import {getDatasMetrics} from '../../../../Helpers/helper'

function DOC() {
    const auth = useContext(AuthenticateContext);
    const { accountData } = auth;

    const getBpro = getDatasMetrics(auth)

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
                    <span className={'space green'}>{getBpro['b0DocAmount']}</span>
                    <h3>Available to redeem</h3>
                    <span className={'green'}>{getBpro['docAvailableToRedeem']}</span>
                    <h3>Available to Mint</h3>
                    <span className={'green'}>{getBpro['docAvailableToMint']}</span>
                </div>
            </div>
        </div>
    );
}

export default DOC;
