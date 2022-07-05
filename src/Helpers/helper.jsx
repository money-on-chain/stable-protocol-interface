import web3 from "web3";
import config from '../Config/constants';
import Web3 from "web3";
import {DetailedLargeNumber, getExplainByEvent} from "../Components/LargeNumber";
import moment from 'moment';
import {formatLocalMap2} from "../Lib/Formats";
const BigNumber = require('bignumber.js');

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
            console.log('000000000000000000000000000000000')
            console.log(auth)
            // console.log(auth.userBalanceData)
            // console.log(auth.userBalanceData['bproBalance'])
            console.log('000000000000000000000000000000000')
            const globalCoverage= Number(web3.utils.fromWei(setNumber(auth.contractStatusData['globalCoverage']), 'ether')).toFixed(4)
            const globalCoverageClean= Number(auth.contractStatusData['globalCoverage']).toFixed(4)

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
            const blockHeight= (auth.contractStatusData['blockHeight']);
            const paused= (auth.contractStatusData['paused']);

            return {
                globalCoverage:globalCoverage,
                bpro_usd:bpro_usd,b0Leverage:b0Leverage,b0BproAmount:b0BproAmount,bproAvailableToRedeem:bproAvailableToRedeem,
                current_price:current_price,
                b0DocAmount:b0DocAmount,docAvailableToRedeem:docAvailableToRedeem,docAvailableToMint:docAvailableToMint,
                btcx_usd:btcx_usd,interest:btcx_interest,x2Leverage:btcx_x2Leverage,x2Coverage:btcx_x2Coverage,bprox2AvailableToMint:btcx_AvailableToMint,
                rbtc_usd:rbtc_usd,rbtc_interest:rbtc_interest,totalBTCAmount:totalBTCAmount,totalBTCAmountUsd:totalBTCAmountUsd,b0TargetCoverage:b0TargetCoverage,bitcoinMovingAverage:bitcoinMovingAverage,
                liquidity_totalBTCAmount:liquidity_totalBTCAmount,liquidity_docAvailableToRedeem:liquidity_docAvailableToRedeem,liquidity_b0BproAmount:liquidity_b0BproAmount,liquidity_interest:liquidity_rbtc_interest,liquidity_x2DocAmount:liquidity_x2DocAmount,liquidity_x2BproAmount:liquidity_x2BproAmount,
                blocksToSettlement:blocksToSettlement,blockHeight:blockHeight,paused:paused,
                globalCoverageClean:globalCoverageClean
            };
        } else {
            return {globalCoverage: 0,
                    bpro_usd:0,b0Leverage:0,b0BproAmount:0,bproAvailableToRedeem:0,
                    current_price:0,
                    b0DocAmount:0,docAvailableToRedeem:0,docAvailableToMint:0,
                    btcx_usd:0,interest:0,x2Leverage:0,x2Coverage:0,bprox2AvailableToMint:0,
                    rbtc_usd:0,rbtc_interest:0,totalBTCAmount:0,totalBTCAmountUsd:0,b0TargetCoverage:0,bitcoinMovingAverage:0,
                    liquidity_totalBTCAmount:0,liquidity_docAvailableToRedeem:0,liquidity_b0BproAmount:0,liquidity_interest:0,liquidity_x2DocAmount:0,liquidity_x2BproAmount:0,
                    blocksToSettlement:0,blockHeight:0,paused:false,
                    globalCoverageClean:0
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
                blocksToSettlement:0,blockHeight:0,paused:false,
                globalCoverageClean:0
        };
    }
}



