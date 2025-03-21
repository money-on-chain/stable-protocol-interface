/* eslint-disable default-case */
import Web3 from 'web3';
import moment from 'moment';
import BigNumber from 'bignumber.js';

import { config } from '../projects/config';
import {
    DetailedLargeNumber,
    getExplainByEvent
} from '../components/LargeNumber';
import {formatLocalMap2, formatValueToContract} from './Formats';

const ns = config.environment.AppProject.toLowerCase();
const AppProject = config.environment.AppProject;

export function setNumber(number) {
    const strNumber = number.toString();
    if (strNumber.indexOf('.') !== -1) {
        const result = strNumber.indexOf('.');
        const result2 = strNumber.substring(0, result);
        return result2;
    } else {
        return strNumber;
    }
}

export function getDatasMetrics(auth, i18n = null) {
    if (auth.userBalanceData) {
        if (auth.userBalanceData) {
            const globalCoverage = Number(
                Web3.utils.fromWei(
                    setNumber(auth.contractStatusData['globalCoverage']),
                    'ether'
                )
            ).toFixed(4);
            const globalCoverageTooltip = Number(
                Web3.utils.fromWei(
                    setNumber(auth.contractStatusData['globalCoverage']),
                    'ether'
                )
            );
            const globalCoverageClean = Number(
                auth.contractStatusData['globalCoverage']
            ).toFixed(4);

            let btcx_x2Leverage = parseFloat(
                Web3.utils.fromWei(
                    setNumber(auth.contractStatusData['x2Leverage']),
                    'ether'
                )
            ).toFixed(6);
            if (i18n != null) {
                btcx_x2Leverage = setToLocaleString(
                    parseFloat(
                        Web3.utils.fromWei(
                            setNumber(auth.contractStatusData['x2Leverage'])
                        ),
                        'ether'
                    ),
                    4,
                    i18n
                );
            }

            const blocksToSettlement =
                auth.contractStatusData['blocksToSettlement'];
            const blockHeight = auth.contractStatusData['blockHeight'];
            const paused = auth.contractStatusData['paused'];

            return {
                globalCoverage: globalCoverage,
                globalCoverageTooltip: globalCoverageTooltip,
                x2Leverage: btcx_x2Leverage,
                blocksToSettlement: blocksToSettlement,
                blockHeight: blockHeight,
                paused: paused,
                globalCoverageClean: globalCoverageClean
            };
        } else {
            return {
                globalCoverage: 0,
                globalCoverageTooltip: 0,
                interest: 0,
                interestTooltip: 0,
                x2Leverage: 0,
                x2Coverage: 0,
                bprox2AvailableToMint: 0,
                liquidity_interest: 0,
                blocksToSettlement: 0,
                blockHeight: 0,
                paused: false,
                globalCoverageClean: 0
            };
        }
    } else {
        return {
            globalCoverage: 0,
            globalCoverageTooltip: 0,
            interest: 0,
            interestTooltip: 0,
            x2Leverage: 0,
            x2Coverage: 0,
            bprox2AvailableToMint: 0,
            liquidity_interest: 0,
            blocksToSettlement: 0,
            blockHeight: 0,
            paused: false,
            globalCoverageClean: 0
        };
    }
}

export function TokenNameOldToNew(tokenName) {
    let token = '';
    switch (tokenName) {
        case 'STABLE':
            token = 'TP';
            break;
        case 'RISKPRO':
            token = 'TC';
            break;
        case 'RISKPROX':
            token = 'TX';
            break;
        case 'MOC':
            token = 'TG';
            break;
        case 'TP':
            token = 'TP';
            break;
        case 'TC':
            token = 'TC';
            break;
        case 'TX':
            token = 'TX';
            break;
        case 'TG':
            token = 'TG';
            break;
        case 'RESERVE':
            token = 'RESERVE';
            break;
        default:
            throw new Error('Invalid token name');
    }

    return token;
}

