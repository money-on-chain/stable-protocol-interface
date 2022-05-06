import web3 from "web3";
import config from '../Config/constants';


export function setNumber(number){
    if(number.indexOf(".")!==-1){
        const result = number.indexOf(".");
        const result2 = number.substring(0, result);
        return result2
    }else{
        return number
    }
}


export function getDatasMetrics(auth){
    const coin_usd= config.coin_usd
    if (auth.userBalanceData) {
        if (auth.userBalanceData) {
            const globalCoverage= Number(web3.utils.fromWei(setNumber(auth.contractStatusData['globalCoverage']), 'ether')).toFixed(4)

            const bpro_usd= parseFloat(web3.utils.fromWei(setNumber(auth.contractStatusData['bproPriceInUsd']), 'Kwei')).toFixed(5);
            const b0Leverage= parseFloat(web3.utils.fromWei(setNumber(auth.contractStatusData['b0Leverage']), 'ether')).toFixed(6);
            const b0BproAmount= parseFloat(web3.utils.fromWei(setNumber(auth.contractStatusData['b0BproAmount']), 'ether')).toFixed(6);
            const bproAvailableToRedeem= parseFloat(web3.utils.fromWei(setNumber(auth.contractStatusData['bproAvailableToRedeem']), 'ether')).toFixed(6);

            const current_price= (setNumber(auth.contractStatusData['blockSpan']) / 10000).toFixed(2);

            const b0DocAmount= parseFloat(web3.utils.fromWei(setNumber(auth.contractStatusData['b0DocAmount']), 'kether')).toFixed(5);
            const docAvailableToRedeem= parseFloat(web3.utils.fromWei(setNumber(auth.contractStatusData['docAvailableToRedeem']), 'kether')).toFixed(5);
            const docAvailableToMint= parseFloat(web3.utils.fromWei(setNumber(auth.contractStatusData['docAvailableToMint']), 'ether')).toFixed(2);

            const btcx_usd= parseFloat(web3.utils.fromWei(setNumber(auth.contractStatusData['bitcoinPrice']), 'Kwei')).toFixed(5);
            const btcx_interest= parseFloat(web3.utils.fromWei(setNumber(auth.userBalanceData['bprox2Balance']), 'Kwei')).toFixed(5);
            const btcx_x2Leverage= parseFloat(web3.utils.fromWei(setNumber(auth.contractStatusData['x2Leverage']), 'ether')).toFixed(6);
            const btcx_x2Coverage= parseFloat(web3.utils.fromWei(setNumber(auth.contractStatusData['x2Coverage']), 'ether')).toFixed(6);
            const btcx_AvailableToMint= parseFloat(web3.utils.fromWei(setNumber(auth.contractStatusData['bprox2AvailableToMint']), 'ether')).toFixed(6);

            const rbtc_usd= parseFloat(web3.utils.fromWei(setNumber(auth.contractStatusData['bitcoinPrice']), 'kwei')).toFixed(5)
            const rbtc_interest= parseFloat(setNumber(auth.userBalanceData['bprox2Balance'])).toFixed(6);
            const totalBTCAmount= parseFloat(web3.utils.fromWei(setNumber(auth.contractStatusData['totalBTCAmount']), 'ether')).toFixed(5)
            const totalBTCAmountUsd= ((totalBTCAmount * coin_usd)/1000).toFixed(6)
            const b0TargetCoverage= parseFloat(web3.utils.fromWei(setNumber(auth.contractStatusData['b0TargetCoverage']), 'ether')).toFixed(6);
            const bitcoinMovingAverage= parseFloat(web3.utils.fromWei(setNumber(auth.contractStatusData['bitcoinMovingAverage']), 'kether')).toFixed(5);

            const liquidity_totalBTCAmount= parseFloat(web3.utils.fromWei(setNumber(auth.contractStatusData['totalBTCAmount']), 'ether')).toFixed(6);
            const liquidity_docAvailableToRedeem= parseFloat(web3.utils.fromWei(setNumber(auth.contractStatusData['docAvailableToRedeem']), 'kether')).toFixed(5);
            const liquidity_b0BproAmount= parseFloat(web3.utils.fromWei(setNumber(auth.contractStatusData['b0BproAmount']), 'ether')).toFixed(6);
            const liquidity_rbtc_interest= parseFloat(web3.utils.fromWei(setNumber(auth.userBalanceData['bprox2Balance']), 'ether')).toFixed(6);
            const liquidity_x2DocAmount= parseFloat(web3.utils.fromWei(setNumber(auth.contractStatusData['x2DocAmount']), 'ether')).toFixed(2);
            const liquidity_x2BproAmount= parseFloat(web3.utils.fromWei(setNumber(auth.contractStatusData['x2BproAmount']), 'ether')).toFixed(6);

            const blocksToSettlement= (auth.contractStatusData['blocksToSettlement']);

            return {
                globalCoverage:globalCoverage,
                bpro_usd:bpro_usd,b0Leverage:b0Leverage,b0BproAmount:b0BproAmount,bproAvailableToRedeem:bproAvailableToRedeem,
                current_price:current_price,
                b0DocAmount:b0DocAmount,docAvailableToRedeem:docAvailableToRedeem,docAvailableToMint:docAvailableToMint,
                btcx_usd:btcx_usd,interest:btcx_interest,x2Leverage:btcx_x2Leverage,x2Coverage:btcx_x2Coverage,bprox2AvailableToMint:btcx_AvailableToMint,
                rbtc_usd:rbtc_usd,rbtc_interest:rbtc_interest,totalBTCAmount:totalBTCAmount,totalBTCAmountUsd:totalBTCAmountUsd,b0TargetCoverage:b0TargetCoverage,bitcoinMovingAverage:bitcoinMovingAverage,
                liquidity_totalBTCAmount:liquidity_totalBTCAmount,liquidity_docAvailableToRedeem:liquidity_docAvailableToRedeem,liquidity_b0BproAmount:liquidity_b0BproAmount,liquidity_interest:liquidity_rbtc_interest,liquidity_x2DocAmount:liquidity_x2DocAmount,liquidity_x2BproAmount:liquidity_x2BproAmount,
                blocksToSettlement:blocksToSettlement
            };
        } else {
            return {globalCoverage: 0,
                    bpro_usd:0,b0Leverage:0,b0BproAmount:0,bproAvailableToRedeem:0,
                    current_price:0,
                    b0DocAmount:0,docAvailableToRedeem:0,docAvailableToMint:0,
                    btcx_usd:0,interest:0,x2Leverage:0,x2Coverage:0,bprox2AvailableToMint:0,
                    rbtc_usd:0,rbtc_interest:0,totalBTCAmount:0,totalBTCAmountUsd:0,b0TargetCoverage:0,bitcoinMovingAverage:0,
                    liquidity_totalBTCAmount:0,liquidity_docAvailableToRedeem:0,liquidity_b0BproAmount:0,liquidity_interest:0,liquidity_x2DocAmount:0,liquidity_x2BproAmount:0,
                    blocksToSettlement:0
            };
        }
    }else{
        return {globalCoverage:0,
                bpro_usd:0,b0Leverage:0,b0BproAmount:0,bproAvailableToRedeem:0,
                current_price:0,
                b0DocAmount:0,docAvailableToRedeem:0,docAvailableToMint:0,
                btcx_usd:0,interest:0,x2Leverage:0,x2Coverage:0,bprox2AvailableToMint:0,
                rbtc_usd:0,rbtc_interest:0,totalBTCAmount:0,totalBTCAmountUsd:0,b0TargetCoverage:0,bitcoinMovingAverage:0,
                liquidity_totalBTCAmount:0,liquidity_docAvailableToRedeem:0,liquidity_b0BproAmount:0,liquidity_interest:0,liquidity_x2DocAmount:0,liquidity_x2BproAmount:0,
                blocksToSettlement:0
        };
    }
}