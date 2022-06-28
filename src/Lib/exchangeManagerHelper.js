import {
  formatValueWithContractPrecision,
  formatValueToContract,
  precision,
  RBTCPrecision
} from './Formats';
import { toBigNumber, minimum } from './numberHelper';
import { getTransactionType } from './exchangeHelper';

const BigNumber = require('bignumber.js');

const convertAmount2222 = (source, target, amount, convertToken) => {
  console.log(source, target, amount);
  if (amount === '') {
    return '';
  }
  // if (TAPi18n.getLanguage() === 'es') {
  //   amount = amount.toLocaleString(TAPi18n.getLanguage());
  // }
  // const convertedAmount = formatValueWithContractPrecision(
  //   convertToken(source, target, formatValueToContract(amount, source)),
  //   target
  // );
  console.log('wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww11111111111111111111111111')
  console.log(convertToken(source, target, formatValueToContract(amount, source)))
  console.log('wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww11111111111111111111111111')
  const convertedAmount = formatValueWithContractPrecision(
      convertToken(source, target, formatValueToContract(amount, source)),
      target
  );
  console.log('convertedAmount', convertedAmount);
  const replacedDot = convertedAmount.replace(/\./g, '');
  console.log('replacedDot', replacedDot.replace(/\./g, ''))
  const replacedComma = replacedDot.replace(/,/g, '');
  console.log('replacedComma', replacedComma)
  console.log(isNaN(replacedComma))
  return isNaN(replacedComma) ? '' : replacedComma.toString();
  // console.log(isNaN(convertAmount));
  // return isNaN(convertedAmount) ? '' : convertedAmount.toString();
  // return isNaN(convertedAmount) ? '' : convertedAmount.toString();
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
  return convertedAmount === "NaN" ? '' : convertedAmount.toString();
};

const amountIsTooSmall = target => {
  const minorValue = BigNumber('0.0000000000000000001');
  return minorValue.gt(toBigNumber(target));
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
    potentialBprox2MaxInterest = 0,
  } = userState || {};
  const commission = getCommissionRateForMintingTotalAvailable(currencyToMint, mocState, userState, convertToken);
  const gasEstimation = gasMintingEstimation(
    currencyToMint,
    userState
  );

  const reserveCommisionValue = calcCommissionValue(rbtcBalance, commission.commissionRate);
  const spendableBalanceBn = toBigNumber(rbtcBalance);
  const mintingGasEstimation = gasEstimation !== undefined ? gasEstimation : 0;
  let available = spendableBalanceBn.minus(reserveCommisionValue).minus(mintingGasEstimation);
  if (currencyToMint === 'RISKPROX') {
   available
      .minus(potentialBprox2MaxInterest);
  }
  return BigNumber.maximum(0, available);
};

const gasMintingEstimation = (
  currencyToMint,
  userState
) => {
  const {
    estimateGasMintDoc = 0,
    estimateGasMintBpro = 0,
    estimateGasMintBprox2 = 0
  } = userState || {};

  switch (currencyToMint) {
    case 'STABLE':
      return estimateGasMintDoc;
    case 'RISKPRO':
      return estimateGasMintBpro;
    case 'RISKPROX':
      return estimateGasMintBprox2;
    default:
      return undefined;
  }
};

const getCommissionRateForMintingTotalAvailable = (tokenToMint, mocState, userState, convertToken) => {
  const {spendableBalance = '0', rbtcBalance = '0'} = userState || {};
  return getCommissionRateAndCurrency({
    currencyYouExchange: "RESERVE",
    currencyYouReceive: tokenToMint,
    valueYouExchange: rbtcBalance,
    mocState,
    userState,
    convertToken
  });
}

const canPayCommissionInMoc = (commissionValue, userState) => {
  return (enoughMOCBalance(commissionValue, userState) && enoughMOCAllowance(commissionValue, userState));
}

const enoughMOCAllowance = (commissionValue, userState) => {
  const { mocAllowance = '0' } = userState || {};
  return BigNumber(mocAllowance).gt(0) && BigNumber(mocAllowance).gte(commissionValue);
}

