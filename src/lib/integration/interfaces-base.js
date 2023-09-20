import BigNumber from 'bignumber.js';
import Web3 from 'web3';

import { calcCommission } from './multicall';
import {
    toContractPrecision,
    BUCKET_X2,
    BUCKET_C0,
    getGasPrice
} from './utils';

const addCommissions = async (
    interfaceContext,
    reserveAmount,
    token,
    action
) => {
    const {
        web3,
        contractStatusData,
        userBalanceData,
        config,
        account,
        vendorAddress
    } = interfaceContext;
    const dContracts = window.integration;
    const { environment, tokens } = config;

    // get reserve price from contract
    const reservePrice = new BigNumber(
        Web3.utils.fromWei(contractStatusData.bitcoinPrice)
    );

    // Get commissions from contracts
    const commissions = await calcCommission(
        web3,
        dContracts,
        contractStatusData,
        reserveAmount,
        token,
        action,
        vendorAddress
    );

    // Calculate commissions using Reserve payment
    const commissionInReserve = new BigNumber(
        Web3.utils.fromWei(commissions.commission_reserve)
    ).plus(new BigNumber(Web3.utils.fromWei(commissions.vendorMarkup)));

    // Calculate commissions using TG Token payment
    const commissionInTG = new BigNumber(
        Web3.utils.fromWei(commissions.commission_moc)
    )
        .plus(new BigNumber(Web3.utils.fromWei(commissions.vendorMarkup)))
        .times(reservePrice)
        .div(Web3.utils.fromWei(contractStatusData.mocPrice));

    // Enough TG to Pay commission with TG
    const enoughTGBalance = BigNumber(
        Web3.utils.fromWei(userBalanceData.mocBalance)
    ).gte(commissionInTG);

    // Enough TG allowance to Pay commission with TG Token
    const enoughTGAllowance =
        BigNumber(Web3.utils.fromWei(userBalanceData.mocAllowance)).gt(0) &&
        BigNumber(Web3.utils.fromWei(userBalanceData.mocAllowance)).gte(
            commissionInTG
        );

    // add commission to value send
    let valueToSend;

    if (enoughTGBalance && enoughTGAllowance) {
        valueToSend = reserveAmount;
        console.log(
            `Paying commission with ${tokens.TG.name}: ${commissionInTG} ${tokens.TG.name}`
        );
    } else {
        valueToSend = reserveAmount.plus(commissionInReserve);
        console.log(
            `Paying commission with ${tokens.RESERVE.name}: ${commissionInReserve} ${tokens.RESERVE.name}`
        );
    }

    return valueToSend;
};

const calcMintInterest = async (interfaceContext, amount) => {
    const { web3, account } = interfaceContext;
    const dContracts = window.integration;

    amount = new BigNumber(amount);

    const mocinrate = dContracts.contracts.mocinrate;

    const calcMintInterest = await mocinrate.methods
        .calcMintInterestValues(BUCKET_X2, toContractPrecision(amount))
        .call();

    return calcMintInterest;
};

const vendorMarkup = async (interfaceContext, vendorAccount) => {
    const { web3, account } = interfaceContext;
    const dContracts = window.integration;
    const mocvendors = dContracts.contracts.mocvendors;
    const result = await mocvendors.methods.vendors(web3.utils.toChecksumAddress(vendorAccount)).call();
    return result[1];
};

const transferTPTo = async (
    interfaceContext,
    to,
    amount,
    onTransaction,
    onReceipt,
    onError
) => {
    const { web3, account } = interfaceContext;
    const dContracts = window.integration;

    const tp = dContracts.contracts.tp;

    amount = new BigNumber(amount);

    // Calculate estimate gas cost
    const estimateGas = await tp.methods
        .transfer(to, toContractPrecision(amount))
        .estimateGas({ from: web3.utils.toChecksumAddress(account) });

    // Send tx
    const receipt = tp.methods
        .transfer(to, toContractPrecision(amount))
        .send({
            from: web3.utils.toChecksumAddress(account),
            value: '0x',
            gasPrice: await getGasPrice(web3),
            gas: estimateGas * 2,
            gasLimit: estimateGas * 2
        })
        .on('error', onError)
        .on('transactionHash', onTransaction)
        .on('receipt', onReceipt);

    return receipt;
};

const transferTCTo = async (
    interfaceContext,
    to,
    amount,
    onTransaction,
    onReceipt,
    onError
) => {
    const { web3, account } = interfaceContext;
    const dContracts = window.integration;

    const tc = dContracts.contracts.tc;

    amount = new BigNumber(amount);

    // Calculate estimate gas cost
    const estimateGas = await tc.methods
        .transfer(to, toContractPrecision(amount))
        .estimateGas({ from: web3.utils.toChecksumAddress(account) });

    // Send tx
    const receipt = tc.methods
        .transfer(to, toContractPrecision(amount))
        .send({
            from: web3.utils.toChecksumAddress(account),
            value: '0x',
            gasPrice: await getGasPrice(web3),
            gas: estimateGas * 2,
            gasLimit: estimateGas * 2
        })
        .on('error', onError)
        .on('transactionHash', onTransaction)
        .on('receipt', onReceipt);

    return receipt;
};

