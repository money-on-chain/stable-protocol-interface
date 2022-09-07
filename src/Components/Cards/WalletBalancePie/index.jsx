import React, {useContext, useEffect, useState} from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip} from 'recharts';
import {AuthenticateContext} from "../../../Context/Auth";
import { adjustPrecision, formatLocalMap, formatLocalMap2 } from '../../../Lib/Formats';
import {useTranslation} from "react-i18next";
import {LargeNumber} from "../../LargeNumber";
import web3 from 'web3';
import { config } from './../../../Config/config';

const BigNumber = require('bignumber.js');
// const COLORS = ['#00a651', '#ef8a13','#68cdc6','#808080' ];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip pieChartTooltip">
                {/*<p className="label">{`${label} : ${payload[0].value}`}</p>*/}
                {/*<p className="intro">{getIntroOfPage(label)}</p>*/}
                <p className="value-1" style={{ fontSize: 14 }}>{`${payload[0].payload.set1}`}</p>
                <p className={`${payload[0].payload.class}`} style={{ fontSize: 14 }}>{`${payload[0].payload.set2}`}</p>
            </div>
        );
    }

    return null;
};

function WalletBalancePie(props) {
    const [t, i18n]= useTranslation(["global",'moc','rdoc']);
    const ns = config.environment.AppMode === 'MoC' ? 'moc' : 'rdoc';
    const appMode = config.environment.AppMode;
    const [colors, setColors] = useState(['#ccc']);
    // static demoUrl = 'https://codesandbox.io/s/pie-chart-with-padding-angle-7ux0o';
    const auth = useContext(AuthenticateContext);
    const { accountData } = useContext(AuthenticateContext);

    useEffect(() => {
        if(auth.isLoggedIn){
            setColors(['#00a651', '#ef8a13','#68cdc6','#808080' ])
        }
    }, [auth]);


    const set_moc_balance_usd = () =>{
        if (auth.userBalanceData && accountData.Balance) {
            // const moc_balance= (Number(new BigNumber(auth.web3.utils.fromWei(auth.userBalanceData['mocBalance'])).c[0]/10000)/auth.web3.utils.fromWei(auth.contractStatusData.bitcoinPrice)).toFixed(4);
            // const moc_balance_usd= Number(new BigNumber(auth.web3.utils.fromWei(auth.userBalanceData['mocBalance'])).c[0]/10000)
            const moc_balance= (Number(new BigNumber(auth.userBalanceData['mocBalance']).c[0]/10000)/auth.contractStatusData.bitcoinPrice).toFixed(6);
            const moc_balance_usd= Number(new BigNumber(auth.userBalanceData['mocBalance']).c[0]/10000)
            return {'normal':moc_balance,'usd':moc_balance_usd}
        }
    };
    const set_rbtc_main_usd = () =>{
        if (auth.userBalanceData && accountData.Balance) {
            const rbtc_main_usd= (new BigNumber(accountData.Balance).toFixed(4))*auth.web3.utils.fromWei(auth.contractStatusData.bitcoinPrice)
            const rbtc_main= new BigNumber(accountData.Balance).toFixed(4)
            return {'normal':rbtc_main,'usd':rbtc_main_usd}
        }
    };
    const set_doc_usd= () =>{
        if (auth.userBalanceData && accountData.Balance) {
            const doc_usd= new BigNumber(auth.web3.utils.fromWei(auth.userBalanceData['docBalance']));
            const doc= (auth.web3.utils.fromWei(auth.userBalanceData['docBalance'])/auth.web3.utils.fromWei(auth.contractStatusData.bitcoinPrice)).toFixed(6);
            return {'normal':doc,'usd':doc_usd}
        }
    };
    const set_bpro_usd= () =>{
        if (auth.userBalanceData && accountData.Balance) {
            const bpro_usd= new BigNumber(auth.web3.utils.fromWei(auth.contractStatusData['bproPriceInUsd'])*auth.web3.utils.fromWei(auth.userBalanceData['bproBalance'])).toFixed(2)
            const bpro= ((auth.web3.utils.fromWei(auth.contractStatusData['bproPriceInUsd'])*auth.web3.utils.fromWei(auth.userBalanceData['bproBalance']))/auth.web3.utils.fromWei(auth.contractStatusData.bitcoinPrice)).toFixed(6)
            return {'normal':bpro,'usd':bpro_usd}
        }
    };
    const set_btc_usd = () =>{
        if (auth.userBalanceData && accountData.Balance) {
            const btc_usd= new BigNumber(auth.web3.utils.fromWei(auth.contractStatusData['bitcoinPrice']) * auth.web3.utils.fromWei(auth.userBalanceData['bprox2Balance'])).toFixed(4)
            // const btc_usd= new BigNumber(auth.contractStatusData['bitcoinPrice'] * auth.userBalanceData['bprox2Balance']).toFixed(4)
            const btc= auth.userBalanceData['bprox2Balance'];
            return {'normal':btc,'usd':btc_usd}
        }
    };

    const getBalanceUSD = () => {
        if (auth.userBalanceData && accountData.Balance) {
            const rbtc_main_usd= set_rbtc_main_usd()['usd']
            const doc_usd= set_doc_usd()['usd']
            const bpro_usd= set_bpro_usd()['usd']
            const btc_usd= set_btc_usd()['usd']
            const moc_balance_usd= set_moc_balance_usd()['usd']
            return (Number(rbtc_main_usd)+Number(doc_usd)+Number(bpro_usd)+Number(btc_usd)+Number(moc_balance_usd)).toLocaleString(formatLocalMap2[i18n.languages[0]], {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }
            );
        }else{
            return (0).toFixed(2)
        }
    };

    const getBalance = () => {
        if (auth.userBalanceData && accountData.Balance) {
            const rbtc_main= (set_moc_balance_usd()['usd']/auth.web3.utils.fromWei(auth.contractStatusData.bitcoinPrice)).toFixed(6)
            const doc= ((set_bpro_usd()['usd'])/auth.web3.utils.fromWei(auth.contractStatusData.bitcoinPrice)).toFixed(4)
            const bpro= (set_doc_usd()['usd']/auth.web3.utils.fromWei(auth.contractStatusData.bitcoinPrice)).toFixed(6)
            const btc= Number(new BigNumber(accountData.Balance))
            return new BigNumber((Number(rbtc_main) + Number(doc) + Number(bpro) + Number(btc) )).toFixed(6)
        }else{
            return (0).toFixed(6)
        }
    };

    const getPie = () => {
        if (auth.userBalanceData && accountData.Balance) {
            const data = [
                {
                    name: 'Group A',
                    value: Number((set_doc_usd()['usd']/auth.web3.utils.fromWei(auth.contractStatusData.bitcoinPrice)).toFixed(6)),
                    set1: (set_doc_usd()['usd']/auth.web3.utils.fromWei(auth.contractStatusData.bitcoinPrice)).toFixed(6)+' '+ t(`${appMode}.Tokens_RESERVE_code`, {ns: ns}),
                    set2: (set_doc_usd()['usd']).toFormat(2, formatLocalMap[i18n.languages[0]]) +' '+ t(`${appMode}.Tokens_STABLE_code`, {ns: ns}),
                    class: 'STABLE'
                },
                {
                    name: 'Group B',
                    value: Number(((set_bpro_usd()['usd'])/auth.web3.utils.fromWei(auth.contractStatusData.bitcoinPrice)).toFixed(6)),
                    set1: ((set_bpro_usd()['usd'])/auth.web3.utils.fromWei(auth.contractStatusData.bitcoinPrice)).toFixed(4) +' '+ t(`${appMode}Tokens_RESERVE_code`, {ns: ns}),
                    set2: Number((auth.web3.utils.fromWei(auth.userBalanceData.bproBalance))).toFixed(6) +' '+ t(`${appMode}.Tokens_RISKPRO_code`, {ns: ns}), class: 'RISKPRO'
                },
                {
                    name: 'Group C',
                    value: (set_moc_balance_usd()['usd']/auth.web3.utils.fromWei(auth.contractStatusData.bitcoinPrice)),
                    set1: (set_moc_balance_usd()['usd']/auth.web3.utils.fromWei(auth.contractStatusData.bitcoinPrice)).toFixed(6)+' '+ t(`${appMode}.Tokens_RESERVE_code`, {ns: ns}),
                    set2: (set_moc_balance_usd()['usd']).toLocaleString(formatLocalMap2[i18n.languages[0]], {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }) +' '+ t(`${appMode}.Tokens_MOC_code`, {ns: ns}),
                    class: 'RISKPROX'
                },
                {
                    name: 'Group d',
                    value: Number(new BigNumber(accountData.Balance)),
                    set1: (Number(new BigNumber(accountData.Balance))).toLocaleString(formatLocalMap2[i18n.languages[0]], {
                        minimumFractionDigits: 6,
                        maximumFractionDigits: 6
                    })+' '+ t(`${appMode}.Tokens_RESERVE_code`, {ns: ns}),
                    set2: (Number(new BigNumber(accountData.Balance))).toLocaleString(formatLocalMap2[i18n.languages[0]], {
                        minimumFractionDigits: 6,
                        maximumFractionDigits: 6
                    })+' '+ t(`${appMode}.Tokens_RESERVE_code`, {ns: ns}),
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
        <div style={{ height: 250}}>
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
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]}/>
                        ))

                        }
                    </Pie>
                    <Tooltip content={<CustomTooltip />} overlayStyle={{fontSize: '12px'}}/>
                </PieChart>
            </ResponsiveContainer>
            <span className={'money-RBTC'}> <LargeNumber {...{ amount: web3.utils.toWei(getBalance(), 'ether'), currencyCode: 'RESERVE', includeCurrency: true}} /></span>
            <span className={'money-USD'}>{getBalanceUSD()} USD</span>
        </div>

    );

}
export default WalletBalancePie