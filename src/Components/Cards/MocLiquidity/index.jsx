import './style.scss'
import React, { Fragment } from 'react';
import { useContext } from 'react'
import {AuthenticateContext} from "../../../Context/Auth";
const BigNumber = require('bignumber.js');

function MocLiquidity() {

    const auth = useContext(AuthenticateContext);

    const set_moc_balance_usd = () =>{
        if ( auth.userBalanceData ) {
            return Number(new BigNumber(auth.userBalanceData['mocBalance']).c[0]/10000).toFixed(2)
        }
    };

    return (
    <div className="Card RewardsBalanceLiquidity withPadding hasTitle">
        <div className="title">
            <h1>MOC Liquidity Mining Program</h1>
            <span role="img" aria-label="info-circle" className="anticon anticon-info-circle">
                <svg viewBox="64 64 896 896" focusable="false" className="" data-icon="info-circle" width="1em" height="1em"
            fill="currentColor" aria-hidden="true"><path
            d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path><path
            d="M464 336a48 48 0 1096 0 48 48 0 10-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z"></path></svg></span>
        </div>
        <div className="Metric"><h2>Ready to Claim</h2>
            <div className="IncentivesItem">
                <h3>
                    <div><span className="" >0.000000</span></div>
                </h3>
                <p>MOC</p></div>
        </div>
        <div className="Metric"><h2>Rewarded Today</h2>
            <div className="IncentivesItem"><h3><span>1,748.001503</span></h3><p>MOC</p></div>
        </div>
        <button type="button" className="ButtonPrimary claimButton  "><span role="img" aria-label="arrow-right"
                                                                            className="anticon anticon-arrow-right"><svg
            viewBox="64 64 896 896" focusable="false" className="" data-icon="arrow-right" width="1em" height="1em"
            fill="currentColor" aria-hidden="true"><path
            d="M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-.7 5.2-2L869 536.2a32.07 32.07 0 000-48.4z"></path></svg></span>
        </button>
    </div>
    )
}


export default MocLiquidity




