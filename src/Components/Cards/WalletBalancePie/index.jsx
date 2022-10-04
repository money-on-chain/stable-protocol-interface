import React, {useContext, useEffect, useState} from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip} from 'recharts';
import {AuthenticateContext} from "../../../Context/Auth";
import { adjustPrecision, formatLocalMap, formatLocalMap2 } from '../../../Lib/Formats';
import {useTranslation} from "react-i18next";
import {LargeNumber} from "../../LargeNumber";
import Web3 from 'web3';
import { config } from './../../../Config/config';
import {getDecimals} from "../../../Helpers/helper";

import BigNumber from "bignumber.js";
const AppProject = config.environment.AppProject;
const BalancePieColors = config.home.walletBalancePie.colors;
//const COLORS = AppProject === 'MoC' ? ['#00a651', '#ef8a13','#68cdc6','#808080' ] :['#808080','#0062b7','#0062b7','#808080'];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip pieChartTooltip">
                {/*<p className="label">{`${label} : ${payload[0].value}`}</p>*/}
                {/*<p className="intro">{getIntroOfPage(label)}</p>*/}
                <p className="value-1" style={{ fontSize: 14 }}>{`${payload[0].payload.set1}`}</p>
                <p className={`${payload[0].payload.class}-${AppProject}`} style={{ fontSize: 14 }}>{`${payload[0].payload.set2}`}</p>
            </div>
        );
    }

    return null;
};

