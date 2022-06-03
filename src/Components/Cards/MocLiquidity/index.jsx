import './style.scss'
import React, { Fragment } from 'react';
import { useContext } from 'react'
import { AuthenticateContext } from "../../../Context/Auth";
import CountUp from 'react-countup';
import {Alert, Button, Tooltip} from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import data_json from '../../../services/liquidity_mining.json';
import { setNumber } from '../../../Helpers/helper'
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {LargeNumber} from "../../LargeNumber";

const BigNumber = require('bignumber.js');

function MocLiquidity(props) {
    const auth = useContext(AuthenticateContext);

    const set_moc_balance_usd = () => {
        if (auth.userBalanceData) {
            return Number(new BigNumber(auth.userBalanceData['mocBalance']).c[0] / 10000).toFixed(2)
        }
    };

    const setreadyClaim = () => {
        // return  parseFloat(Web3.utils.fromWei(data_json.moc_balance, 'ether')).toFixed(4)
        if ( auth.isLoggedIn ){
            return Number(new BigNumber(setNumber(data_json.moc_balance) / 10000000000000000000000)).toFixed(9)
        }else{
            return (0).toFixed(6)
        }
    }

    const [t, i18n] = useTranslation(["global", 'moc'])

    return (
        <div className="Card RewardsBalanceLiquidity withPadding hasTitle">
            <div className="title">
                <h1>{t("global.RewardsBalance_MocLiquidityMining", { ns: 'global' })}</h1>
                <Tooltip placement="topRight" title={t("global.RewardsBalance_MoreInfo", { ns: 'global' })} className='Tooltip'>
                    <InfoCircleOutlined className="Icon" />
                </Tooltip>
            </div>
            <div className="Metric"><h2>{t("global.RewardsBalance_Amount", { ns: 'global' })}</h2>
                <div className="IncentivesItem">
                    <h3>
                        {/*<div><span className="" >{setreadyClaim()}</span></div>*/}
                        <LargeNumber amount={data_json.moc_balance} currencyCode="REWARD" />
                    </h3>
                    <p>MOC</p></div>
            </div>
            <div className="Metric"><h2>{t("global.RewardsBalance_EarnedToday", { ns: 'global' })}</h2>
                <div className="IncentivesItem">
                    {/*<h3><span>1,748.001503</span></h3><p>MOC</p>*/}
                    <h3>
                        {/*<CountUp*/}
                        {/*    start={875.039}*/}
                        {/*    end={160527.012}*/}
                        {/*    duration={2.75}*/}
                        {/*    separator=" "*/}
                        {/*    decimals={4}*/}
                        {/*    decimal=","*/}
                        {/*    prefix=""*/}
                        {/*    suffix=" left"*/}
                        {/*    onEnd={({ pauseResume, reset, start, update }) => start()}*/}
                        {/*>*/}
                        {/*    {({ countUpRef, start }) => (*/}
                        {/*        <div>*/}
                        {/*            <span ref={countUpRef} />*/}
                        {/*            <button onClick={start}>Start</button>*/}
                        {/*        </div>*/}
                        {/*    )}*/}
                        {/*</CountUp>*/}

                        {auth.isLoggedIn && <CountUp className='countup'
                                                     start={875.039}
                                                     end={160527000.012}
                                                     duration={5}
                                                     onEnd={({ pauseResume, reset, start, update }) => start()}
                        />}
                        {!auth.isLoggedIn && <span>0.000000</span>}
                        </h3>
                    <p>MOC</p>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                {!props.rewards
                    ?
                    <Link to="/rewards">
                        <button type="button" className="ButtonPrimary claimButton  ">
                            <span role="img" aria-label="arrow-right"
                            className="anticon anticon-arrow-right"><svg
                                viewBox="64 64 896 896" focusable="false" className="" data-icon="arrow-right" width="1em" height="1em"
                                fill="currentColor" aria-hidden="true"><path
                                    d="M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-.7 5.2-2L869 536.2a32.07 32.07 0 000-48.4z"></path></svg></span>
                        </button>
                    </Link>

                    : <Button style={{ marginTop: '3.5em' }} type="primary" disabled={!auth.isLoggedIn}>{t('global.RewardsClaimButton_Claim', { ns: 'global' })}</Button>}
            </div>
        </div>
    )
}


export default MocLiquidity