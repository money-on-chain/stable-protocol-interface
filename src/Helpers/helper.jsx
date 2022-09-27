/* eslint-disable default-case */
import {config} from '../Config/config';
import Web3 from "web3";
import {DetailedLargeNumber, getExplainByEvent} from "../Components/LargeNumber";
import moment from 'moment';
import {formatLocalMap2} from "../Lib/Formats";
const BigNumber = require('bignumber.js');
const ns = config.environment.AppProject === 'MoC' ? 'moc' : 'rdoc';
const AppProject = config.environment.AppProject;

export function setNumber(number){
    if(number.indexOf(".")!==-1){
        const result = number.indexOf(".");
        const result2 = number.substring(0, result);
        return result2
    }else{
        return number
    }
}

export function getDatasMetrics(auth,i18n=null){
    if (auth.userBalanceData) {
        if (auth.userBalanceData) {
            const globalCoverage= Number(Web3.utils.fromWei(setNumber(auth.contractStatusData['globalCoverage']), 'ether')).toFixed(4)
            const globalCoverageTooltip = Number(Web3.utils.fromWei(setNumber(auth.contractStatusData['globalCoverage']), 'ether'));
            const globalCoverageClean= Number(auth.contractStatusData['globalCoverage']).toFixed(4)

            let btcx_x2Leverage= parseFloat(Web3.utils.fromWei(setNumber(auth.contractStatusData['x2Leverage']), 'ether')).toFixed(6);
            if(i18n!=null){
                btcx_x2Leverage= setToLocaleString(parseFloat(Web3.utils.fromWei(setNumber(auth.contractStatusData['x2Leverage'])), 'ether'),4,i18n)
            }

            const blocksToSettlement= (auth.contractStatusData['blocksToSettlement']);
            const blockHeight= (auth.contractStatusData['blockHeight']);
            const paused= (auth.contractStatusData['paused']);

            return {
                globalCoverage:globalCoverage,globalCoverageTooltip: globalCoverageTooltip,
                x2Leverage:btcx_x2Leverage,blocksToSettlement:blocksToSettlement,blockHeight:blockHeight,paused:paused,
                globalCoverageClean:globalCoverageClean
            };
        } else {
            return {globalCoverage: 0,globalCoverageTooltip: 0,
                    interest:0,interestTooltip:0,x2Leverage:0,x2Coverage:0,bprox2AvailableToMint:0,
                    liquidity_interest:0,blocksToSettlement:0,blockHeight:0,paused:false,
                    globalCoverageClean:0
            };
        }
    }else{
        return {globalCoverage:0,globalCoverageTooltip: 0,
                interest:0,interestTooltip:0,x2Leverage:0,x2Coverage:0,bprox2AvailableToMint:0,
                liquidity_interest:0,blocksToSettlement:0,blockHeight:0,paused:false,
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
    const truncate_address= (data_j.address)? data_j.address.substring(0, 6) + '...' + data_j.address.substring(data_j.address.length - 4, data_j.address.length) : '--'
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
        token_involved: t(`${AppProject}Tokens_${data_j.tokenInvolved}_code`, { ns: ns }),
        t: t,
        i18n:i18n
    })
    const confirmationTime= data_j.confirmationTime
    const address= (data_j.address !='')? data_j.address : '--'
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

const setStatus = (status) => {
    let text = '';
    let colorClass = '';
    switch (status) {
        case 0: {
            text = "Initializing";
            colorClass = "color-default";
            break;
        }
        case 1: {
            text = "Validating";
            colorClass = "color-default"
            break;
        }
        case 2: {
            text = "Pending";
            colorClass = "color-pending";
            break;
        }
        case 3: {
            text = "Confirmed";
            colorClass = "color-confirmed";
            break;
        }
        case 4: {
            text = "Refunded";
            colorClass = "color-failed";
            break;
        }
    }

    let state = {text: text, colorClass: colorClass};
    return state;
};

export function readJsonTableFastBtcPegOut(data_j){

    const hash_id= (data_j.transferId!==undefined)? data_j.transferId : '--'
    const hash_id_cut= (data_j.transferId!==undefined)? data_j.transferId?.slice(0, 5)+'...'+ data_j.transferId?.slice(-4) : '--'
    // const status= (data_j.status!==undefined)? (data_j.status===3)? 'Confirmed' : 'Failed' : '--'
    const status = setStatus(data_j.status)
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
    const transactionHashLastUpdated = (data_j.transactionHashLastUpdated!==undefined)? data_j.transactionHashLastUpdated?.slice(0, 5)+'...'+ data_j.transactionHashLastUpdated?.slice(-4) : '--'

    return {
        hashId:hash_id,status:status?.text, statusColor: status?.colorClass, btcAmount:btcAmount,btcFee:btcFee,timestamp:timestamp,
        btcAddress:btcAddress,date:date,hash_id_cut:hash_id_cut,btcAddressCut:btcAddressCut,transactionHash:transactionHash,
        transactionHashCut:transactionHashCut,blockNumber:blockNumber,rskAddress:rskAddress,rskAddressCut:rskAddressCut, transactionHashLastUpdated:transactionHashLastUpdated
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
    const mocs= DetailedLargeNumber({
        amount: data_j.mocs,
        currencyCode: 'MOC',
        includeCurrency: true,
        // isPositive: data_j.event == 'RiskProxRedeem' ? false : true,
        isPositive: true,
        showSign: true,
        amountUSD: data_j.gasFeeUSD ? data_j.gasFeeUSD : 0,
        showUSD: true,
        t: t,
        i18n:i18n
    })
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

export function getRewardedToday(daily_moc, user_balance_bproBalance, total_bpro, end_block_dt){
    if (!daily_moc) return {toGetToday: 0.0, toGetNow: 0.0, time_left: 0}
    const set_daily_moc= new BigNumber(Web3.utils.fromWei(daily_moc.toString()))
    const set_user_balance_bproBalance= new BigNumber(Web3.utils.fromWei(user_balance_bproBalance.toString()))
    const set_total_bpro= new BigNumber(Web3.utils.fromWei(total_bpro.toString()))

    let start = new Date(end_block_dt);
    let now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    tomorrow.setUTCHours(0,0,0,0);
    let datediff = Math.round((tomorrow - start)/(1000*24*60*60));
    tomorrow.setUTCHours(1,0,0,0);
    let timediff = Math.round((tomorrow - start)/(1000));
    let time_left = (tomorrow.getTime() - now.getTime())/1000;
    let toGetToday = (set_daily_moc.toNumber())? set_daily_moc.multipliedBy(set_user_balance_bproBalance).multipliedBy(datediff).div(set_total_bpro).multipliedBy(0.6) : 0;
    let toGetNow  = toGetToday.multipliedBy((timediff-time_left)/(timediff));

    return {toGetToday, toGetNow, time_left}
}

export function getUSD(coin,value,auth,i18n=null){
    if (auth.contractStatusData) {
        switch (coin) {
            case 'STABLE':
                return  setToLocaleString(new BigNumber(1 * Web3.utils.fromWei(setNumber(value))),2,i18n)
            case 'RISKPRO':
                return  setToLocaleString(new BigNumber(Web3.utils.fromWei(auth.contractStatusData['bproPriceInUsd']) * Web3.utils.fromWei(setNumber(value))),2,i18n)
            case 'MOC':
                return setToLocaleString(new BigNumber(Web3.utils.fromWei(auth.contractStatusData['mocPrice']) * Web3.utils.fromWei(setNumber(value))),2,i18n)
            case 'RESERVE':
                return setToLocaleString(new BigNumber(Web3.utils.fromWei(auth.contractStatusData.bitcoinPrice) * Web3.utils.fromWei(setNumber(value))),2,i18n)
            case 'RISKPROX':
                return setToLocaleString(new BigNumber(Web3.utils.fromWei(auth.contractStatusData.bitcoinPrice, 'ether') * Web3.utils.fromWei(auth.contractStatusData['bprox2PriceInRbtc'], 'ether') * Web3.utils.fromWei(setNumber(value))),2,i18n)

        }
    }else{
        return 0
    }
}

export function getCoinName(coin){

    let currencies= {
        'COINBASE':config.environment.tokens.COINBASE.name,
        'STABLE':config.environment.tokens.STABLE.name,
        'RISKPRO':config.environment.tokens.RISKPRO.name,
        'RISKPROX':config.environment.tokens.RISKPROX.name,
        'RESERVE':config.environment.tokens.RESERVE.name,
        'USDPrice':'USD',
        'MOC':config.environment.tokens.MOC.name,
        'USD':'USD',
    }

    return currencies[coin]
}

export function getDecimals(coin,AppProject){
    let decimals= {
        'COINBASE':config.environment.tokens.COINBASE.decimals,
        'STABLE':config.environment.tokens.STABLE.decimals,
        'RISKPRO':config.environment.tokens.RISKPRO.decimals,
        'RISKPROX':config.environment.tokens.RISKPROX.decimals,
        'MOC':config.environment.tokens.MOC.decimals,
        'USDPrice': (AppProject=='MoC')? 2 : 4,
        'RESERVE':config.environment.tokens.RESERVE.decimals,
        'USD':2,
        'REWARD':config.environment.Precisions.REWARDPrecision.decimals,
        'DOC':2,
        'RISKPROXInterest':config.environment.Precisions.RISKPROXInterest.decimals
    }

    return decimals[coin]

}

export function getSelectCoins(appMode){
    switch (appMode) {
        case 'RRC20':
            return ['RISKPRO', 'STABLE', 'RESERVE']
        case 'MoC':
            return ['RISKPRO', 'STABLE', 'RESERVE']
        default:
            return ['RISKPRO', 'STABLE', 'RESERVE']
    }

}

