import React, { useContext } from 'react';
import { AuthenticateContext } from '../../../../Context/Auth';

function NextSettlement() {
    const auth = useContext(AuthenticateContext);
    const { accountData } = auth;

    return (
        <div className="Card CardSystemStatus">
            <h3 className="CardTitle" style={{ fontSize: '1.4em' }}>
                Next Settlement
            </h3>

            <div className="CardMetricContent">
                <div>
                    <h3>Date</h3>
                    May 3rd 2022, <br/> 3:34:41 am
                    <h3>Remaining days</h3>
                    In 0 days 8 hours
                    <h3>Current indexed block</h3>
                    2802457
                </div>
                <div className="separator" />
                <div>
                    <h3>Blocks to <br/> settlement</h3>
                    941
                    <h3>Settlement will <br/> happen on block</h3>
                    2803398
                </div>
            </div>
        </div>
    );
}

export default NextSettlement;
