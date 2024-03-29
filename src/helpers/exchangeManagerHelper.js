import BigNumber from 'bignumber.js';

import {
    formatValueWithContractPrecision,
    formatValueToContract,
    precision,
    formatVisibleValue
} from './Formats';
import { getTransactionType } from './exchangeHelper';
import { config } from '../projects/config';

const RBTCPrecision = config.Precisions.RBTCPrecision;
const appMode = config.environment.AppMode;

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
    convertToken,
    vendorMarkup
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
        convertToken,
        vendorMarkup
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
    convertToken,
    vendorMarkup
) => {
    const { spendableBalance = '0', rbtcBalance = '0' } = userState || {};
    return getCommissionRateAndCurrency({
        currencyYouExchange: 'RESERVE',
        currencyYouReceive: tokenToMint,
        valueYouExchange: rbtcBalance,
        mocState,
        userState,
        convertToken,
        vendorMarkup
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
    convertToken,
    vendorMarkup
}) => {
    const { commissionRates = {} } = mocState || {};
    if (!convertToken) return {};

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
    ).plus(vendorMarkup);
    const commissionRateForRESERVE = BigNumber(
        commissionRates[
            getTransactionType(
                currencyYouExchange,
                currencyYouReceive,
                'RESERVE_COMMISSION'
            )
        ]
    ).plus(vendorMarkup);

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
    convertToken,
    vendorMarkup
) => {
    const usableReserveBalance = getUsableReserveBalance(
        currencyToMint,
        userState,
        mocState,
        convertToken,
        vendorMarkup
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
            if (appMode === 'RRC20') {
                const { maxReserveAllowedToMint } = mocState;

                const fluxMaxReserveAllowedToMint = convertToken(
                    'RESERVE',
                    currencyToMint,
                    maxReserveAllowedToMint
                );

                console.log('Max mintable balance');
                console.log('======================');
                console.log('Stable available to mint: ', formatVisibleValue(docAvailableToMint, 'TP', 'en', 2));
                console.log('Stable balance: ', formatVisibleValue(usableReserveBalanceInCurrencyToMint, 'TP', 'en', 2));
                console.log('Flux Max to mint: ', formatVisibleValue(fluxMaxReserveAllowedToMint, 'TP', 'en', 2));
                console.log();

                response = {
                    value: BigNumber.minimum(
                        docAvailableToMint,
                        usableReserveBalanceInCurrencyToMint,
                        fluxMaxReserveAllowedToMint
                    ),
                    display: BigNumber.minimum(
                        docAvailableToMint,
                        usableReserveBalanceInCurrencyToMint
                    ),
                    currency: 'TP'
                };
            } else {
                response = {
                    value: BigNumber.minimum(
                        docAvailableToMint,
                        usableReserveBalanceInCurrencyToMint
                    ),
                    display: BigNumber.minimum(
                        docAvailableToMint,
                        usableReserveBalanceInCurrencyToMint
                    ),
                    currency: 'TP'
                };
            }


            break;
        case 'TC':
            response = {
                value: usableReserveBalanceInCurrencyToMint,
                display: usableReserveBalanceInCurrencyToMint,
                currency: 'TC'
            };
            break;
        case 'TX':
            response = {
                value: BigNumber.minimum(
                    bprox2AvailableToMint,
                    usableReserveBalanceInCurrencyToMint
                ),
                display: BigNumber.minimum(
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

const getMaxRedeemableBalance = (currencyToRedeem, userState, mocState, convertToken) => {
    const {
        bproBalance = 0,
        bprox2Balance = 0,
        docBalance = 0
    } = userState || {};
    const { docAvailableToRedeem, bproAvailableToRedeem } = mocState;
    let response;
    switch (currencyToRedeem) {
        case 'TP':
            if (appMode === 'RRC20') {
                const { maxReserveAllowedToRedeem } = mocState;

                const fluxMaxReserveAllowedToRedeem = convertToken(
                    'RESERVE',
                    currencyToRedeem,
                    maxReserveAllowedToRedeem
                );

                console.log('Max Redeemable Balance');
                console.log('======================');
                console.log('Stable available to redeem: ', formatVisibleValue(docAvailableToRedeem, 'TP', 'en', 2));
                console.log('Stable balance: ', formatVisibleValue(docBalance, 'TP', 'en', 2));
                console.log('Flux Max to redeem: ', formatVisibleValue(fluxMaxReserveAllowedToRedeem, 'TP', 'en', 2));
                console.log();

                response = {
                    value: BigNumber.minimum(docAvailableToRedeem, docBalance, fluxMaxReserveAllowedToRedeem),
                    display: BigNumber.minimum(docAvailableToRedeem, docBalance),
                    currency: 'TP'
                };
            } else {
                response = {
                    value: BigNumber.minimum(docAvailableToRedeem, docBalance),
                    display: BigNumber.minimum(docAvailableToRedeem, docBalance),
                    currency: 'TP'
                };
            }

            break;
        case 'TC':
            response = {
                value: BigNumber.minimum(bproAvailableToRedeem, bproBalance),
                display: BigNumber.minimum(bproAvailableToRedeem, bproBalance),
                currency: 'TC'
            };
            break;
        case 'TX':
            response = {
                value: bprox2Balance,
                display: bprox2Balance,
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
