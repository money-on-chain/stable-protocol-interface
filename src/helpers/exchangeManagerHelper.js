import BigNumber from 'bignumber.js';

import {
    formatValueWithContractPrecision,
    formatValueToContract,
    precision
} from './Formats';
import { getTransactionType } from './exchangeHelper';
import { config } from '../projects/config';

const RBTCPrecision = config.Precisions.RBTCPrecision;

const convertAmount = (source, target, amount, convertToken) => {
    if (amount === '') {
        return '';
    }
    // if (TAPi18n.getLanguage() === 'es') {
    //   amount = amount.toLocaleString(TAPi18n.getLanguage());
    // }
    const convertedAmount = formatValueWithContractPrecision(
        convertToken(source, target, formatValueToContract(amount, source)),
        target
    );
    return convertedAmount === 'NaN' ? '' : convertedAmount.toString();
};

const amountIsTooSmall = (target) => {
    const minorValue = BigNumber('0.0000000000000000001');
    const isZero = new BigNumber(target).eq(0);
    return minorValue.gt(new BigNumber(target)) && !isZero;
};

const calcCommissionValue = (rbtcBalance, commissionRate) =>
    rbtcBalance * (commissionRate / precision(RBTCPrecision));

const getUsableReserveBalance = (
    currencyToMint,
    userState,
    mocState,
    convertToken
) => {
    const {
        rbtcBalance = 0,
        spendableBalance = 0,
        potentialBprox2MaxInterest = 0
    } = userState || {};
    const commission = getCommissionRateForMintingTotalAvailable(
        currencyToMint,
        mocState,
        userState,
        convertToken
    );
    const gasEstimation = gasMintingEstimation(currencyToMint, userState);

    const reserveCommisionValue = calcCommissionValue(
        rbtcBalance,
        commission.commissionRate
    );
    const spendableBalanceBn = new BigNumber(rbtcBalance);
    const mintingGasEstimation =
        gasEstimation !== undefined ? gasEstimation : 0;
    let available = spendableBalanceBn
        .minus(reserveCommisionValue)
        .minus(mintingGasEstimation);
    if (currencyToMint === 'TX') {
        available.minus(potentialBprox2MaxInterest);
    }
    return BigNumber.maximum(0, available);
};

const gasMintingEstimation = (currencyToMint, userState) => {
    const {
        estimateGasMintDoc = 0,
        estimateGasMintBpro = 0,
        estimateGasMintBprox2 = 0
    } = userState || {};

    switch (currencyToMint) {
        case 'TP':
            return estimateGasMintDoc;
        case 'TC':
            return estimateGasMintBpro;
        case 'TX':
            return estimateGasMintBprox2;
        default:
            return undefined;
    }
};

const getCommissionRateForMintingTotalAvailable = (
    tokenToMint,
    mocState,
    userState,
    convertToken
) => {
    const { spendableBalance = '0', rbtcBalance = '0' } = userState || {};
    return getCommissionRateAndCurrency({
        currencyYouExchange: 'RESERVE',
        currencyYouReceive: tokenToMint,
        valueYouExchange: rbtcBalance,
        mocState,
        userState,
        convertToken
    });
};

const canPayCommissionInMoc = (commissionValue, userState) => {
    return (
        enoughMOCBalance(commissionValue, userState) &&
        enoughMOCAllowance(commissionValue, userState)
    );
};

const enoughMOCAllowance = (commissionValue, userState) => {
    const { mocAllowance = '0' } = userState || {};
    return (
        BigNumber(mocAllowance).gt(0) &&
        BigNumber(mocAllowance).gte(commissionValue)
    );
};