export function TokenNameNewToOld(tokenName) {
    let token = '';
    switch (tokenName) {
        case 'TP':
            token = 'STABLE';
            break;
        case 'TC':
            token = 'RISKPRO';
            break;
        case 'TX':
            token = 'RISKPROX';
            break;
        case 'TG':
            token = 'MOC';
            break;
        case 'all':
            token = 'all';
            break;
        default:
            throw new Error('Invalid token name');
    }

    return token;
}

export function readJsonTable(data_j, t, i18n) {
    var set_event = 'TRANSFER';
    if (data_j.event.includes('Mint')) {
        set_event = 'MINT';
    }
    if (data_j.event.includes('Settlement')) {
        set_event = 'SETTLEMENT';
    }
    if (data_j.event.includes('Redeem')) {
        set_event = 'REDEEM';
    }
    if (data_j.event.includes('ERROR')) {
        set_event = 'FAILED';
    }

    if (data_j.tokenInvolved && data_j.tokenInvolved !== 'N/A') {
        data_j.tokenInvolved = TokenNameOldToNew(data_j.tokenInvolved);
    } else {
        data_j.tokenInvolved = 'N/A';
    }

    const set_asset = data_j.tokenInvolved;

    const set_status_txt = data_j.status;
    const set_status_percent = data_j.confirmingPercent;

    const wallet_detail =
        data_j.userAmount !== undefined
            ? parseFloat(data_j.userAmount).toFixed(6)
            : '--';
    const wallet_detail_usd = (wallet_detail * config.coin_usd).toFixed(2);
    const platform_detail = DetailedLargeNumber({
        amount: data_j.amount,
        currencyCode: data_j.tokenInvolved,
        includeCurrency: true,
        isPositive: data_j.isPositive,
        showSign: true,
        amountUSD: data_j.USDAmount ? data_j.USDAmount : 0,
        showUSD: false,
        t: t,
        i18n: i18n
    });
    const platform_detail_usd = (platform_detail * config.coin_usd).toFixed(2);
    const truncate_address = data_j.address
        ? data_j.address.substring(0, 6) +
          '...' +
          data_j.address.substring(
              data_j.address.length - 4,
              data_j.address.length
          )
        : '--';
    const truncate_txhash =
        data_j.transactionHash !== undefined
            ? data_j.transactionHash.substring(0, 6) +
              '...' +
              data_j.transactionHash.substring(
                  data_j.transactionHash.length - 4,
                  data_j.transactionHash.length
              )
            : '--';

    const lastUpdatedAt = data_j.createdAt
        ? moment(data_j.createdAt).format('YYYY-MM-DD HH:mm:ss')
        : '--';
    const RBTCAmount = getExplainByEvent({
        event: data_j.event,
        amount: DetailedLargeNumber({
            amount: data_j.amount,
            currencyCode: data_j.tokenInvolved,
            includeCurrency: true,
            t: t,
            i18n: i18n
        }),
        amount_rbtc: DetailedLargeNumber({
            amount: data_j.RBTCTotal ? data_j.RBTCTotal : data_j.RBTCAmount,
            currencyCode: 'RESERVE',
            includeCurrency: true,
            t: t,
            i18n: i18n
        }),
        status: data_j.status,
        token_involved: t(`${AppProject}Tokens_${data_j.tokenInvolved}_code`, {
            ns: ns
        }),
        t: t,
        i18n: i18n
    });
    const confirmationTime = data_j.confirmationTime;
    const address = data_j.address != '' ? data_j.address : '--';
    const amount = DetailedLargeNumber({
        amount: data_j.amount,
        currencyCode: data_j.tokenInvolved,
        includeCurrency: true,
        isPositive: data_j.isPositive,
        showSign: true,
        amountUSD: data_j.USDAmount ? data_j.USDAmount : 0,
        showUSD: true,
        t: t,
        i18n: i18n
    });

    const platform_fee_value = DetailedLargeNumber({
        amount: new BigNumber(data_j.rbtcCommission).gt(0)
            ? data_j.rbtcCommission
            : data_j.mocCommissionValue,
        currencyCode: new BigNumber(data_j.rbtcCommission).gt(0)
            ? 'RESERVE'
            : 'TG',
        includeCurrency: true,
        amountUSD: data_j.USDCommission ? data_j.USDCommission : 0,
        showUSD: true,
        t: t,
        i18n: i18n
    });

    const blockNumber =
        data_j.blockNumber !== undefined ? data_j.blockNumber : '--';

    let wallet_amount = new BigNumber(0)
    if (data_j.event.includes('Mint')) {
        wallet_amount = data_j.RBTCAmount && data_j.rbtcCommission ? new BigNumber(Web3.utils.fromWei(data_j.RBTCAmount))
            .plus(new BigNumber(Web3.utils.fromWei(data_j.rbtcCommission))) : new BigNumber(0)
    } else if (data_j.event.includes('Redeem')) {
        wallet_amount = data_j.RBTCAmount && data_j.rbtcCommission ? new BigNumber(Web3.utils.fromWei(data_j.RBTCAmount))
            .minus(new BigNumber(Web3.utils.fromWei(data_j.rbtcCommission))) : new BigNumber(0)
    }

    const wallet_amount_usd = data_j.reservePrice ? wallet_amount
        .multipliedBy(new BigNumber(Web3.utils.fromWei(data_j.reservePrice))) : new BigNumber(0)

    const wallet_value = DetailedLargeNumber({
        amount: formatValueToContract(wallet_amount, 'RESERVE'),
        currencyCode: 'RESERVE',
        includeCurrency: true,
        isPositive: !data_j.isPositive,
        showSign: true,
        amountUSD: formatValueToContract(wallet_amount_usd, 'RESERVE'),
        showUSD: true,
        t: t,
        i18n: i18n
    });

    const interests = DetailedLargeNumber({
        amount: data_j.rbtcInterests,
        currencyCode: 'RESERVE',
        includeCurrency: true,
        amountUSD: data_j.USDInterests ? data_j.USDInterests : 0,
        showUSD: true,
        isPositive: data_j.event == 'RiskProxRedeem' ? false : true,
        showSign: data_j.event == 'RiskProxRedeem' ? true : undefined,
        infoDescription:
            data_j.event == 'RiskProxRedeem' ? 'Credit interest' : undefined,
        t: t,
        i18n: i18n
    });
    const tx_hash_truncate =
        data_j.transactionHash !== undefined ? truncate_txhash : '--';
    const tx_hash =
        data_j.transactionHash !== undefined ? data_j.transactionHash : '--';

    const gas_fee = DetailedLargeNumber({
        amount: data_j.gasFeeRBTC,
        currencyCode: 'RBTC',
        includeCurrency: true,
        amountUSD: data_j.gasFeeUSD ? data_j.gasFeeUSD : 0,
        showUSD: true,
        t: t,
        i18n: i18n
    });

    const price = DetailedLargeNumber({
        amount: data_j.reservePrice,
        currencyCode: 'USD',
        includeCurrency: true,
        t: t,
        i18n: i18n
    });

    const wallet_value_main = DetailedLargeNumber({
        amount: data_j.RBTCTotal ? data_j.RBTCTotal : data_j.RBTCAmount,
        currencyCode: 'RESERVE',
        includeCurrency: true,
        isPositive: !data_j.isPositive,
        showSign: true,
        amountUSD: data_j.USDTotal ? data_j.USDTotal : 0,
        showUSD: false,
        t: t,
        i18n: i18n
    });

    const leverage = DetailedLargeNumber({
        amount: data_j.leverage,
        currencyCode: data_j.tokenInvolved,
        t: t,
        i18n: i18n
    });

    return {
        set_event: set_event,
        set_asset: set_asset,
        set_status_txt: set_status_txt,
        set_status_percent: set_status_percent,
        wallet_detail: wallet_detail,
        wallet_detail_usd: wallet_detail_usd,
        platform_detail_usd: platform_detail_usd,
        platform_detail: platform_detail,
        truncate_address: truncate_address,
        truncate_txhash: truncate_txhash,
        lastUpdatedAt: lastUpdatedAt,
        RBTCAmount: RBTCAmount,
        confirmationTime: confirmationTime,
        address: address,
        amount: amount,
        platform_fee_value: platform_fee_value,
        blockNumber: blockNumber,
        wallet_value: wallet_value,
        interests: interests,
        tx_hash_truncate: tx_hash_truncate,
        tx_hash: tx_hash,
        gas_fee: gas_fee,
        price: price,
        wallet_value_main: wallet_value_main,
        leverage: leverage
    };
}

