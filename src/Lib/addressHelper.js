import rskUtils from 'rskjs-util';

const isValidAddressChecksum = web3 => address => {
    if (isPlainAddress(address)) return true;
    return web3.utils.toChecksumAddress(address);
}

const isPlainAddress = address => {
    return /^0x[0-9a-f]{40}$/.test(address);
};

export {
    isValidAddressChecksum
};
