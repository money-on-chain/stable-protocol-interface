import React, { useContext } from 'react';
import { AuthenticateContext } from '../../../../Context/Auth';
import {getDatasMetrics} from '../../../../Helpers/helper'

function Liquidity() {
    const auth = useContext(AuthenticateContext);
    const { accountData } = auth;

    const getDatas = getDatasMetrics(auth)

    return (
        <div className="Card CardSystemStatus">
            <h3 className="CardTitle" style={{ fontSize: '1.4em' }}>
                Liquidity BPro | Liquidity BTCx
            </h3>

            <div className="CardMetricContent">
                <div>
                    <h3>Total rBTC</h3>
                    {getDatas['liquidity_totalBTCAmount']}
                    <h3>Total DoC</h3>
                    {getDatas['liquidity_docAvailableToRedeem']}
                    <h3>Total BPro</h3>
                    {getDatas['liquidity_b0BproAmount']}
                </div>
                <div className="separator" />
                <div>
                    <h3>Total rBTC</h3>
                    {getDatas['liquidity_interest']}
                    <h3>Total DoC</h3>
                    {getDatas['liquidity_x2DocAmount']}
                    <h3>Total BTCx</h3>
                    {getDatas['liquidity_x2BproAmount']}
                </div>
            </div>
        </div>
    );
}

export default Liquidity;