const enoughMOCBalance = (commissionValue, userState) => {
  const { mocBalance } = userState || {};
  return BigNumber(mocBalance).gte(commissionValue);
}
const getCommissionRateAndCurrency = ({currencyYouExchange, currencyYouReceive, valueYouExchange, mocState, userState, convertToken}) => {
  const {
    commissionRates = {}
  } = mocState || {};
  if(!convertToken) return {};
  
  const vendor = { address: "0xf69287F5Ca3cC3C6d3981f2412109110cB8af076", markup: "500000000000000" };

  const valueYouExchangeInRESERVE = convertToken(currencyYouExchange, "RESERVE", valueYouExchange);
  const valueYouExchangeInMOC = convertToken("RESERVE", "MOC", valueYouExchangeInRESERVE);
  const commissionRateForMOC = BigNumber(
    commissionRates[getTransactionType(currencyYouExchange, currencyYouReceive, "MOC_COMMISSION")])
    .plus(vendor.markup);
  const commissionRateForRESERVE = BigNumber(
    commissionRates[getTransactionType(currencyYouExchange, currencyYouReceive, "RESERVE_COMMISSION")])
    .plus(vendor.markup);

  const commissionValueIfPaidInMOC = commissionRateForMOC.times(valueYouExchangeInMOC).div(precision(RBTCPrecision));
  const canPayInMOC = (canPayCommissionInMoc(commissionValueIfPaidInMOC, userState));

  const commissionValueIfPaidInRESERVE = commissionRateForRESERVE.times(valueYouExchangeInRESERVE).div(precision(RBTCPrecision));
  const commissionYouPay = canPayInMOC ? commissionValueIfPaidInMOC : commissionValueIfPaidInRESERVE;

  return {
      commissionCurrency: canPayInMOC ? "MOC" : "RESERVE",
      commissionRate: canPayInMOC ? commissionRateForMOC : commissionRateForRESERVE,
      commissionYouPay: commissionYouPay,
      enoughMOCBalance: enoughMOCBalance(commissionValueIfPaidInMOC, userState)
  }
}

const getMaxMintableBalance = (currencyToMint, userState, mocState, convertToken) => {
  const usableReserveBalance = getUsableReserveBalance(
    currencyToMint,
    userState,
    mocState,
    convertToken
  );
  const {
    docAvailableToMint,
    bprox2AvailableToMint,
  } = mocState;
  const usableReserveBalanceInCurrencyToMint = convertToken("RESERVE", currencyToMint, usableReserveBalance);
  let response;
  switch (currencyToMint) {
    case 'STABLE':
      response = {
        value: minimum(docAvailableToMint,
                      usableReserveBalanceInCurrencyToMint),
        currency: "STABLE"
      };
      break;
    case 'RISKPRO':
      response = {
        value: usableReserveBalanceInCurrencyToMint,
        currency: "RISKPRO"
      };
      break;
    case 'RISKPROX':
      response = {
        value: minimum(bprox2AvailableToMint,
                      usableReserveBalanceInCurrencyToMint),
        currency: "RISKPROX"
      };
      break;
    default:
      response = undefined;
      break;
  }
  return response;
}

const getMaxRedeemableBalance = (currencyToRedeem, userState, mocState) => {
  const {
    bproBalance = 0,
    bprox2Balance = 0,
    docBalance = 0,
  } = userState || {};
  const {
    docAvailableToRedeem,
    bproAvailableToRedeem
  } = mocState;
  let response;
  switch (currencyToRedeem) {
    case 'STABLE':
      response = {
        value: minimum(docAvailableToRedeem, docBalance),
        currency: "STABLE"
      };
      break;
    case 'RISKPRO':
      response = {
        value: minimum(bproAvailableToRedeem, bproBalance),
        currency: "RISKPRO"
      }
      break;
    case 'RISKPROX':
      response = {
        value: bprox2Balance,
        currency: "RISKPROX"
      };
      break;
    default:
      response = undefined;
      break;
  }
  return response;
}

const isAmountBiggerThanMax = (amount, currency, maxAvailable) => {
  const bdInputAmount = toBigNumber(formatValueToContract(amount, currency));
  return !bdInputAmount.isNaN() && bdInputAmount.isGreaterThan(maxAvailable);
};
const isAmountZero = amount => amount.eq(BigNumber('0'));

export {
  convertAmount,
  isAmountBiggerThanMax,
  isAmountZero,
  getMaxMintableBalance,
  getMaxRedeemableBalance,
  amountIsTooSmall,
  getUsableReserveBalance,
  canPayCommissionInMoc,
  getCommissionRateAndCurrency,
};
