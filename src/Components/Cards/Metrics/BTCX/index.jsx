import React, { useContext } from 'react';
import { AuthenticateContext } from '../../../../Context/Auth';

function BTCX() {
    const auth = useContext(AuthenticateContext);
    const { accountData } = auth;


    const getBtcx = () => {
        if (auth.userBalanceData) {
            if (auth.contractStatusData) {
                // return (auth.contractStatusData['bitcoinPrice'] / 1000).toFixed(4);
                const btcx_usd= (auth.contractStatusData['bitcoinPrice'] / 1000).toFixed(4);
                const btcx_interest= auth.userBalanceData['bprox2Balance'];
                const btcx_x2Leverage= (auth.contractStatusData['x2Leverage']/1000000000000000000).toFixed(6);
                const btcx_x2Coverage= (auth.contractStatusData['x2Coverage']/1000000000000000000).toFixed(6);
                const btcx_AvailableToMint= (auth.contractStatusData['bprox2AvailableToMint']/1000000000000000000).toFixed(6);
                return {usd:btcx_usd,interest:btcx_interest,x2Leverage:btcx_x2Leverage,x2Coverage:btcx_x2Coverage,bprox2AvailableToMint:btcx_AvailableToMint};
            } else {
                return {usd:0,interest:0,x2Leverage:0,x2Coverage:0,bprox2AvailableToMint:0};
            }
        }else{
            return {usd:0,interest:0,x2Leverage:0,x2Coverage:0,bprox2AvailableToMint:0};
        }
    }

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
                    {getBtcx()['usd']}
                    <h3>Total in the system</h3>
                    {getBtcx()['interest']}
                    <h3>Available to Mint</h3>
                    {getBtcx()['bprox2AvailableToMint']}
                </div>
                <div className="separator" />
                <div>
                    <h3>Leverage</h3>
                    {getBtcx()['x2Leverage']}
                    <h3>Spot Coverage</h3>
                    {getBtcx()['x2Coverage']}
                </div>
            </div>
        </div>
    );
}

export default BTCX;