export const toNumberFormat = (value, decimals = 0) => {
    if (isNaN(Number(value))) value = 0;
    return Number(value).toLocaleString(navigator.language, {
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals
    });
};

/*
export const set_doc_usd= (auth) =>{
    if (auth.userBalanceData) {
        const doc_usd= new BigNumber(auth.userBalanceData['docBalance'])
        const doc= (auth.userBalanceData['docBalance']/auth.contractStatusData.bitcoinPrice).toFixed(6);
        return {'normal':doc, 'usd':doc_usd}
    }else{
        return {'normal':(0).toFixed(6), 'usd':(0).toFixed(2)}
    }
};
*/

export const myParseDate = (date_string) => {
    let [y, M, d, h, m, s] = date_string.split(/[- :T]/);
    return new Date(y, parseInt(M) - 1, d, h, parseInt(m), s.replace('Z', ''));
};

export const dateFU = (date_u) => {
    return new Date(date_u * 1000).toISOString().slice(0, 19).replace('T', ' ');
};

const setStatus = (status) => {
    let text = '';
    let colorClass = '';
    switch (status) {
        case 0: {
            text = 'Initializing';
            colorClass = 'color-default';
            break;
        }
        case 1: {
            text = 'Validating';
            colorClass = 'color-default';
            break;
        }
        case 2: {
            text = 'Pending';
            colorClass = 'color-pending';
            break;
        }
        case 3: {
            text = 'Confirmed';
            colorClass = 'color-confirmed';
            break;
        }
        case 4: {
            text = 'Refunded';
            colorClass = 'color-failed';
            break;
        }
    }

    let state = { text: text, colorClass: colorClass };
    return state;
};

