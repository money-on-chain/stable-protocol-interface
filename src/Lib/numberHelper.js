const BigNumber = require('bignumber.js');

const toContract = number => new BigNumber(number).toFixed(0);

const toBigNumber = number => new BigNumber(number);

const minimum = BigNumber.minimum;

module.exports = { toContract, toBigNumber, minimum };