const transferTGTo = async (
    interfaceContext,
    to,
    amount,
    onTransaction,
    onReceipt,
    onError
) => {
    const { web3, account } = interfaceContext;
    const dContracts = window.integration;

    const tg = dContracts.contracts.tg;

    amount = new BigNumber(amount);

    // Calculate estimate gas cost
    const estimateGas = await tg.methods
        .transfer(to, toContractPrecision(amount))
        .estimateGas({ from: web3.utils.toChecksumAddress(account) });

    // Send tx
    const receipt = tg.methods
        .transfer(to, toContractPrecision(amount))
        .send({
            from: web3.utils.toChecksumAddress(account),
            value: '0x',
            gasPrice: await getGasPrice(web3),
            gas: estimateGas * 2,
            gasLimit: estimateGas * 2
        })
        .on('error', onError)
        .on('transactionHash', onTransaction)
        .on('receipt', onReceipt);

    return receipt;
};

const transferCoinbaseTo = async (
    interfaceContext,
    to,
    amount,
    onTransaction,
    onReceipt,
    onError
) => {
    const { web3, account } = interfaceContext;
    let tokens = web3.utils.toWei(amount.toString(), 'ether');

    const handleReceipt = (error, receipt) => {
        if (error) console.error(error);
        else {
            console.log(receipt);
        }
    }

    const receipt = await web3.eth
        .sendTransaction({
            from: web3.utils.toChecksumAddress(account),
            to: web3.utils.toChecksumAddress(to),
            value: web3.utils.toBN(tokens),
            gasPrice: await getGasPrice(web3),
            gas: 72000
        }, handleReceipt)
        //.on('error', onError)
        //.on('transactionHash', onTransaction)
        //.on('receipt', onReceipt);

    return receipt;
};

const approveTGTokenCommission = async (
    interfaceContext,
    enabled,
    onTransaction,
    onReceipt,
    onError
) => {
    const { web3, account } = interfaceContext;
    const dContracts = window.integration;

    const mocAddress = dContracts.contracts.moc._address;
    const tg = dContracts.contracts.tg;

    const newAllowance = enabled
        ? Web3.utils.toWei(Number.MAX_SAFE_INTEGER.toString())
        : 0;

    // Calculate estimate gas cost
    const estimateGas = await tg.methods
        .approve(mocAddress, newAllowance)
        .estimateGas({ from: web3.utils.toChecksumAddress(account) });

    // Send tx
    const receipt = tg.methods
        .approve(mocAddress, newAllowance)
        .send({
            from: web3.utils.toChecksumAddress(account),
            value: '0x',
            gasPrice: await getGasPrice(web3),
            gas: estimateGas * 2,
            gasLimit: estimateGas * 2
        })
        .on('error', onError)
        .on('transactionHash', onTransaction)
        .on('receipt', onReceipt);

    return receipt;
};

const AllowUseTokenMigrator = async (interfaceContext, newAllowance, onTransaction, onReceipt, onError) => {

    const { web3, account } = interfaceContext;
    const dContracts = window.integration;

    if (!dContracts.contracts.tp_legacy) console.log("Error: Please set token migrator address in environment vars!")

    const tp_legacy = dContracts.contracts.tp_legacy
    const tokenMigrator = dContracts.contracts.token_migrator

    // Calculate estimate gas cost
    const estimateGas = await tp_legacy.methods
        .approve(tokenMigrator._address, toContractPrecision(newAllowance))
        .estimateGas({ from: account, value: '0x' })

    // Send tx
    const receipt = tp_legacy.methods
        .approve(tokenMigrator._address, toContractPrecision(newAllowance))
        .send(
            {
                from: account,
                gasPrice: await getGasPrice(web3),
                gas: estimateGas * 2,
                gasLimit: estimateGas * 2
            }
        )
        .on('error', onError)
        .on('transactionHash', onTransaction)
        .on('receipt', onReceipt);

    return receipt
}


const MigrateToken = async (interfaceContext, onTransaction, onReceipt, onError) => {

    const { web3, account } = interfaceContext;
    const dContracts = window.integration;

    if (!dContracts.contracts.token_migrator) console.log("Error: Please set token migrator address in environment vars!")

    const tokenMigrator = dContracts.contracts.token_migrator

    // Calculate estimate gas cost
    const estimateGas = await tokenMigrator.methods
        .migrateToken()
        .estimateGas({ from: account, value: '0x' })

    // Send tx
    const receipt = tokenMigrator.methods
        .migrateToken()
        .send(
            {
                from: account,
                gasPrice: await getGasPrice(web3),
                gas: estimateGas * 2,
                gasLimit: estimateGas * 2
            }
        )
        .on('error', onError)
        .on('transactionHash', onTransaction)
        .on('receipt', onReceipt);

    return receipt
}

export {
    addCommissions,
    calcMintInterest,
    transferTPTo,
    transferTCTo,
    transferTGTo,
    transferCoinbaseTo,
    approveTGTokenCommission,
    vendorMarkup,
    AllowUseTokenMigrator,
    MigrateToken
};