export function readJsonTable(data_j,t, i18n){
    var set_event= "TRANSFER";
    if(data_j.event.includes("Mint")){set_event='MINT'}
    if(data_j.event.includes("Settlement")){set_event='SETTLEMENT'}
    if(data_j.event.includes("Redeem")){set_event='REDEEM'}

    const set_asset= data_j.tokenInvolved;

    let fixed=2
    if( set_asset!='STABLE' && set_asset!='USD'){
        fixed= 6
    }

    let asset=''
    switch (set_asset) {
        case 'STABLE':
            asset = 'DOC';
            break;
        case 'RISKPRO':
            asset = 'BPRO'
            break;
        case 'RISKPROX':
            asset = 'BTCX'
            break;
        default:
            asset = 'DOC'
            break;
    }

    let asset_detail=''
    let asset_detail_fixed= 6
    switch (asset) {
        case 'BPRO':
            if(data_j.event.includes("Redeem")){
                asset_detail= 'RBTC'
            }
            if(data_j.event.includes("Settlement")){
                asset_detail= 'BPRO'
            }
            if(data_j.event.includes("Mint")){
                asset_detail= 'BPRO'
            }
            if(data_j.event.includes("Transfer")){
                asset_detail= 'BPRO'
            }

            break;
        case 'BTCX':
            if(data_j.event.includes("Redeem")){
                asset_detail= 'RBTC'
            }
            if(data_j.event.includes("Settlement")){
                asset_detail= 'RBTC'
            }
            if(data_j.event.includes("Mint")){
                asset_detail= 'BTCX'
            }
            if(data_j.event.includes("Transfer")){
                asset_detail= 'BTCX'
            }
            break;
        case 'DOC':
            if(data_j.event.includes("Redeem")){
                asset_detail= 'RBTC'
            }
            if(data_j.event.includes("Settlement")){
                asset_detail= 'DOC'
                asset_detail_fixed= 2
            }
            if(data_j.event.includes("Mint")){
                asset_detail= 'DOC'
                asset_detail_fixed= 2
            }
            if(data_j.event.includes("Transfer")){
                asset_detail= 'DOC'
                asset_detail_fixed= 2
            }
            break;
        default:
            asset_detail= 'DOC'
            break;
    }

    const set_status_txt= data_j.status;
    const set_status_percent= data_j.confirmingPercent;

    const wallet_detail= (data_j.userAmount!==undefined)? parseFloat(data_j.userAmount).toFixed(6)  : '--'
    const wallet_detail_usd= (wallet_detail * config.coin_usd).toFixed(2)
    const paltform_detail= DetailedLargeNumber({
        amount: data_j.amount,
        currencyCode: data_j.tokenInvolved,
        includeCurrency: true,
        isPositive: data_j.isPositive,
        showSign: true,
        amountUSD: data_j.USDAmount ? data_j.USDAmount : 0,
        showUSD: false,
        t: t,
        i18n:i18n
    })
    const paltform_detail_usd= (paltform_detail * config.coin_usd).toFixed(2)
    const platform_fee= (data_j.rbtcCommission!==undefined || data_j.mocCommissionValue!==undefined)? parseFloat(Web3.utils.fromWei(setNumber(new BigNumber(data_j.rbtcCommission).gt(0)? data_j.rbtcCommission : data_j.mocCommissionValue)), 'Kwei').toFixed(6) : ''
    const platform_fee_usd= (data_j.rbtcCommission!==undefined || data_j.mocCommissionValue!==undefined)? ((parseFloat(Web3.utils.fromWei(setNumber(new BigNumber(data_j.rbtcCommission).gt(0)? data_j.rbtcCommission : data_j.mocCommissionValue)), 'Kwei').toFixed(2))*config.coin_usd).toFixed(2) : ''
    const gasFee= (data_j.gasFeeRBTC!==undefined)? parseFloat(Web3.utils.fromWei(setNumber(data_j.gasFeeRBTC)), 'Kwei').toFixed(6) : 0
    const gasFeeUSD= `${(gasFee * config.coin_usd).toFixed(2)} USD`
    const interest_detail= (data_j.USDInterests!==undefined)? parseFloat(Web3.utils.fromWei(Web3.utils.toWei(setNumber(data_j.USDInterests), 'Kwei')), 'Kwei').toFixed(6) : 0
    const interest_detail_usd= (interest_detail * config.coin_usd).toFixed(2)
    const truncate_address= (data_j.otherAddress)? data_j.otherAddress.substring(0, 6) + '...' + data_j.otherAddress.substring(data_j.otherAddress.length - 4, data_j.otherAddress.length) : '--'
    const truncate_txhash= (data_j.transactionHash!==undefined)? data_j.transactionHash.substring(0, 6) + '...' + data_j.transactionHash.substring(data_j.transactionHash.length - 4, data_j.transactionHash.length) : '--'

    // const lastUpdatedAt= data_j.lastUpdatedAt
    const lastUpdatedAt= data_j.createdAt
        ? moment(data_j.createdAt).format('YYYY-MM-DD HH:mm:ss')
        : '--'
    const RBTCAmount= getExplainByEvent({
        event: data_j.event,
        amount: DetailedLargeNumber({
            amount: data_j.amount,
            currencyCode: data_j.tokenInvolved,
            includeCurrency: true,
            t: t,
            i18n:i18n
        }),
        amount_rbtc: DetailedLargeNumber({
            amount: data_j.RBTCTotal ? data_j.RBTCTotal : data_j.RBTCAmount,
            currencyCode: 'RESERVE',
            includeCurrency: true,
            t: t,
            i18n:i18n
        }),
        status: data_j.status,
        token_involved: t(`MoC.Tokens_${data_j.tokenInvolved}_code`, { ns: 'moc' }),
        t: t,
        i18n:i18n
    })
    const confirmationTime= data_j.confirmationTime
    const address= data_j.otherAddress ? data_j.otherAddress : '--'
    const amount=  DetailedLargeNumber({
        amount: data_j.amount,
        currencyCode: data_j.tokenInvolved,
        includeCurrency: true,
        isPositive: data_j.isPositive,
        showSign: true,
        amountUSD: data_j.USDAmount ? data_j.USDAmount : 0,
        showUSD: true,
        t: t,
        i18n:i18n
    })

    const platform_fee_value= DetailedLargeNumber({
         amount: new BigNumber(data_j.rbtcCommission).gt(0)
             ? data_j.rbtcCommission
             : data_j.mocCommissionValue,
         currencyCode: new BigNumber(data_j.rbtcCommission).gt(0) ? 'RESERVE' : 'MOC',
         includeCurrency: true,
         amountUSD: data_j.USDCommission ? data_j.USDCommission : 0,
         showUSD: true,
         t: t,
         i18n:i18n
    })

    const blockNumber= (data_j.blockNumber!==undefined)? data_j.blockNumber : '--'
    const wallet_value= DetailedLargeNumber({
        amount: data_j.RBTCTotal ? data_j.RBTCTotal : data_j.RBTCAmount,
        currencyCode: 'RESERVE',
        includeCurrency: true,
        isPositive: !data_j.isPositive,
        showSign: true,
        amountUSD: data_j.USDTotal ? data_j.USDTotal : 0,
        showUSD: true,
        t: t,
        i18n:i18n
    })

    const interests= DetailedLargeNumber({
        amount: data_j.rbtcInterests,
        currencyCode: 'RESERVE',
        includeCurrency: true,
        amountUSD: data_j.USDInterests ? data_j.USDInterests : 0,
        showUSD: true,
        isPositive: data_j.event == 'RiskProxRedeem' ? false : true,
        showSign: data_j.event == 'RiskProxRedeem' ? true : undefined,
        infoDescription: data_j.event == 'RiskProxRedeem' ? 'Credit interest' : undefined,
        t: t,
        i18n:i18n
    })
    const tx_hash_truncate= (data_j.transactionHash!==undefined)? truncate_txhash : '--'
    const tx_hash= (data_j.transactionHash!==undefined)? data_j.transactionHash : '--'

    const gas_fee= DetailedLargeNumber({
        amount: data_j.gasFeeRBTC,
        currencyCode: 'RBTC',
        includeCurrency: true,
        amountUSD: data_j.gasFeeUSD ? data_j.gasFeeUSD : 0,
        showUSD: true,
        t: t,
        i18n:i18n
    })

    const price= DetailedLargeNumber({
        amount: data_j.reservePrice,
        currencyCode: 'USD',
        includeCurrency: true,
        t: t,
        i18n:i18n
    })

    const wallet_value_main= DetailedLargeNumber({
        amount: data_j.RBTCTotal ? data_j.RBTCTotal : data_j.RBTCAmount,
        currencyCode: 'RESERVE',
        includeCurrency: true,
        isPositive: !data_j.isPositive,
        showSign: true,
        amountUSD: data_j.USDTotal ? data_j.USDTotal : 0,
        showUSD: false,
        t: t,
        i18n:i18n
    })

    const leverage=  DetailedLargeNumber({
            amount: data_j.leverage,
            currencyCode: data_j.tokenInvolved,
        t: t,
        i18n:i18n
        })

    return {set_event:set_event,set_asset:set_asset,set_status_txt:set_status_txt,set_status_percent:set_status_percent,
        wallet_detail:wallet_detail,wallet_detail_usd:wallet_detail_usd,
        paltform_detail_usd:paltform_detail_usd,paltform_detail:paltform_detail,
        platform_fee:platform_fee,platform_fee_usd:platform_fee_usd,gasFee:gasFee,
        gasFeeUSD:gasFeeUSD,interest_detail:interest_detail,interest_detail_usd:interest_detail_usd,
        truncate_address:truncate_address,truncate_txhash:truncate_txhash,
        lastUpdatedAt:lastUpdatedAt,RBTCAmount:RBTCAmount,confirmationTime:confirmationTime,
        address:address,amount:amount,platform_fee_value:platform_fee_value,
        blockNumber:blockNumber,wallet_value:wallet_value,interests:interests,
        tx_hash_truncate:tx_hash_truncate,tx_hash:tx_hash,gas_fee:gas_fee,price:price,
        wallet_value_main:wallet_value_main,leverage:leverage
    }

}

