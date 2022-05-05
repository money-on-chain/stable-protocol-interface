import React, { useContext } from 'react';
import { AuthenticateContext } from '../../../../Context/Auth';

function Liquidity() {
    const auth = useContext(AuthenticateContext);
    const { accountData } = auth;

    const getDatas = () => {
        if (auth.userBalanceData) {
            if (auth.userBalanceData) {
                const totalBTCAmount= (auth.contractStatusData['totalBTCAmount'] /1000000000000000000).toFixed(6);
                const docAvailableToRedeem= (auth.contractStatusData['docAvailableToRedeem'] /1000000000000000000000).toFixed(5);
                const b0BproAmount= (auth.contractStatusData['b0BproAmount'] /1000000000000000000).toFixed(6);
                const rbtc_interest= (auth.userBalanceData['bprox2Balance']);
                const x2DocAmount= (auth.contractStatusData['x2DocAmount'] /1000000000000000000).toFixed(2);
                const x2BproAmount= (auth.contractStatusData['x2BproAmount'] /1000000000000000000).toFixed(6);
                return {totalBTCAmount:totalBTCAmount,docAvailableToRedeem:docAvailableToRedeem,b0BproAmount:b0BproAmount,interest:rbtc_interest,x2DocAmount:x2DocAmount,x2BproAmount:x2BproAmount};
            } else{
                return {totalBTCAmount:0,docAvailableToRedeem:0,b0BproAmount:0,x2DocAmount:0,x2BproAmount:0};
            }
        }else{
            return {totalBTCAmount:0,docAvailableToRedeem:0,b0BproAmount:0,x2DocAmount:0,x2BproAmount:0};
        }
    }



    return (
        <div className="Card CardSystemStatus">
            <h3 className="CardTitle" style={{ fontSize: '1.4em' }}>
                Liquidity BPro | Liquidity BTCx
            </h3>

            <div className="CardMetricContent">
                <div>
                    <h3>Total rBTC</h3>
                    {getDatas()['totalBTCAmount']}
                    <h3>Total DoC</h3>
                    {getDatas()['docAvailableToRedeem']}
                    <h3>Total BPro</h3>
                    {getDatas()['b0BproAmount']}
                </div>
                <div className="separator" />
                <div>
                    <h3>Total rBTC</h3>
                    {getDatas()['interest']}
                    <h3>Total DoC</h3>
                    {getDatas()['x2DocAmount']}
                    <h3>Total BTCx</h3>
                    {getDatas()['x2BproAmount']}
                </div>
            </div>
        </div>
    );
}

export default Liquidity;
