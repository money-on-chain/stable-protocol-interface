const BigNumber = require('bignumber.js');

const REWARDPrecision = {
    contractDecimals: 18,
    decimals: 6
};

const valueVariation = {
    contractDecimals: 20,
    decimals: 2,
};

const mocPrecision = {
    contractDecimals: 18,
    decimals: 2,
};

const RBTCPrecision = {
    contractDecimals: 18,
    decimals: 6,
};

const USDPrecision = {
    contractDecimals: 18,
    decimals: 2,
}

const PriceUSDPrecision = {
    contractDecimals: 18,
    decimals: 2,
}

const COVPrecision = {
    contractDecimals: 18,
    decimals: 4,
}

const percentagePrecision = {
    contractDecimals: 6,
    decimals: 0,
}

const visiblePercentage = {
    contractDecimals: 0,
    decimals: 6,
}

const RISKPROXInterest = {
    contractDecimals: 18,
    decimals: 6,
}

const FreeDocInterest = {
    contractDecimals: 18,
    decimals: 2,
}

const commissionRate = {
    contractDecimals: 18,
    decimals: 1,
}

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

const formatLocalMap2 = {
    es: 'es',
    en: 'en'
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

const adjustPrecision = (amount, currencyCode) => {
    const fd = formatMap[currencyCode];
    return fd
        ?   {
                value: new BigNumber(amount).div(precision(fd)),
                decimals: fd.decimals
            }
        :   { value: new BigNumber(amount), decimals: 2};
};
const formatValue = (amount, currencyCode, format, decimals) => {
    const fd = formatMap[currencyCode];
    return formatValueFromMap(amount, fd, format, decimals);
};

const formatValueFromMap = (amount, mapEntry, format, decimals) => {
    console.log(amount, mapEntry, format, decimals);
    console.log('formatValueFromMap', BigNumber(amount)
    .div(precision(mapEntry))
    .toFormat(decimals || mapEntry.decimals, BigNumber.ROUND_DOWN, format));
    return BigNumber(amount)
        .div(precision(mapEntry))
        .toFormat(decimals || mapEntry.decimals, BigNumber.ROUND_DOWN, format);
};

const formatVisibleValue = (amount, currencyCode, language, decimals) => {
    if (amount === null || amount === undefined || !currencyCode) return '-';
    console.log('formatVisibleValue', amount, currencyCode, language, decimals);
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

const formatValueToContract = (amount, currencyCode) => {
    console.log(amount, currencyCode, formatMap[currencyCode]);
    console.log('formatValueToContract', new BigNumber(amount)
    .multipliedBy(precision(formatMap[currencyCode]))
    .toFixed(0));
    return new BigNumber(amount).multipliedBy(precision(formatMap[currencyCode])).toFixed(0);
    /* if (currencyCode === 'RESERVE') {
        return new BigNumber(amount)
        .multipliedBy(precision(formatMap[currencyCode]))
        .toFixed(0);
    } else {
        return amount;
    } */
    // return amount;
};

const formatValueWithContractPrecision = (amount, currencyCode) => {
    BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_DOWN });
    const fd = formatMap[currencyCode];
    console.log('amount', amount, 'bignumber', BigNumber(amount)
    .div(precision(fd))
    .toFormat(fd.contractDecimals, BigNumber.ROUND_DOWN));
    if (fd) {
        return BigNumber(amount)
            .div(precision(fd))
            .toFormat(fd.contractDecimals, BigNumber.ROUND_DOWN);
    }
    return null;
};

/* const convertAmount = (source, target, amount, convertToken) => {
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
}; */

const formatPerc = (value, language) =>
    Number.isNaN(value) ? '-' : parseFloat(Math.round(value * 100) / 100).toLocaleString(language, {minimumFractionDigits:2, maximumFractionDigits:2});


export {
    formatLocalMap,
    adjustPrecision,
    formatVisibleValue,
    formatValueVariation,
    formatValueToContract,
    formatValueWithContractPrecision,
    // convertAmount,
    formatPerc,
    RBTCPrecision,
    precision,
    formatLocalMap2,
};
