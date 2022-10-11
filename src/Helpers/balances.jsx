import Web3 from 'web3';
import BigNumber from "bignumber.js";


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


export { userDocBalance, userBproBalance, userBtcxBalance, userMocBalance, userCollateralBalance };