const enoughMOCBalance = (commissionValue, userState) => {
    const { mocBalance } = userState || {};
    return BigNumber(mocBalance).gte(commissionValue);
};
const getCommissionRateAndCurrency = ({
    currencyYouExchange,
    currencyYouReceive,
    valueYouExchange,
    mocState,
    userState,
    convertToken
}) => {
    const { commissionRates = {} } = mocState || {};
    if (!convertToken) return {};

    // const vendor = { address: "0xf69287F5Ca3cC3C6d3981f2412109110cB8af076", markup: "500000000000000" };
    const vendor = config.environment.vendor;

    const valueYouExchangeInRESERVE = convertToken(
        currencyYouExchange,
        'RESERVE',
        valueYouExchange
    );
    const valueYouExchangeInMOC = convertToken(
        'RESERVE',
        'TG',
        valueYouExchangeInRESERVE
    );

    const commissionRateForMOC = BigNumber(
        commissionRates[
            getTransactionType(
                currencyYouExchange,
                currencyYouReceive,
                'TG_COMMISSION'
            )
        ]
    ).plus(vendor.markup);
    const commissionRateForRESERVE = BigNumber(
        commissionRates[
            getTransactionType(
                currencyYouExchange,
                currencyYouReceive,
                'RESERVE_COMMISSION'
            )
        ]
    ).plus(vendor.markup);

    const commissionValueIfPaidInMOC = commissionRateForMOC
        .times(valueYouExchangeInMOC)
        .div(precision(RBTCPrecision));
    const canPayInMOC = canPayCommissionInMoc(
        commissionValueIfPaidInMOC,
        userState
    );

    const commissionValueIfPaidInRESERVE = commissionRateForRESERVE
        .times(valueYouExchangeInRESERVE)
        .div(precision(RBTCPrecision));
    const commissionYouPay = canPayInMOC
        ? commissionValueIfPaidInMOC
        : commissionValueIfPaidInRESERVE;

    return {
        commissionCurrency: canPayInMOC ? 'TG' : 'RESERVE',
        commissionRate: canPayInMOC
            ? commissionRateForMOC
            : commissionRateForRESERVE,
        commissionYouPay: commissionYouPay,
        enoughMOCBalance: enoughMOCBalance(
            commissionValueIfPaidInMOC,
            userState
        )
    };
};

const getMaxMintableBalance = (
    currencyToMint,
    userState,
    mocState,
    convertToken
) => {
    const usableReserveBalance = getUsableReserveBalance(
        currencyToMint,
        userState,
        mocState,
        convertToken
    );
    const { docAvailableToMint, bprox2AvailableToMint } = mocState;
    const usableReserveBalanceInCurrencyToMint = convertToken(
        'RESERVE',
        currencyToMint,
        usableReserveBalance
    );
    let response;
    switch (currencyToMint) {
        case 'TP':
            response = {
                value: BigNumber.minimum(
                    docAvailableToMint,
                    usableReserveBalanceInCurrencyToMint
                ),
                currency: 'TP'
            };
            break;
        case 'TC':
            response = {
                value: usableReserveBalanceInCurrencyToMint,
                currency: 'TC'
            };
            break;
        case 'TX':
            response = {
                value: BigNumber.minimum(
                    bprox2AvailableToMint,
                    usableReserveBalanceInCurrencyToMint
                ),
                currency: 'TX'
            };
            break;
        default:
            response = undefined;
            break;
    }
    return response;
};

const getMaxRedeemableBalance = (currencyToRedeem, userState, mocState) => {
    const {
        bproBalance = 0,
        bprox2Balance = 0,
        docBalance = 0
    } = userState || {};
    const { docAvailableToRedeem, bproAvailableToRedeem } = mocState;
    let response;
    switch (currencyToRedeem) {
        case 'TP':
            response = {
                value: BigNumber.minimum(docAvailableToRedeem, docBalance),
                currency: 'TP'
            };
            break;
        case 'TC':
            response = {
                value: BigNumber.minimum(bproAvailableToRedeem, bproBalance),
                currency: 'TC'
            };
            break;
        case 'TX':
            response = {
                value: bprox2Balance,
                currency: 'TX'
            };
            break;
        default:
            response = undefined;
            break;
    }
    return response;
};

export {
    convertAmount,
    getMaxMintableBalance,
    getMaxRedeemableBalance,
    amountIsTooSmall,
    getUsableReserveBalance,
    canPayCommissionInMoc,
    getCommissionRateAndCurrency
};