export function setToLocaleString(value, fixed, i18n) {
    return Number(value).toLocaleString(formatLocalMap2[i18n.languages[0]], {
        minimumFractionDigits: fixed,
        maximumFractionDigits: fixed
    });
}

export function readJsonClaims(data_j, t, i18n) {
    const set_asset = 'CLAIM';
    const mocs = DetailedLargeNumber({
        amount: data_j.mocs,
        currencyCode: 'TG',
        includeCurrency: true,
        // isPositive: data_j.event == 'RiskProxRedeem' ? false : true,
        isPositive: true,
        showSign: true,
        amountUSD: data_j.gasFeeUSD ? data_j.gasFeeUSD : 0,
        showUSD: true,
        t: t,
        i18n: i18n
    });
    const creation = data_j.creation !== undefined ? data_j.creation : '--';
    const state = StatusReward({ state: data_j.state, result: data_j.result });
    const sent_hash = data_j.sent_hash !== null ? data_j.sent_hash : '--';
    const truncate_sent_hash = data_j.sent_hash
        ? data_j.sent_hash.substring(0, 6) +
          '...' +
          data_j.sent_hash.substring(
              data_j.sent_hash.length - 4,
              data_j.sent_hash.length
          )
        : '--';
    const truncate_hash = data_j.hash
        ? data_j.hash.substring(0, 6) +
          '...' +
          data_j.hash.substring(data_j.hash.length - 4, data_j.hash.length)
        : '--';
    const hash = data_j.hash !== undefined ? data_j.hash : '--';
    const gas_cost = DetailedLargeNumber({
        amount: data_j.value,
        currencyCode: 'RESERVE',
        includeCurrency: true,
        amountUSD: data_j.gasFeeUSD ? data_j.gasFeeUSD : 0,
        showUSD: true,
        t: t,
        i18n: i18n
    });

    return {
        set_asset: set_asset,
        mocs: mocs,
        creation: creation,
        state: state,
        sent_hash: sent_hash,
        truncate_sent_hash: truncate_sent_hash,
        truncate_hash: truncate_hash,
        hash: hash,
        gas_cost: gas_cost
    };
}