function WalletBalancePie(props) {
    const [t, i18n]= useTranslation(["global",'moc','rdoc']);
    const ns = config.environment.AppProject.toLowerCase();
    const AppProject = config.environment.AppProject;
    // const [colors, setColors] = useState(['#ccc']);
    // static demoUrl = 'https://codesandbox.io/s/pie-chart-with-padding-angle-7ux0o';
    const auth = useContext(AuthenticateContext);
    const { accountData, balanceRbtc } = useContext(AuthenticateContext);

    useEffect(() => {
        if(auth.isLoggedIn){
            // setColors(['#00a651', '#ef8a13','#68cdc6','#808080' ])
        }
    }, [auth]);


    const userMocBalance = () =>{
        if (auth.userBalanceData && accountData.Balance) {

            const mocBalance = new BigNumber(Web3.utils.fromWei(auth.userBalanceData.mocBalance));
            const mocBalanceUsd = new BigNumber(Web3.utils.fromWei(auth.contractStatusData.mocPrice)).multipliedBy(mocBalance);
            const mocBalanceCollateral = mocBalanceUsd.div(new BigNumber(Web3.utils.fromWei(auth.contractStatusData.bitcoinPrice)));

            return {
                'normal': mocBalance,
                'usd': mocBalanceUsd,
                'collateral': mocBalanceCollateral
                }
        }
    };

    const userCollateralBalance = () =>{
        if (auth.userBalanceData && auth.contractStatusData) {

            const collateralBalance = new BigNumber(Web3.utils.fromWei(auth.userBalanceData.rbtcBalance));
            const collateralBalanceUsd = new BigNumber(Web3.utils.fromWei(auth.contractStatusData.bitcoinPrice)).multipliedBy(collateralBalance);
            return {
                'normal': collateralBalance,
                'usd': collateralBalanceUsd,
                'collateral': collateralBalance
                }
        }
    };

    const userDocBalance= () =>{
        if (auth.userBalanceData && accountData.Balance) {

            const docBalance= new BigNumber(Web3.utils.fromWei(auth.userBalanceData['docBalance']));
            const docBalanceCollateral = docBalance.div(new BigNumber(Web3.utils.fromWei(auth.contractStatusData.bitcoinPrice)));
            return {
                'normal': docBalance,
                'usd': docBalance,
                'collateral': docBalanceCollateral
                }
        }
    };

    const userBproBalance = () =>{
        if (auth.userBalanceData && accountData.Balance) {

            const bproBalance = new BigNumber(Web3.utils.fromWei(auth.userBalanceData.bproBalance));
            const bproBalanceUsd = new BigNumber(Web3.utils.fromWei(auth.contractStatusData.bproPriceInUsd)).multipliedBy(bproBalance);
            const bproBalanceCollateral = bproBalanceUsd.div(new BigNumber(Web3.utils.fromWei(auth.contractStatusData.bitcoinPrice)));

            return {
                'normal': bproBalance,
                'usd': bproBalanceUsd,
                'collateral': bproBalanceCollateral
                }
        }
    };

    const userBtcxBalance = () =>{
        if (auth.userBalanceData && accountData.Balance) {

            const btcxBalance = new BigNumber(Web3.utils.fromWei(auth.userBalanceData['bprox2Balance']));
            const btcxBalanceCollateral = new BigNumber(Web3.utils.fromWei(auth.contractStatusData.bprox2PriceInRbtc))
                .multipliedBy(btcxBalance);
            const btcxBalanceUsd = btcxBalanceCollateral
                .multipliedBy(new BigNumber(Web3.utils.fromWei(auth.contractStatusData.bitcoinPrice)))

            return {
                'normal': btcxBalance,
                'usd': btcxBalanceUsd,
                'collateral': btcxBalanceCollateral
                }
        }
    };

    const getBalanceUSD = () => {
        if (auth.userBalanceData && accountData.Balance) {

            const userBalances = getUserBalances();

            const totalBalances = BigNumber.sum(
                userBalances.doc.usd,
                userBalances.bpro.usd,
                userBalances.btcx.usd,
                userBalances.moc.usd,
                userBalances.collateral.usd,
            )

            return (Number(totalBalances.toFixed())).toLocaleString(formatLocalMap2[i18n.languages[0]], {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }
            );

        }else{
            return (0).toFixed(2)
        }
    };

    const getUserBalances = () => {

        const userBalances = {}
        userBalances['doc'] = userDocBalance();
        userBalances['bpro'] = userBproBalance();
        userBalances['moc'] = userMocBalance();
        userBalances['btcx'] = userBtcxBalance();
        userBalances['collateral'] = userCollateralBalance();

        return userBalances;

    }

    const getBalance = () => {
        if (auth.userBalanceData && accountData.Balance) {
            const userBalances = getUserBalances();

            const totalBalances = BigNumber.sum(
                userBalances.doc.collateral,
                userBalances.bpro.collateral,
                userBalances.btcx.collateral,
                userBalances.moc.collateral,
                userBalances.collateral.collateral,
                )

            return totalBalances.toFixed(Number(getDecimals("RESERVE", AppProject)))

        }else{
            return (0).toFixed(6)
        }
    };

    const getPie = () => {
        if (auth.userBalanceData && accountData.Balance) {

            const userBalances = getUserBalances();

            const projectDecimals = {}
            projectDecimals['COLLATERAL'] = Number(getDecimals("RESERVE", AppProject));
            projectDecimals['USD'] = Number(getDecimals("STABLE", AppProject));

            const data = [
                {
                    name: 'Group A',
                    value: Number(userBalances.doc.usd.toFixed(projectDecimals.USD)),
                    set1: userBalances.doc.collateral.toFixed(projectDecimals.COLLATERAL) +' '+ t(`${AppProject}.Tokens_RESERVE_code`, {ns: ns}),
                    set2: userBalances.doc.usd.toFixed(projectDecimals.USD) +' '+ t(`${AppProject}.Tokens_STABLE_code`, {ns: ns}),
                    class: 'STABLE'
                },
                {
                    name: 'Group B',
                    value: Number(userBalances.bpro.usd.toFixed(projectDecimals.USD)),
                    set1: userBalances.bpro.collateral.toFixed(projectDecimals.COLLATERAL) +' '+ t(`${AppProject}.Tokens_RESERVE_code`, {ns: ns}),
                    set2: userBalances.bpro.normal.toFixed(projectDecimals.COLLATERAL) +' '+ t(`${AppProject}.Tokens_RISKPRO_code`, {ns: ns}),
                    class: 'RISKPRO'
                },
                {
                    name: 'Group C',
                    value: Number(userBalances.btcx.usd.toFixed(projectDecimals.USD)),
                    set1: userBalances.btcx.collateral.toFixed(projectDecimals.COLLATERAL) +' '+ t(`${AppProject}.Tokens_RESERVE_code`, {ns: ns}),
                    set2: userBalances.btcx.normal.toFixed(projectDecimals.COLLATERAL)  +' '+ t(`${AppProject}.Tokens_RISKPROX_code`, {ns: ns}),
                    class: 'RISKPROX'
                },
                {
                    name: 'Group D',
                    value: Number(userBalances.moc.usd.toFixed(projectDecimals.USD)),
                    set1: userBalances.moc.collateral.toFixed(projectDecimals.COLLATERAL) + ' '+ t(`${AppProject}.Tokens_RESERVE_code`, {ns: ns}),
                    set2: userBalances.moc.normal.toFixed(projectDecimals.USD)  +' '+ t(`${AppProject}.Tokens_MOC_code`, {ns: ns}),
                    class: 'MOC'
                },
                {
                    name: 'Group E',
                    value: Number(userBalances.collateral.usd.toFixed(projectDecimals.USD)),
                    set1: userBalances.collateral.collateral.toFixed(projectDecimals.COLLATERAL) + ' '+ t(`${AppProject}.Tokens_RESERVE_code`, {ns: ns}),
                    set2: userBalances.collateral.normal.toFixed(projectDecimals.COLLATERAL) +' '+ t(`${AppProject}.Tokens_RESERVE_code`, {ns: ns}),
                    class: 'RBTC_MAIN'
                }

            ];

            return data;
        }
        else{
            return [{ name: 'Group A', value: 100, set1: 'No Funds', set2: '', class: 'RBTC_MAIN'}]
        }
    };

    return (
        <div style={{ height: 250}} className="PieChart">
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={getPie()}
                        innerRadius={113}
                        outerRadius={119}
                        fill="#8884d8"
                        paddingAngle={1}
                        dataKey="value"
                    >
                        {getPie() !== undefined &&

                        getPie().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={BalancePieColors[index % BalancePieColors.length]} className={`piePiece ${entry.currencyCode}-${AppProject}`} />
                        ))

                        }
                    </Pie>
                    <Tooltip content={<CustomTooltip />} overlayStyle={{fontSize: '12px'}}/>
                </PieChart>
            </ResponsiveContainer>
            <span className={'money-RBTC'}>
                {AppProject == 'MoC' &&
                    <LargeNumber {...{ amount: Web3.utils.toWei(getBalance(), 'ether'), currencyCode: 'RESERVE', includeCurrency: true}} />
                }
                {AppProject != 'MoC' && <LargeNumber {...{ amount: getBalance()*1000000000000000000, currencyCode: 'RESERVE', includeCurrency: true}} />}
            </span>
            <span className={'money-USD'}>{getBalanceUSD()} USD</span>
        </div>

    );

}
export default WalletBalancePie