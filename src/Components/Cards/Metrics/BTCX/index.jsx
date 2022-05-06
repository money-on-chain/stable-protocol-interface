import React, { useContext } from 'react';
import { AuthenticateContext } from '../../../../Context/Auth';
import {getDatasMetrics} from '../../../../Helpers/helper'

function BTCX() {
    const auth = useContext(AuthenticateContext);
    const { accountData } = auth;

    const getBtcx = getDatasMetrics(auth)

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
                    <span className={'space'}>{getBtcx['btcx_usd']}</span>
                    <h3>Total in the system</h3>
                    <span className={'red space'}>{getBtcx['interest']}</span>
                    <h3>Available to Mint</h3>
                    <span className={'red'}>{getBtcx['bprox2AvailableToMint']}</span>
                </div>
                <div className="separator" />
                <div>
                    <h3>Leverage</h3>
                    <span className={'space'}>{getBtcx['x2Leverage']}</span>
                    <h3>Spot Coverage</h3>
                    {getBtcx['x2Coverage']}
                </div>
            </div>
        </div>
    );
}

export default BTCX;
