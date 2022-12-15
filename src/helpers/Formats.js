import { config } from '../projects/config';
import {getDecimals} from "./helper";
import BigNumber from "bignumber.js";
const precisions = config.Precisions;

const formatLocalMap = {
    es: {
        decimalSeparator: ',',
        groupSeparator: '.'
    },
    en: {
        decimalSeparator: '.',
        groupSeparator: ','
    }
};

const formatLocalMap2 = {
    es: 'es',
    en: 'en'
};

// default format
BigNumber.config({
    FORMAT: formatLocalMap.en
});

const formatMap = {
    TX: precisions.RBTCPrecision,
    TC: precisions.RBTCPrecision,
    TP: precisions.USDPrecision,
    USD: precisions.USDPrecision,
    USDPrice: precisions.PriceUSDPrecision,
    RESERVE: precisions.RBTCPrecision,
    TG: precisions.mocPrecision,
    MOCMetrics: precisions.COVPrecision,
    REWARD: precisions.REWARDPrecision,
    COV: precisions.COVPrecision,
    LEV: precisions.COVPrecision,
    percentage: precisions.percentagePrecision,
    visiblePercentage: precisions.visiblePercentage,
    TXInterest: precisions.TXInterest,
    FreeDocInterest: precisions.FreeDocInterest,
    commissionRate: precisions.commissionRate,
    valueVariation: precisions.valueVariation
};

const precision = ({ contractDecimals }) =>
    new BigNumber(10).exponentiatedBy(contractDecimals);

const formatValue = (amount, currencyCode, format, decimals) => {
    const fd = formatMap[currencyCode];
    return formatValueFromMap(amount, fd, format, getDecimals(currencyCode));
};

const formatValueFromMap = (amount, mapEntry, format, decimals) => {
    if(decimals!==undefined){
        return BigNumber(amount)
            .div(precision(mapEntry))
            .toFormat(parseInt(decimals), BigNumber.ROUND_DOWN, format);
    }else{
        return BigNumber(amount)
            .div(precision(mapEntry))
            .toFormat(decimals || mapEntry.decimals, BigNumber.ROUND_DOWN, format);
    }

};

const adjustPrecision = (amount, currencyCode,AppProject) => {
    // return false
    const fd = formatMap[currencyCode];
    return fd
        ? {
              value: new BigNumber(amount).div(precision(fd)),
              // decimals: fd.decimals
              decimals: getDecimals(currencyCode,AppProject)
          }
        : { value: new BigNumber(amount), decimals: 2 };
};

const formatVisibleValue = (amount, currencyCode, language, decimals) => {
    if (amount === null || amount === undefined) return '-';
    const num = formatValue(
        amount,
        currencyCode,
        formatLocalMap[language],
        decimals
    );
    return num;
};

const formatValueVariation = (amount, language, auth) => {
    if (!amount) return '-';
    const fd = formatMap['valueVariation'];
    const num = formatValueFromMap(amount, fd, formatLocalMap[language],(auth.getAppMode==='MoC')? 2:4);
    return num;
};

/*
const formatDecimalRatioAsPercent = (amount) =>
    Number.isNaN(amount) ? 0 : amount * 100;
*/

const formatValueWithContractPrecision = (amount, currencyCode) => {
    BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_DOWN });
    const fd = formatMap[currencyCode];
    return BigNumber(amount)
        .div(precision(fd))
        .toFormat(fd.contractDecimals, BigNumber.ROUND_DOWN);
};

const formatValueToContract = (amount, currencyCode) => {
    return new BigNumber(amount)
        .multipliedBy(precision(formatMap[currencyCode]))
        .toFixed(0);
};

export {
    formatValue,
    formatVisibleValue,
    formatValueVariation,
    formatValueToContract,
    formatValueWithContractPrecision,
    adjustPrecision,
    precision,
    formatLocalMap,
    formatLocalMap2
};
