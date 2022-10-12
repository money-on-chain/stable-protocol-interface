import Web3 from 'web3';
import BigNumber from "bignumber.js";
import { setToLocaleString } from "./helper";
import { config } from "../Config/config";
import { precision } from "../Lib/Formats";


const userDocBalance= (auth) =>{
    if (auth.userBalanceData && auth.contractStatusData) {

        const docBalance= new BigNumber(Web3.utils.fromWei(auth.userBalanceData['docBalance']));
        const docBalanceCollateral = docBalance.div(new BigNumber(Web3.utils.fromWei(auth.contractStatusData.bitcoinPrice)));
        return {
            'normal': docBalance,
            'usd': docBalance,
            'collateral': docBalanceCollateral
            }
    }
};

const userBproBalance = (auth) =>{
    if (auth.userBalanceData && auth.contractStatusData) {

        const bproBalance = new BigNumber(Web3.utils.fromWei(auth.userBalanceData.bproBalance));
        const bproBalanceUsd = new BigNumber(Web3.utils.fromWei(auth.contractStatusData.bproPriceInUsd))
            .multipliedBy(bproBalance);
        const bproBalanceCollateral = bproBalanceUsd.div(new BigNumber(Web3.utils.fromWei(auth.contractStatusData.bitcoinPrice)));

        return {
            'normal': bproBalance,
            'usd': bproBalanceUsd,
            'collateral': bproBalanceCollateral
            }
    }
};

const userBtcxBalance = (auth) =>{
    if (auth.userBalanceData && auth.contractStatusData) {

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

const userMocBalance = (auth) =>{
    if (auth.userBalanceData && auth.contractStatusData) {

        const mocBalance = new BigNumber(Web3.utils.fromWei(auth.userBalanceData.mocBalance));
        const mocBalanceUsd = new BigNumber(Web3.utils.fromWei(auth.contractStatusData.mocPrice))
            .multipliedBy(mocBalance);
        const mocBalanceCollateral = mocBalanceUsd.div(new BigNumber(Web3.utils.fromWei(auth.contractStatusData.bitcoinPrice)));

        return {
            'normal': mocBalance,
            'usd': mocBalanceUsd,
            'collateral': mocBalanceCollateral
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
            case 'stable':
                rDecimals = parseInt(config.environment.tokens.STABLE.decimals);
                notFormatted = userDocBalance(auth);
                break;
            case 'riskpro':
                rDecimals = parseInt(config.environment.tokens.RISKPRO.decimals);
                notFormatted = userBproBalance(auth);
                break;
            case 'riskprox':
                rDecimals = parseInt(config.environment.tokens.RISKPROX.decimals);
                notFormatted = userBtcxBalance(auth);
                break;
            default:
                throw new Error('Invalid token name');
        }

        result = {
            'normal': setToLocaleString(notFormatted.normal.toFixed(rDecimals), rDecimals, i18n),
            'normal_tooltip': setToLocaleString(notFormatted.normal.toFixed(12), 12, i18n),
            'usd': setToLocaleString(notFormatted.usd.toFixed(rDecimals), rDecimals, i18n),
            'usd_tooltip': setToLocaleString(notFormatted.usd.toFixed(12), 12, i18n),
            'collateral': setToLocaleString(notFormatted.collateral.toFixed(rDecimals), rDecimals, i18n),
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


export { userDocBalance, userBproBalance, userBtcxBalance, userMocBalance, userCollateralBalance, getUserBalance };