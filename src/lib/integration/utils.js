/* eslint-disable no-undef */

import BigNumber from 'bignumber.js';
import Web3 from 'web3';
//import {setNumber} from "../../helpers/helper";

BigNumber.config({
    ROUNDING_MODE: BigNumber.ROUND_DOWN,
    FORMAT: { decimalSeparator: '.', groupSeparator: ',' }
});

const BUCKET_X2 =
    '0x5832000000000000000000000000000000000000000000000000000000000000';
const BUCKET_C0 =
    '0x4330000000000000000000000000000000000000000000000000000000000000';

const getGasPrice = async (web3, protocolMaxPriceAllowed) => {
    try {
        // Get gas price from node
        const nodeGasPrice = await web3.eth.getGasPrice();
        console.log("Node gas price: ", parseInt(nodeGasPrice.toString()))

        let gasPrice;
        if (protocolMaxPriceAllowed !== undefined) {
            // Min from node gas price and protocolMaxPriceAllowed
            gasPrice = Math.min(
              parseInt(nodeGasPrice.toString()),
              parseInt(protocolMaxPriceAllowed.toString())
            )
            console.log("Protocol Max gas price allowed: ", parseInt(protocolMaxPriceAllowed))
        } else {
            gasPrice = parseInt(nodeGasPrice.toString())
        }

        console.log("Sending gas price: ", gasPrice)
        return gasPrice.toString();
    } catch (e) {
        console.log(e);
    }
};

const toContractPrecision = (amount) => {
    return Web3.utils.toWei(
        BigNumber(amount).toFormat(18, BigNumber.ROUND_DOWN),
        'ether'
    );
};

const getAppMode = () => {
    const mocEnvironment = `${process.env.MOC_ENVIRONMENT}`;

    let appMode;
    switch (mocEnvironment) {
        case 'mocTestnetAlpha':
        case 'mocTestnet':
        case 'mocMainnet2':
            appMode = 'MoC';
            break;
        default:
            throw new Error(
                'Environment not implemented! Please refer to table list of MoC Environments'
            );
    }
    return appMode;
};

const getAppMoCProject = () => {
    const mocEnvironment = `${process.env.MOC_ENVIRONMENT}`;

    let appProject;
    switch (mocEnvironment) {
        case 'mocTestnetAlpha':
        case 'mocTestnet':
        case 'mocMainnet2':
            appProject = 'MoC';
            break;
        default:
            throw new Error(
                'Environment not implemented! Please refer to table list of MoC Environments'
            );
    }
    return appProject;
};

const precision = (contractDecimals) =>
    new BigNumber(10).exponentiatedBy(contractDecimals);

const formatVisibleValue = (amount, decimals) => {
    return BigNumber(amount)
        .div(precision(18))
        .toFormat(decimals, BigNumber.ROUND_UP, {
            decimalSeparator: '.',
            groupSeparator: ','
        });
};

const formatTimestamp = (timestamp) => {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(timestamp);
};

export {
    getGasPrice,
    toContractPrecision,
    getAppMode,
    getAppMoCProject,
    formatVisibleValue,
    formatTimestamp,
    BUCKET_X2,
    BUCKET_C0
};
