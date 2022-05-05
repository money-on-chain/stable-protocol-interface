import React, { useContext } from 'react';
import { AuthenticateContext } from '../../../../Context/Auth';

function BPRO() {
    const auth = useContext(AuthenticateContext);
    const { accountData } = auth;


    const getBpro = () => {
        if (auth.userBalanceData) {
            console.log("auth.contractStatusData_______________________________")
            console.log(auth.contractStatusData)
            console.log("auth.contractStatusData_______________________________")
            if (auth.contractStatusData['bproPriceInUsd'] != 0) {
                // return (auth.contractStatusData['bproPriceInUsd'] / 1000).toFixed(4);
                const bpro_usd= (auth.contractStatusData['bproPriceInUsd'] / 1000).toFixed(4);
                const b0Leverage= (auth.contractStatusData['b0Leverage'] /1000000000000000000).toFixed(6);
                const b0BproAmount= (auth.contractStatusData['b0BproAmount'] /1000000000000000000).toFixed(6);
                const bproAvailableToRedeem= (auth.contractStatusData['bproAvailableToRedeem'] /1000000000000000000).toFixed(6);
                return {usd:bpro_usd,b0Leverage:b0Leverage,b0BproAmount:b0BproAmount,bproAvailableToRedeem:bproAvailableToRedeem};
            } else {
                return {usd:0,b0Leverage:0,b0BproAmount:0,bproAvailableToRedeem:0};
            }
        }else{
            return {usd:0,b0Leverage:0,b0BproAmount:0,bproAvailableToRedeem:0};
        }
    }

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
                    {getBpro()['usd']}
                    <h3>Current Leverage</h3>
                    {getBpro()['b0Leverage']}
                </div>
                <div className="separator" />
                <div>
                    <h3>Total in the system</h3>
                    {getBpro()['b0BproAmount']}
                    <h3>Available to redeem</h3>
                    {getBpro()['bproAvailableToRedeem']}
                    <h3>Discount price</h3>
                    {getBpro()['usd']}
                </div>
            </div>
        </div>
    );
}

export default BPRO;
