/* eslint-disable import/no-anonymous-default-export */
import rskUtils from 'rskjs-util';

const forceChecksumAddressInput = true;
const forceRskIp60Addresses = true;
const chainId = "31"; //local 31 en mainnet 30

const toWeb3CheckSumAddress = web3 => address => {
  return web3.utils.toChecksumAddress(address);
};

const toCheckSumAddress = web3 => address => {
  if (!forceChecksumAddressInput) return address;
  if (forceRskIp60Addresses) {
    return rskUtils.toChecksumAddress(address, chainId);
  }
  return web3.utils.toChecksumAddress(address);
};

const isValidAddressChecksum = web3 => address => {
  if (!forceChecksumAddressInput) return true;
  if (isPlainAddress(address)) return true;
  if (forceRskIp60Addresses) {
    return rskUtils.isValidChecksumAddress(address, chainId);
  }

  return web3.utils.checkAddressChecksum(address);
}

const isPlainAddress = address => {
  return /^0x[0-9a-f]{40}$/.test(address);
};

export default web3 => ({
  toCheckSumAddress: toCheckSumAddress(web3),
  toWeb3CheckSumAddress: toWeb3CheckSumAddress(web3),
  isValidAddressChecksum: isValidAddressChecksum(web3)
});