export const toNumberFormat = (value, decimals = 0) => {
    if (isNaN(Number(value))) value = 0;
    return Number(value).toLocaleString(navigator.language, {
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals,
    });
}

export const set_doc_usd= (auth) =>{
    if (auth.userBalanceData) {
        const doc_usd= new BigNumber(auth.userBalanceData['docBalance'])
        const doc= (auth.userBalanceData['docBalance']/auth.contractStatusData.bitcoinPrice).toFixed(6);
        return {'normal':doc,'usd':doc_usd}
    }else{
        return {'normal':(0).toFixed(6),'usd':(0).toFixed(2)}
    }
};

export const myParseDate = date_string => {
    let [y,M,d,h,m,s] = date_string.split(/[- :T]/);
    return new Date(y,parseInt(M)-1,d,h,parseInt(m),s.replace('Z',''));
}

export const dateFU= (date_u)=>{
    return (new Date(date_u * 1000).toISOString().slice(0, 19).replace('T', ' '));
}


export function readJsonTableFastBtcPegOut(data_j){

    const hash_id= (data_j.transferId!==undefined)? data_j.transferId : '--'
    const hash_id_cut= (data_j.transferId!==undefined)? data_j.transferId?.slice(0, 5)+'...'+ data_j.transferId?.slice(-4) : '--'
    const status= (data_j.status!==undefined)? (data_j.status==3)? 'Confirmed' : 'Failed' : '--'
    // const btcAmount= (data_j.amountSatoshi!==undefined)? data_j.amountSatoshi : '--'
    const btcAmount= (data_j.amountSatoshi!==undefined)? parseFloat(data_j.amountSatoshi/100000000).toFixed(6) : 0
    // const btcFee= (data_j.feeSatoshi!==undefined)? data_j.feeSatoshi : '--'
    const btcFee= (data_j.feeSatoshi!==undefined)? parseFloat(data_j.feeSatoshi/100000000).toFixed(6) : 0
    const btcAddressCut= (data_j.btcAddress!==undefined)? data_j.btcAddress?.slice(0, 5)+'...'+ data_j.btcAddress?.slice(-4) : '--'
    const btcAddress= (data_j.btcAddress!==undefined)? data_j.btcAddress : '--'
    const date= (data_j.updated!==undefined)? data_j.updated : '--'
    const timestamp= (data_j.timestamp!==undefined)? data_j.timestamp : '--'
    const transactionHash= (data_j.transactionHash!==undefined)? data_j.transactionHash : '--'
    const transactionHashCut= (data_j.transactionHash!==undefined)? data_j.transactionHash?.slice(0, 5)+'...'+ data_j.transactionHash?.slice(-4) : '--'
    const blockNumber= (data_j.blockNumber!==undefined)? data_j.blockNumber : '--'
    const rskAddress= (data_j.rskAddress!==undefined)? data_j.rskAddress : '--'
    const rskAddressCut= (data_j.rskAddress!==undefined)? data_j.rskAddress?.slice(0, 5)+'...'+ data_j.rskAddress?.slice(-4) : '--'

    return {
        hashId:hash_id,status:status, btcAmount:btcAmount,btcFee:btcFee,timestamp:timestamp,
        btcAddress:btcAddress,date:date,hash_id_cut:hash_id_cut,btcAddressCut:btcAddressCut,transactionHash:transactionHash,
        transactionHashCut:transactionHashCut,blockNumber:blockNumber,rskAddress:rskAddress,rskAddressCut:rskAddressCut
    }

}

