const BigNumber = require('bignumber.js');

const NumberFormat = {
    contractDecimals: 18,
    decimals: 6
};

const formatMap = {
    RISKPROX: NumberFormat,
    RISKPRO: NumberFormat,
    STABLE: NumberFormat,
    USD: NumberFormat,
    USDPrice: NumberFormat,
    RESERVE: NumberFormat,
    MOC: NumberFormat,
    REWARD: NumberFormat,
    COV: NumberFormat,
    LEV: NumberFormat,
    percentage: NumberFormat,
    visiblePercentage: NumberFormat,
    RISKPROXInterest: NumberFormat,
    FreeDocInterest: NumberFormat,
    commissionRate: NumberFormat,
    valueVariation: NumberFormat
};

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

const precision = ({ contractDecimals }) =>
    new BigNumber(10).exponentiatedBy(contractDecimals);

const formatValue = (amount, currencyCode, format, decimals) => {
    const fd = formatMap[currencyCode];
    return formatValueFromMap(amount, fd, format, decimals);
};

const formatValueFromMap = (amount, mapEntry, format, decimals) => {
    return BigNumber(amount)
        .div(precision(mapEntry))
        .toFormat(decimals || mapEntry.decimals, BigNumber.ROUND_DOWN, format);
};

const formatVisibleValue = (amount, currencyCode, language, decimals) => {
    if (amount === null || amount === undefined || !currencyCode) return '-';
    const num = formatValue(
        amount,
        currencyCode,
        formatLocalMap[language],
        decimals
    );
    return num;
};

const formatValueToContract = (amount, currencyCode) => {
    return new BigNumber(amount)
        .multipliedBy(precision(formatMap[currencyCode]))
        .toFixed(0);
};

const formatValueWithContractPrecision = (amount, currencyCode) => {
    BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_DOWN });
    const fd = formatMap[currencyCode];
    return BigNumber(amount)
        .div(precision(fd))
        .toFormat(fd.contractDecimals, BigNumber.ROUND_DOWN);
};

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
    return isNaN(convertedAmount) ? '' : convertedAmount.toString();
};

export {
    formatVisibleValue,
    formatValueToContract,
    formatValueWithContractPrecision,
    convertAmount
};
