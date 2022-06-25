const BigNumber = require('bignumber.js');

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

const REWARDPrecision = {
    contractDecimals: 18,
    decimals: 6
};

const valueVariation = {
    contractDecimals: 20,
    decimals: 2
};

const mocPrecision = {
    contractDecimals: 18,
    decimals: 2
};

const RBTCPrecision = {
    contractDecimals: 18,
    decimals: 6
};

const USDPrecision = {
    contractDecimals: 18,
    decimals: 2
};

const PriceUSDPrecision = {
    contractDecimals: 18,
    decimals: 2
};

const COVPrecision = {
    contractDecimals: 18,
    decimals: 4
};

const percentagePrecision = {
    contractDecimals: 6,
    decimals: 0
};

const visiblePercentage = {
    contractDecimals: 0,
    decimals: 6
};

const RISKPROXInterest = {
    contractDecimals: 18,
    decimals: 6
};

const FreeDocInterest = {
    contractDecimals: 18,
    decimals: 2
};

const commissionRate = {
    contractDecimals: 18,
    decimals: 1
};

const formatMap = {
    RISKPROX: RBTCPrecision,
    RISKPRO: RBTCPrecision,
    STABLE: USDPrecision,
    USD: USDPrecision,
    USDPrice: PriceUSDPrecision,
    RESERVE: RBTCPrecision,
    MOC: mocPrecision,
    REWARD: REWARDPrecision,
    COV: COVPrecision,
    LEV: COVPrecision,
    percentage: percentagePrecision,
    visiblePercentage: visiblePercentage,
    RISKPROXInterest: RISKPROXInterest,
    FreeDocInterest: FreeDocInterest,
    commissionRate: commissionRate,
    valueVariation: valueVariation
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

const adjustPrecision = (amount, currencyCode) => {
    const fd = formatMap[currencyCode];
    return fd
        ? {
              value: new BigNumber(amount).div(precision(fd)),
              decimals: fd.decimals
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

const formatValueVariation = (amount, language) => {
    if (!amount) return '-';
    const fd = formatMap['valueVariation'];
    const num = formatValueFromMap(amount, fd, formatLocalMap[language]);
    return num;
};

const formatDecimalRatioAsPercent = (amount) =>
    Number.isNaN(amount) ? 0 : amount * 100;

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
const formatPerc = (value, language) =>
    Number.isNaN(value)
        ? '-'
        : parseFloat(Math.round(value * 100) / 100).toLocaleString(language, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
          });

export {
    formatValue,
    formatVisibleValue,
    formatValueVariation,
    formatValueToContract,
    formatValueWithContractPrecision,
    formatPerc,
    formatDecimalRatioAsPercent,
    adjustPrecision,
    RBTCPrecision,
    USDPrecision,
    COVPrecision,
    precision,
    formatLocalMap,
    formatLocalMap2
};
