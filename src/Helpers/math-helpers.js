// import { bignumber } from 'mathjs';
import bignumber from 'bignumber.js';
import { Unit } from 'web3-utils';

export const normalizeWei = (amount) => {
  return roundToSmaller(amount, 0);
};

export const weiToFixed = (amount, decimals = 0) => {
  return roundToSmaller(bignumber(fromWei(amount, 'ether')), decimals);
};

export const weiTo18 = (amount) => weiToFixed(amount, 18);

export const weiTo4 = (amount) => weiToFixed(amount, 4);

export const weiTo2 = (amount) => weiToFixed(amount, 2);

export const weiToBigInt = (amount) => {
  if (amount) {
    return `${amount.split('.')[0]}.${
      amount.split('.')[1] ? amount.split('.')[1].slice(0, 18) : '0'
    }`;
  }
  return '0';
};

export const roundToSmaller = (amount, decimals) => {
  if (amount === Infinity) {
    amount = '0';
  }
  const bn = bignumber(amount || '0');
  let [integer, decimal] = bn.toFixed(128).split('.');

  if (decimal && decimal.length) {
    decimal = decimal.substr(0, decimals);
  } else {
    decimal = '0'.repeat(decimals);
  }

  if (decimal.length < decimals) {
    decimal = decimal + '0'.repeat(decimals - decimal.length);
  }

  if (decimal !== '') {
    return `${integer}.${decimal}`;
  }
  return `${integer}`;
};

export const fromWei = (amount, unit= 'ether') => {
  let decimals = 0;
  switch (unit) {
    case 'ether':
      decimals = 18;
      break;
    case 'gwei':
      decimals = 9;
      break;
    default:
      throw new Error('Unsupported unit (custom fromWei helper)');
  }

  return roundToSmaller(bignumber(amount || '0').div(10 ** decimals), decimals);
};

export const numberFromWei = (amount, unit = 'ether') => {
  return Number(fromWei(amount, unit));
};

export const toWei = (amount, unit = 'ether') => {
  let decimals = 0;
  switch (unit) {
    case 'ether':
      decimals = 18;
      break;
    default:
      throw new Error('Unsupported unit (custom fromWei helper)');
  }

  return roundToSmaller(bignumber(amount || '0').mul(10 ** decimals), 0);
};

export const trimZero = (amount) => {
  return amount.replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1');
};

export const btcInSatoshis = 100000000;

// https://github.com/DistributedCollective/FastBTC/blob/development/config/config-main.js#L15
export const DEPOSIT_FEE_SATS = 5000;

// hardcoded 0.2% dynamic fee
// https://github.com/DistributedCollective/FastBTC/blob/development/controller/rskCtrl.js#L64
export const DEPOSIT_FEE_DYNAMIC = 20;

// https://github.com/DistributedCollective/bidirectional-fastbtc/blob/master/packages/fastbtc-contracts/contracts/FastBTCBridge.sol#L105
export const DYNAMIC_FEE_DIVISOR = 10000;


export const toNumberFormat = (value, decimals = 0) => {
  if (isNaN(Number(value))) value = 0;
  return Number(value).toLocaleString(navigator.language, {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  });
}

export function weiToNumberFormat(value, decimals = 0) {
  return toNumberFormat(Number(fromWei(value || '0')), decimals);
};