const StatusReward = ({ state, result }) => {
    let textToRender = '';
    let colorToRender;
    if (result === 'ok' && state === 'complete') {
        textToRender = 'Sent';
        colorToRender = 'color-confirmed';
    } else if (!result && state === 'new') {
        textToRender = 'Confirming';
        colorToRender = 'color-confirming';
    } else if (!result && (state === 'confirmed' || state === 'sent')) {
        textToRender = 'Processing';
        colorToRender = 'color-pending';
    } else if (result !== 'ok' && result !== '') {
        textToRender = 'Failed';
        colorToRender = 'color-failed';
    }

    return (
        <div>
            <div className="tx-status">
                <span className={`${colorToRender}`}>{textToRender}</span>
            </div>
        </div>
    );
};

export function getRewardedToday(
    daily_moc,
    user_balance_bproBalance,
    total_bpro,
    end_block_dt
) {
    if (!daily_moc) return { toGetToday: 0.0, toGetNow: 0.0, time_left: 0 };
    const set_daily_moc = new BigNumber(
        Web3.utils.fromWei(daily_moc.toString())
    );
    const set_user_balance_bproBalance = new BigNumber(
        Web3.utils.fromWei(user_balance_bproBalance.toString())
    );
    const set_total_bpro = new BigNumber(
        Web3.utils.fromWei(total_bpro.toString())
    );

    let start = new Date(end_block_dt);
    let now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    tomorrow.setUTCHours(0, 0, 0, 0);
    let datediff = Math.round((tomorrow - start) / (1000 * 24 * 60 * 60));
    tomorrow.setUTCHours(1, 0, 0, 0);
    let timediff = Math.round((tomorrow - start) / 1000);
    let time_left = (tomorrow.getTime() - now.getTime()) / 1000;
    let toGetToday = set_daily_moc.toNumber()
        ? set_daily_moc
              .multipliedBy(set_user_balance_bproBalance)
              .multipliedBy(datediff)
              .div(set_total_bpro)
              .multipliedBy(0.6)
        : 0;
    let toGetNow = toGetToday.multipliedBy((timediff - time_left) / timediff);

    return { toGetToday, toGetNow, time_left };
}

export function getCoinName(coin) {
    let currencies = {
        COINBASE: config.tokens.COINBASE.name,
        TP: config.tokens.TP.name,
        TC: config.tokens.TC.name,
        TX: config.tokens.TX.name,
        RESERVE: config.tokens.RESERVE.name,
        USDPrice: 'USD',
        TG: config.tokens.TG.name,
        USD: 'USD'
    };

    return currencies[coin];
}

export function getDecimals(coin, AppProject) {
    let decimals = {
        COINBASE: config.tokens.COINBASE.decimals,
        TP: config.tokens.TP.decimals,
        TC: config.tokens.TC.decimals,
        TX: config.tokens.TX.decimals,
        TG: config.tokens.TG.decimals,
        USDPrice: AppProject == 'MoC' ? 2 : 4,
        RESERVE: config.tokens.RESERVE.decimals,
        USD: 2,
        REWARD: config.Precisions.REWARDPrecision.decimals,
        DOC: 2,
        TXInterest: config.Precisions.TXInterest.decimals
    };

    return decimals[coin];
}

export function getSelectCoins(appMode) {
    switch (appMode) {
        case 'RRC20':
            return ['TC', 'TP', 'TG', 'RESERVE'];
        case 'MoC':
            return ['TC', 'TP', 'TG', 'RESERVE'];
        default:
            return ['TC', 'TP', 'TG', 'RESERVE'];
    }
}