export function setToLocaleString(value,fixed,i18n){
    return (Number(value)).toLocaleString(formatLocalMap2[i18n.languages[0]], {
        minimumFractionDigits: fixed,
        maximumFractionDigits: fixed
    });
}



export function readJsonClaims(data_j,t, i18n){

    const set_asset= 'CLAIM';
    const mocs= (data_j.mocs!==undefined)? setToLocaleString(parseFloat(Web3.utils.fromWei(setNumber(data_j.mocs)), 'Kwei'),2,i18n)  : '--'
    // const mocs= DetailedLargeNumber({
    //     amount: data_j.mocs,
    //     currencyCode: 'MOC',
    //     includeCurrency: true,
    //     isPositive: true,
    //     showSign: true,
    //     amountUSD: data_j.USDAmount ? data_j.USDAmount : 0,
    //     showUSD: true,
    //     t: t,
    //     i18n:i18n
    // })
    const creation= (data_j.creation!==undefined)? data_j.creation: '--'
    const state= StatusReward({ state: data_j.state, result: data_j.result })
    const sent_hash= (data_j.sent_hash!==null)? data_j.sent_hash: '--'
    const truncate_sent_hash= (data_j.sent_hash)? data_j.sent_hash.substring(0, 6) + '...' + data_j.sent_hash.substring(data_j.sent_hash.length - 4, data_j.sent_hash.length) : '--'
    const truncate_hash= (data_j.hash)? data_j.hash.substring(0, 6) + '...' + data_j.hash.substring(data_j.hash.length - 4, data_j.hash.length) : '--'
    const hash= (data_j.hash!==undefined)? data_j.hash: '--'
    const gas_cost= DetailedLargeNumber({
        amount: data_j.value,
        currencyCode: 'RESERVE',
        includeCurrency: true,
        amountUSD: data_j.gasFeeUSD ? data_j.gasFeeUSD : 0,
        showUSD: true,
        t: t,
        i18n:i18n
    })

    return {set_asset:set_asset,

        mocs:mocs,creation:creation,state:state,sent_hash:sent_hash,truncate_sent_hash:truncate_sent_hash,
        truncate_hash:truncate_hash,hash:hash,gas_cost:gas_cost
    }

}

