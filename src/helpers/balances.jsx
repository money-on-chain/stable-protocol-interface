import Web3 from 'web3';
import BigNumber from "bignumber.js";
import { setToLocaleString, setNumber } from "./helper";
import { config } from "../projects/config";
import { precisionDecimals } from "../helpers/Formats";


const userTPBalance= (auth) =>{
    if (auth.userBalanceData && auth.contractStatusData) {

        const tpBalance= new BigNumber(Web3.utils.fromWei(auth.userBalanceData['docBalance']));
        const tpBalanceCollateral = tpBalance.div(new BigNumber(Web3.utils.fromWei(auth.contractStatusData.bitcoinPrice)));
        return {
            'normal': tpBalance,
            'usd': tpBalance,
            'collateral': tpBalanceCollateral
            }
    }
};

const userTCBalance = (auth) =>{
    if (auth.userBalanceData && auth.contractStatusData) {

        const tcBalance = new BigNumber(Web3.utils.fromWei(auth.userBalanceData.bproBalance));
        const tcBalanceUsd = new BigNumber(Web3.utils.fromWei(auth.contractStatusData.bproPriceInUsd))
            .multipliedBy(tcBalance);
        const tcBalanceCollateral = tcBalanceUsd.div(new BigNumber(Web3.utils.fromWei(auth.contractStatusData.bitcoinPrice)));

        return {
            'normal': tcBalance,
            'usd': tcBalanceUsd,
            'collateral': tcBalanceCollateral
            }
    }
};

const userTXBalance = (auth) =>{
    if (auth.userBalanceData && auth.contractStatusData) {

        const txBalance = new BigNumber(Web3.utils.fromWei(auth.userBalanceData['bprox2Balance']));
        const txBalanceCollateral = new BigNumber(Web3.utils.fromWei(auth.contractStatusData.bprox2PriceInRbtc))
            .multipliedBy(txBalance);
        const txBalanceUsd = txBalanceCollateral
            .multipliedBy(new BigNumber(Web3.utils.fromWei(auth.contractStatusData.bitcoinPrice)))

        return {
            'normal': txBalance,
            'usd': txBalanceUsd,
            'collateral': txBalanceCollateral
            }
    }
};

const userTGBalance = (auth) =>{
    if (auth.userBalanceData && auth.contractStatusData) {

        const tgBalance = new BigNumber(Web3.utils.fromWei(auth.userBalanceData.mocBalance));
        const tgBalanceUsd = new BigNumber(Web3.utils.fromWei(auth.contractStatusData.mocPrice))
            .multipliedBy(tgBalance);
        const tgBalanceCollateral = tgBalanceUsd.div(new BigNumber(Web3.utils.fromWei(auth.contractStatusData.bitcoinPrice)));

        return {
            'normal': tgBalance,
            'usd': tgBalanceUsd,
            'collateral': tgBalanceCollateral
            }
    }
};

const userCollateralBalance = (auth) =>{
    if (auth.userBalanceData && auth.contractStatusData) {

        const collateralBalance = new BigNumber(Web3.utils.fromWei(auth.userBalanceData.rbtcBalance));
        const collateralBalanceUsd = new BigNumber(Web3.utils.fromWei(auth.contractStatusData.bitcoinPrice))
            .multipliedBy(collateralBalance);
        return {
            'normal': collateralBalance,
            'usd': collateralBalanceUsd,
            'collateral': collateralBalance
            }
    }
};

const getUserBalance = (auth, i18n, tokenName) => {

    let result = {
        'normal': (0).toFixed(6),
        'usd': (0).toFixed(6),
        'usd_tooltip': (0).toFixed(12),
        'collateral': (0).toFixed(6),
        'collateral_tooltip': (0).toFixed(12),
        'raw': {
            'usd': new BigNumber(0),
            'collateral': new BigNumber(0)
        }
    }
    if (auth.userBalanceData && auth.contractStatusData) {
        let rDecimals;
        let notFormatted;
        switch (tokenName.toLowerCase()) {
            case 'tp':
                rDecimals = parseInt(config.tokens.TP.decimals);
                notFormatted = userTPBalance(auth);
                break;
            case 'tc':
                rDecimals = parseInt(config.tokens.TC.decimals);
                notFormatted = userTCBalance(auth);
                break;
            case 'tx':
                rDecimals = parseInt(config.tokens.TX.decimals);
                notFormatted = userTXBalance(auth);
                break;
            default:
                throw new Error('Invalid token name');
        }

        result = {
            'normal': setToLocaleString(notFormatted.normal.toFixed(rDecimals), rDecimals, i18n),
            'normal_tooltip': setToLocaleString(notFormatted.normal.toFixed(12), 12, i18n),
            'usd': setToLocaleString(notFormatted.usd.toFixed(parseInt(config.tokens.TP.decimals)), parseInt(config.tokens.TP.decimals), i18n),
            'usd_tooltip': setToLocaleString(notFormatted.usd.toFixed(12), 12, i18n),
            'collateral': setToLocaleString(notFormatted.collateral.toFixed(parseInt(config.tokens.RESERVE.decimals)), parseInt(config.tokens.RESERVE.decimals), i18n),
            'collateral_tooltip': setToLocaleString(notFormatted.collateral.toFixed(12), 12, i18n),
            'raw': {
                'normal': notFormatted.normal.multipliedBy(10**18),
                'usd': notFormatted.usd.multipliedBy(10**18),
                'collateral': notFormatted.collateral.multipliedBy(10**18)
            }
        }
    }
    return result;
};

/*function getUSD(coin,value,auth,i18n=null){*/
const getUSD = (coin, value, auth, i18n=null) => {
    if (auth.contractStatusData) {
        switch (coin) {
            case 'TP':
                return  setToLocaleString(new BigNumber(1 * Web3.utils.fromWei(setNumber(value))),2,i18n)
            case 'TC':
                return  setToLocaleString(new BigNumber(Web3.utils.fromWei(auth.contractStatusData['bproPriceInUsd']) * Web3.utils.fromWei(setNumber(value))),2,i18n)
            case 'TG':
                return setToLocaleString(new BigNumber(Web3.utils.fromWei(auth.contractStatusData['mocPrice']) * Web3.utils.fromWei(setNumber(value))),2,i18n)
            case 'RESERVE':
                return setToLocaleString(new BigNumber(Web3.utils.fromWei(auth.contractStatusData.bitcoinPrice) * Web3.utils.fromWei(setNumber(value))),2,i18n)
            case 'TX':
                return setToLocaleString(new BigNumber(Web3.utils.fromWei(auth.contractStatusData.bitcoinPrice, 'ether') * Web3.utils.fromWei(auth.contractStatusData['bprox2PriceInRbtc'], 'ether') * Web3.utils.fromWei(setNumber(value))),2,i18n)

        }
    }else{
        return 0
    }
}



export {
    userTPBalance,
    userTCBalance,
    userTXBalance,
    userTGBalance,
    userCollateralBalance,
    getUserBalance,
    getUSD
    };