import React, { useContext } from 'react';
import { AuthenticateContext } from '../../../../Context/Auth';

function DOC() {
    const auth = useContext(AuthenticateContext);
    const { accountData } = auth;


    const getBpro = () => {
        if (auth.userBalanceData) {
            if (auth.contractStatusData['bproPriceInUsd'] != 0) {
                const b0DocAmount= (auth.contractStatusData['b0DocAmount'] /1000000000000000000000).toFixed(5);
                const docAvailableToRedeem= (auth.contractStatusData['docAvailableToRedeem'] /1000000000000000000000).toFixed(5);
                const docAvailableToMint= (auth.contractStatusData['docAvailableToMint'] /1000000000000000000000).toFixed(5);

                return {b0DocAmount:b0DocAmount,docAvailableToRedeem:docAvailableToRedeem,docAvailableToMint:docAvailableToMint};
            } else {
                return {b0DocAmount:0,docAvailableToRedeem:0,docAvailableToMint:0};
            }
        }else{
            return {b0DocAmount:0,docAvailableToRedeem:0,docAvailableToMint:0};
        }
    }

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
                    {getBpro()['b0DocAmount']}
                    <h3>Available to redeem</h3>
                    {getBpro()['docAvailableToRedeem']}
                    <h3>Available to Mint</h3>
                    {getBpro()['docAvailableToMint']}
                </div>
            </div>
        </div>
    );
}

export default DOC;