const StatusReward = ({ state, result }) => {
    let textToRender = '';
    let colorToRender;
    if (result === 'ok' && state === 'complete') {
        textToRender = 'Sent';
        colorToRender = 'color-confirmed'
    } else if (!result && state === 'new') {
        textToRender = 'Confirming';
        colorToRender = 'color-confirming'
    } else if (!result && (state === 'confirmed' || state === 'sent')) {
        textToRender = 'Processing';
        colorToRender = 'color-pending'
    } else if (result !== 'ok' && result !== '') {
        textToRender = 'Failed';
        colorToRender = 'color-failed'
    }

    return (
        <div>
            <div className="tx-status">
                <span className={`${colorToRender}`}>{textToRender}</span>
            </div>
        </div>
    );
};

export function getRewardedToday(daily_moc, user_balance_bproBalance, total_bpro){
    const set_daily_moc= new BigNumber(web3.utils.fromWei(daily_moc.toString()))
    const set_user_balance_bproBalance= new BigNumber(web3.utils.fromWei(user_balance_bproBalance.toString()))
    const set_total_bpro= new BigNumber(web3.utils.fromWei(total_bpro.toString()))

    return new BigNumber((set_daily_moc).multipliedBy(set_user_balance_bproBalance)).div(set_total_bpro).multipliedBy(0.6)
}
