import { createContext, useEffect, useState } from 'react';
import getRLogin from '../Lib/rLogin';
import Web3 from 'web3';
import _ from 'lodash/core';
import btcContractProvider from '../Contracts/MoC/abi/btcContractProvider';
import MocAbi from '../Contracts/MoC/abi/MoC.json';
import MoCInrate from '../Contracts/MoC/abi/MoCInRateContract.json';
import MocState from '../Contracts/MoC/abi/MoCState.json';
import MultiCall from '../Contracts/MoC/abi/Multicall2.json';
import MoCExchange from '../Contracts/MoC/abi/MoCExchange.json';
import MoCSettlement from '../Contracts/MoC/abi/MoCSettlement.json';
import DocToken from '../Contracts/MoC/abi/DocToken.json';
import BProToken from '../Contracts/MoC/abi/BProToken.json';
import MoCToken from '../Contracts/MoC/abi/MoCToken.json';
import ERC20 from '../Contracts/MoC/abi/RC20Contract';
import IStakingMachine from '../Contracts/MoC/abi/IStakingMachine.json';
import IDelayingMachine from '../Contracts/MoC/abi/IDelayingMachine.json';
import {
    connectorAddresses,
    contractStatus,
    userBalance
} from './MultiCallFunctions.js';
import addressHelper from '../Lib/addressHelper';
import FastBtcSocketWrapper from '../Lib/FastBtcSocketWrapper';
import createNodeManager from '../Lib/nodeManagerFactory';
import nodeManagerDecorator from '../Lib/nodeManagerDecorator';

const BigNumber = require('bignumber.js');
const helper = addressHelper(Web3);

BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_DOWN });

const AuthenticateContext = createContext({
    isLoggedIn: false,
    account: null,
    userBalanceData: null,
    contractStatusData: null,
    web3: null,
    connect: () => {},
    DoCMint: async (amount) => {},
    DoCReedem: async (amount) => {},
    BPROMint: async (amount) => {},
    BPROReedem: async (amount) => {},
    Bprox2Mint: async (amount) => {},
    Bprox2Redeem: async (amount) => {},
    disconnect: () => {},
    getTransactionReceipt: (hash) => {},
    getStackedBalance: async (address) => {},
    getLockedBalance: async (address) => {},
    stakingDeposit: async (mocs, address) => {},
    unstake: async (mocs) => {},
    getMoCAllowance: async (address) => {},
    approveMoCToken: async (address) => {},
    withdraw: async (id) => {},
    cancelWithdraw: async (id) => {},
    getPendingWithdrawals: async (address) => {},
    transferDocTo: async (to, amount) => {},
    transferBproTo: async (to, amount) => {},
    transferMocTo: async (to, amount) => {},
    calcMintInterestValues: async (amount) => {},
    convertToken: async (from, to, amount) => {}
});

const vendorAddress = '0xdda74880d638451e6d2c8d3fc19987526a7af730';
let mocStateAddress = '';
const mocAddress = '0x01AD6f8E884ed4DDC089fA3efC075E9ba45C9039';
const btcProviderAddress = '0x8BF2f24AfBb9dBE4F2a54FD72748FC797BB91F81';
let mocInrateAddress = '';
let mocExchangeAddress = '';
let mocSettlementAddress = '';
let docTokenAddress = '';
let bproTokenAddress = '';
const multicall2 = '0xaf7be1ef9537018feda5397d9e3bb9a1e4e27ac8';
const bucketX2 = 'X2';
const TransactionTypeIdsMoC = {
    MINT_BPRO_FEES_RBTC: 1,
    REDEEM_BPRO_FEES_RBTC: 2,
    MINT_DOC_FEES_RBTC: 3,
    REDEEM_DOC_FEES_RBTC: 4,
    MINT_BTCX_FEES_RBTC: 5,
    REDEEM_BTCX_FEES_RBTC: 6,
    MINT_BPRO_FEES_MOC: 7,
    REDEEM_BPRO_FEES_MOC: 8,
    MINT_DOC_FEES_MOC: 9,
    REDEEM_DOC_FEES_MOC: 10,
    MINT_BTCX_FEES_MOC: 11,
    REDEEM_BTCX_FEES_MOC: 12
};
const AuthenticateProvider = ({ children }) => {
    const [contractStatusData, setcontractStatusData] = useState(null);
    const [provider, setProvider] = useState(null);
    const [web3, setweb3] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [account, setAccount] = useState(null);
    const [userBalanceData, setUserBalanceData] = useState(null);
    const [accountData, setAccountData] = useState({
        Wallet: '',
        Owner: '',
        Balance: 0,
        BPROBalance: 0,
        BTCxBalance: 0,
        GasPrice: 0,
        truncatedAddress: ''
    });
    // const [transactionReceipt, setTransactionReceipt] = useState(null);

    // Fast BTC socket
    const socket = new FastBtcSocketWrapper();

    useEffect(() => {
        if (!window.rLogin) {
            window.rLogin = getRLogin();

            if (window.rLogin.cachedProvider) {
                connect();
            }
        }
    });

    useEffect(() => {
        if (account) {
            loadAccountData();
            loadBalanceData();
        }
    }, [account]);

    const connect = () =>
        window.rLogin.connect().then((rLoginResponse) => {
            const { provider, disconnect } = rLoginResponse;
            setProvider(provider);

            const web3 = new Web3(provider);
            setweb3(web3);
            window.web3 = web3;
            window.rLoginDisconnect = disconnect;
            window.nodeManager = {};

            // request user's account
            provider.request({ method: 'eth_accounts' }).then(([account]) => {
                setAccount(account);
                setIsLoggedIn(true);
            });
        });

    const disconnect = async () => {
        await disconnect;
        setProvider(null);
        setAccount(null);
        setAccountData({
            Wallet: '',
            Owner: '',
            Balance: 0,
            GasPrice: 0,
            truncatedAddress: ''
        });
        setIsLoggedIn(false);
        await window.rLoginDisconnect();
    };

    const loadAccountData = async () => {
        const owner = await getAccount();
        const truncate_address =
            owner.substring(0, 6) +
            '...' +
            owner.substring(owner.length - 4, owner.length);
        const accountData = {
            Wallet: account,
            Owner: owner,
            Balance: await getBalance(account),
            GasPrice: await getGasPrice(),
            truncatedAddress: truncate_address
        };

        window.address = owner;

        setAccountData(accountData);
    };
    const loadBalanceData = async () => {
        console.log('Reading Multicall2 Contract... address: ', multicall2);
        const multicall = new web3.eth.Contract(MultiCall.abi, multicall2);

        console.log('Reading MoC Contract... address: ', mocAddress);
        const moc = new web3.eth.Contract(MocAbi.abi, mocAddress);

        // Read contracts addresses from connector
        [
            mocStateAddress,
            mocInrateAddress,
            mocExchangeAddress,
            mocSettlementAddress,
            docTokenAddress,
            bproTokenAddress
        ] = await connectorAddresses(web3, multicall, moc);

        console.log('Reading MoC State Contract... address: ', mocStateAddress);
        const mocstate = new web3.eth.Contract(MocState.abi, mocStateAddress);

        console.log(
            'Reading MoC Inrate Contract... address: ',
            mocInrateAddress
        );
        const mocinrate = new web3.eth.Contract(
            MoCInrate.abi,
            mocInrateAddress
        );

        console.log(
            'Reading MoC Exchange Contract... address: ',
            mocExchangeAddress
        );
        const mocexchange = new web3.eth.Contract(
            MoCExchange.abi,
            mocExchangeAddress
        );

        console.log(
            'Reading MoC Settlement  Contract... address: ',
            mocSettlementAddress
        );
        const mocsettlement = new web3.eth.Contract(
            MoCSettlement.abi,
            mocSettlementAddress
        );

        console.log('Reading DoC Token Contract... address: ', docTokenAddress);
        const doctoken = new web3.eth.Contract(DocToken.abi, docTokenAddress);

        console.log(
            'Reading BPro Token Contract... address: ',
            bproTokenAddress
        );
        const bprotoken = new web3.eth.Contract(
            BProToken.abi,
            bproTokenAddress
        );

        const mocTokenAddress = await mocstate.methods.getMoCToken().call();

        console.log('Reading MoC Token Contract... address: ', mocTokenAddress);
        const moctoken = new web3.eth.Contract(MoCToken.abi, mocTokenAddress);

        // Read info from different contract MoCState.sol MoCInrate.sol MoCSettlement.sol MoC.sol
        // in one call throught Multicall
        const dataContractStatus = await contractStatus(
            web3,
            multicall,
            moc,
            mocstate,
            mocinrate,
            mocsettlement
        );

        setcontractStatusData(dataContractStatus);

        const user_address = account;

        // Example user balance
        const user_balance = await userBalance(
            web3,
            multicall,
            moc,
            mocinrate,
            moctoken,
            bprotoken,
            doctoken,
            user_address
        );

        const contracts = {
            bproToken: bprotoken,
            docToken: doctoken,
            mocState: mocstate,
            mocInrate: mocinrate,
            mocExchange: mocexchange,
            mocSettlement: mocsettlement,
            moc: moc,
            mocToken: moctoken
        };

        window.appMode = 'MoC';

        window.nodeManager = await nodeManagerDecorator( await createNodeManager({
            appMode: window.appMode,
            web3: web3,
            contracts,
            mocContractAddress: '0x01AD6f8E884ed4DDC089fA3efC075E9ba45C9039',
            registryAddress: '0x2c4b59ede1998229a9509ec7d15d206e91a246f1',
            partialExecutionSteps: {
                settlement: 20,
                liquidation: 20
            },
            gasPrice: getGasPrice
        }),loadBalanceData);

        setUserBalanceData(user_balance);
    };

    window.loadBalanceData= loadBalanceData

    const getGasPrice = async () => {
        const percentage = 12;
        let gasPrice;
        try {
            gasPrice = await window.web3.eth.getGasPrice();
        } catch (error) {
            gasPrice = 65000000;
        }
        gasPrice = new BigNumber(gasPrice);
        if (!percentage) {
            return gasPrice.toString();
        }
        return gasPrice
            .multipliedBy(percentage * 0.01)
            .plus(gasPrice)
            .toString();
    };

    const getAccount = async () => {
        const [owner] = await web3.eth.getAccounts();
        return owner;
    };
    const getBalance = async (address) => {
        try {
            let balance = await web3.eth.getBalance(address);
            balance = web3.utils.fromWei(balance);
            return balance;
        } catch (e) {
            console.log(e);
        }
    };

    const getContract = (abi, contractAddress) => {
        const web3 = new Web3(provider);
        return new web3.eth.Contract(abi, contractAddress);
    };
    const getTotalAmount = async (amount, transactionType) => {
        const comision = await getCommissionValue(amount, transactionType);
        console.log('Comision:' + comision);
        const vendorMarkup = await getVendorMarkup(amount);
        console.log('vendorMarkup:' + vendorMarkup);
        return (
            parseFloat(amount) + parseFloat(comision) + parseFloat(vendorMarkup)
        );
    };
    const getCommissionValue = async (amount, transactionType) => {
        try {
            const mocInrate = getContract(MoCInrate.abi, mocInrateAddress);
            const comission = await mocInrate.methods
                .calcCommissionValue(amount, transactionType)
                .call();
            console.log(comission);

            return comission;
        } catch (e) {
            console.log(e);
        }
    };

    const getVendorMarkup = async (amount) => {
        try {
            const mocInrate = getContract(MoCInrate.abi, mocInrateAddress);

            const comission = await mocInrate.methods
                .calculateVendorMarkup(vendorAddress, amount)
                .call();
            console.log('Vendor Markup:' + comission);

            return comission;
        } catch (e) {
            console.log(e);
        }
    };

    const estimateGasMintBprox2 = async (
        address,
        weiAmount,
        totalBtcAmount
    ) => {
        const moc = getContract(MocAbi.abi, mocAddress);
        moc.methods
            .mintBProxVendors(strToBytes32(bucketX2), weiAmount, vendorAddress)
            .estimateGas({ from: address, value: totalBtcAmount });
    };

    const strToBytes32 = (bucket) => web3.utils.asciiToHex(bucket, 32);

    const DoCMint = async (amount, callback) => {
        const web3 = new Web3(provider);
        const moc = getContract(MocAbi.abi, mocAddress);

        const amountWei = web3.utils.toWei(amount);
        const totalAmount = await getTotalAmount(
            amountWei,
            TransactionTypeIdsMoC.MINT_DOC_FEES_RBTC
        );

        const estimateGas = await moc.methods
            .mintDocVendors(amountWei, vendorAddress)
            .estimateGas({ from: account, value: totalAmount });

        return moc.methods.mintDocVendors(amountWei, vendorAddress).send(
            {
                from: account,
                value: totalAmount, //Importe con comisión incluida
                gasPrice: web3.utils.toWei(accountData.GasPrice),
                gas: 2 * estimateGas,
                gasLimit: 2 * estimateGas
            },
            callback
        );
    };

    const DoCReedem = async (amount, callback) => {
        const web3 = new Web3(provider);
        const amountWei = web3.utils.toWei(amount);
        const moc = getContract(MocAbi.abi, mocAddress);
        const estimateGas =
            (await moc.methods
                .redeemFreeDocVendors(amountWei, vendorAddress)
                .estimateGas({ from: account })) * 2;
        return moc.methods.redeemFreeDocVendors(amountWei, vendorAddress).send(
            {
                from: account,
                gasPrice: web3.utils.toWei(accountData.GasPrice),
                gas: estimateGas,
                gasLimit: estimateGas
            },
            callback
        );
    };
    const BPROMint = async (amount, callback) => {
        const web3 = new Web3(provider);
        const amountWei = web3.utils.toWei(amount);
        const totalAmount = await getTotalAmount(
            amountWei,
            TransactionTypeIdsMoC.MINT_BPRO_FEES_RBTC
        );

        const moc = getContract(MocAbi.abi, mocAddress);
        const estimateGas = await moc.methods
            .mintBProVendors(amountWei, vendorAddress)
            .estimateGas({ from: account, value: totalAmount });

        return moc.methods.mintBProVendors(amountWei, vendorAddress).send(
            {
                from: account,
                value: totalAmount, //Importe con comisión incluida
                gasPrice: web3.utils.toWei(accountData.GasPrice),
                gas: 2 * estimateGas,
                gasLimit: 2 * estimateGas
            },
            callback
        );
    };
    const BPROReedem = async (amount, callback) => {
        const web3 = new Web3(provider);
        const amountWei = web3.utils.toWei(amount);
        const moc = getContract(MocAbi.abi, mocAddress);
        const estimateGas =
            (await moc.methods
                .redeemBProVendors(amountWei, vendorAddress)
                .estimateGas({ from: account })) * 2;
        return moc.methods.redeemBProVendors(amountWei, vendorAddress).send(
            {
                from: account,
                gasPrice: web3.utils.toWei(accountData.GasPrice),
                gas: estimateGas,
                gasLimit: estimateGas
            },
            callback
        );
    };

    const getDoCBalance = async (address) => {
        const contract = new web3.eth.Contract(
            ERC20.abi,
            '0xCb46C0DdC60d18eFEB0e586c17AF6Ea36452DaE0'.toLocaleLowerCase()
        );

        let tokenBalance = await contract.methods.balanceOf(address).call();

        return tokenBalance;
    };
    const Bprox2Mint = async (btcAmount, callback) => {
        const mocInrate = getContract(MoCInrate.abi, mocInrateAddress);
        const from = account;
        const moc = getContract(MocAbi.abi, mocAddress);
        const weiAmount = new BigNumber(
            web3.utils.toWei(btcAmount, 'ether')
        ).toFixed(0);
        const btcInterestAmount = mocInrate.methods
            .calcMintInterestValues(strToBytes32(bucketX2), weiAmount)
            .call();

        // Interest Margin. TODO: Is this ok? Where did this interestFinal came from?
        const interestFinal = new BigNumber(0.01)
            .multipliedBy(btcInterestAmount)
            .plus(btcInterestAmount);

        const totalBtcAmount = await getTotalAmount(
            weiAmount,
            TransactionTypeIdsMoC.MINT_BTCX_FEES_RBTC
        );

        const duplicateEstimateGasMintBprox2 =
            2 * (await estimateGasMintBprox2(from, weiAmount, totalBtcAmount));
        return moc.methods
            .mintBProxVendors(strToBytes32(bucketX2), weiAmount, vendorAddress)
            .send(
                {
                    from,
                    value: totalBtcAmount,
                    gasPrice: web3.utils.toWei(accountData.GasPrice),
                    gas: duplicateEstimateGasMintBprox2,
                    gasLimit: duplicateEstimateGasMintBprox2
                },
                callback
            );
    };

    const Bprox2Redeem = async (bprox2Amount, callback) => {
        const from = account;
        const weiAmount = web3.utils.toWei(bprox2Amount, 'ether');
        const moc = getContract(MocAbi.abi, mocAddress);
        const estimateGas =
            (await moc.methods
                .redeemBProxVendors(
                    strToBytes32(bucketX2),
                    weiAmount,
                    vendorAddress
                )
                .estimateGas({ from })) * 2;
        return moc.methods
            .redeemBProxVendors(
                strToBytes32(bucketX2),
                weiAmount,
                vendorAddress
            )
            .send(
                {
                    from,
                    gas: estimateGas,
                    gasLimit: estimateGas,
                    gasPrice: web3.utils.toWei(accountData.GasPrice)
                },
                callback
            );
    };

    const getTransactionReceipt = async (hash, callback) => {
        const web3 = new Web3(provider);
        let transactionReceipt = false;
        let transaction = await web3.eth.getTransactionReceipt(hash);
        if (transaction) {
            transactionReceipt = true;
        }
        return transactionReceipt;
    };

    const getStackedBalance = async (address) => {
        const from = address || account;
        const anAddress = '0x051F724b67bdB72fd059fBb9c62ca56a92500FF9';
        const moc = getContract(IStakingMachine.abi, anAddress);
        let balance = await moc.methods.getBalance(from).call();
        return balance;
    };

    const getLockedBalance = async (address) => {
        const from = address || account;
        const anAddress = '0x051F724b67bdB72fd059fBb9c62ca56a92500FF9';
        const moc = getContract(IStakingMachine.abi, anAddress);
        let lockedBalance = await moc.methods.getLockedBalance(from).call();
        return lockedBalance;
    };

    const stakingDeposit = async (mocs, address, callback) => {
        const from = account; // await getAccount();
        const anAddress = '0x051F724b67bdB72fd059fBb9c62ca56a92500FF9';
        const weiAmount = web3.utils.toWei(mocs, 'ether');
        const stakingMachine = getContract(IStakingMachine.abi, anAddress);
        const methodCall = stakingMachine.methods.deposit(weiAmount, address);
        const gasLimit = 2 * (await methodCall.estimateGas({ from }));
        methodCall.call({
            from,
            gasPrice: await getGasPrice(),
            gas: gasLimit,
            gasLimit: gasLimit
        });
        return methodCall.send(
            {
                from,
                gasPrice: await getGasPrice(),
                gaS: gasLimit,
                gasLimit: gasLimit
            },
            callback
        );
    };

    const unstake = async (mocs, callback) => {
        const from = account;
        const anAddress = '0x051F724b67bdB72fd059fBb9c62ca56a92500FF9';
        const weiAmount = web3.utils.toWei(mocs, 'ether');
        const stakingMachine = getContract(IStakingMachine.abi, anAddress);
        const methodCall = stakingMachine.methods.withdraw(weiAmount);
        const gasLimit = 2 * (await methodCall.estimateGas({ from }));
        methodCall.call({
            from,
            gasPrice: await getGasPrice(),
            gas: gasLimit,
            gasLimit: gasLimit
        });
        return methodCall.send(
            {
                from,
                gasPrice: await getGasPrice(),
                gas: gasLimit,
                gasLimit: gasLimit
            },
            callback
        );
    };

    const getMoCAllowance = async (address) => {
        const mocTokenAddress = '0x0399c7F7B37E21cB9dAE04Fb57E24c68ed0B4635';
        const anAddress = '0x051F724b67bdB72fd059fBb9c62ca56a92500FF9';
        const from = address || account;
        const moc = getContract(ERC20.abi, mocTokenAddress);
        return moc.methods.allowance(from, anAddress).call();
    };

    const approveMoCToken = async (enabled, callback = () => {}) => {
        const from = account;
        console.log('from', from);
        const mocTokenAddress = '0x0399c7F7B37E21cB9dAE04Fb57E24c68ed0B4635';
        const anAddress = '0x051F724b67bdB72fd059fBb9c62ca56a92500FF9';
        const newAllowance = enabled
            ? web3.utils.toWei(Number.MAX_SAFE_INTEGER.toString())
            : 0;
        const moc = getContract(ERC20.abi, mocTokenAddress);
        console.log('newAllowance', newAllowance);
        return moc.methods
            .approve(anAddress, newAllowance)
            .send({ from, gasPrice: await getGasPrice() }, callback);
    };

    const withdraw = async (id, callback = () => {}) => {
        const from = account;
        const anAddress = '0xa5D66d8dE70e0A8Be6398BC487a9b346177004B0';
        const delayingMachine = getContract(IDelayingMachine.abi, anAddress);
        const methodCall = delayingMachine.methods.withdraw(id);
        const gasLimit = 2 * (await methodCall.estimateGas({ from }));
        methodCall.call({
            from,
            gasPrice: await getGasPrice(),
            gas: gasLimit,
            gasLimit: gasLimit
        });
        return methodCall.send(
            {
                from,
                gasPrice: await getGasPrice(),
                gas: gasLimit,
                gasLimit: gasLimit
            },
            callback
        );
    };

    const cancelWithdraw = async (id, callback) => {
        const from = account;
        const anAddress = '0xa5D66d8dE70e0A8Be6398BC487a9b346177004B0';
        const delayingMachine = getContract(IDelayingMachine.abi, anAddress);
        const methodCall = delayingMachine.methods.cancel(id);
        const gasLimit = 2 * (await methodCall.estimateGas({ from }));
        methodCall.call({
            from,
            gasPrice: await getGasPrice(),
            gas: gasLimit,
            gasLimit: gasLimit
        });
        return methodCall.send(
            {
                from,
                gasPrice: await getGasPrice(),
                gas: gasLimit,
                gasLimit: gasLimit
            },
            callback
        );
    };

    const getPendingWithdrawals = async (address) => {
        const from = address || account;
        const anAddress = '0xa5D66d8dE70e0A8Be6398BC487a9b346177004B0';
        const moc = getContract(IDelayingMachine.abi, anAddress);
        const { ids, amounts, expirations } = await moc.methods
            .getTransactions(from)
            .call();
        const withdraws = [];
        for (let i = 0; i < ids.length; i++) {
            withdraws.push({
                id: ids[i],
                amount: amounts[i],
                expiration: expirations[i]
            });
        }
        return withdraws;
    };

    const transferDocTo = async (to, amount, callback) => {
        const docAddress = '0x489049c48151924c07F86aa1DC6Cc3Fea91ed963';
        const toWithChecksum = helper.toWeb3CheckSumAddress(to);
        const from = account;
        const contractAmount = web3.utils.toWei(amount, 'ether');
        const docToken = getContract(ERC20.abi, docAddress);
        return docToken.methods
            .transfer(toWithChecksum, contractAmount)
            .send({ from, gasPrice: await getGasPrice() }, callback);
    };

    const transferBproTo = async (to, amount, callback) => {
        const bproAddress = '0x5639809FAFfF9082fa5B9a8843D12695871f68bd';
        const toWithChecksum = helper.toWeb3CheckSumAddress(to);
        const from = account;
        const contractAmount = web3.utils.toWei(amount, 'ether');
        const bproToken = getContract(ERC20.abi, bproAddress);
        return bproToken.methods
            .transfer(toWithChecksum, contractAmount)
            .send({ from, gasPrice: await getGasPrice() }, callback);
    };

    const transferMocTo = async (to, amount, callback) => {
        const mocTokenAddress = '0x0399c7F7B37E21cB9dAE04Fb57E24c68ed0B4635';
        const toWithChecksum = helper.toWeb3CheckSumAddress(to);
        const from = await module.getAccount();
        const contractAmount = web3.utils.toWei(amount, 'ether');
        const mocToken = getContract(ERC20.abi, mocTokenAddress);
        return mocToken.methods
            .transfer(toWithChecksum, contractAmount)
            .send({ from, gasPrice: await getGasPrice() }, callback);
    };

    const calcMintInterestValues = (amount) => {
        const mocInrateAddress = '0x8CA7685F69B4bb96D221049Ac84e2F9363ca7F2c';
        const mocInrate = getContract(MoCInrate.abi, mocInrateAddress);
        mocInrate.methods
            .calcMintInterestValues(strToBytes32(bucketX2), amount)
            .call();
    };


    /* const priceFields = getPriceFields();
    const convertToken = convertHelper(_.pick(contractStatusData, Object.keys(priceFields).concat(['reservePrecision']))); */
    const convertToken = (from, to, amount) => {
        if (!contractStatusData) return '';

        const {
            bitcoinPrice,
            bproPriceInUsd,
            bproPriceInRbtc,
            reservePrecision,
            bprox2PriceInRbtc,
            bprox2PriceInBpro,
            mocPrice
        } = contractStatusData;

        const convertDocToUsd = (amount) => amount;
        const convertBproToRbtc = (amount) =>
            amount.times(bproPriceInRbtc).div(reservePrecision);
        const convertBproToUsd = (amount) =>
            amount.times(bproPriceInUsd).div(reservePrecision);
        const convertDocToRbtc = (amount) =>
            amount.div(bitcoinPrice).times(reservePrecision);
        const convertRbtcToUsd = (amount) =>
            amount.times(bitcoinPrice).div(reservePrecision);
        const convertRbtcToBpro = (amount) =>
            amount.div(bproPriceInRbtc).times(reservePrecision);
        const convertRbtcToDoc = (amount) => convertRbtcToUsd(amount);
        const convertRbtcToBprox2 = (amount) =>
            amount.div(bprox2PriceInRbtc).times(reservePrecision);
        const convertBprox2ToRbtc = (amount) =>
            amount.times(bprox2PriceInRbtc).div(reservePrecision);
        const convertBproToBprox2 = (amount) =>
            amount.div(bprox2PriceInBpro).times(reservePrecision);
        const convertBprox2ToBpro = (amount) =>
            amount.times(bprox2PriceInBpro).div(reservePrecision);
        const convertBprox2ToUsd = (amount) =>
            amount // RESERVE
                .times(bprox2PriceInRbtc) // RESERVE * RESERVE
                .div(reservePrecision) // RESERVE
                .times(bitcoinPrice) // RESERVE * USD
                .div(reservePrecision); // USD

        const convertMoCTokenToRbtc = (amount) =>
            convertDocToRbtc(convertMoCTokenToUsd(amount));
        const convertMoCTokenToUsd = (amount) =>
            amount.times(mocPrice).div(reservePrecision);
        const convertRbtcToMoCToken = (amount) =>
            convertRbtcToDoc(amount).div(mocPrice).times(reservePrecision);

        const convertMap = {
            STABLE: { USD: convertDocToUsd, RESERVE: convertDocToRbtc },
            RISKPRO: {
                USD: convertBproToUsd,
                RESERVE: convertBproToRbtc,
                RISKPROX: convertBproToBprox2
            },
            RISKPROX: {
                RESERVE: convertBprox2ToRbtc,
                RISKPRO: convertBprox2ToBpro,
                USD: convertBprox2ToUsd
            },
            MOC: {
                RESERVE: convertMoCTokenToRbtc,
                USD: convertMoCTokenToUsd
            },
            RESERVE: {
                USD: convertRbtcToUsd,
                RISKPRO: convertRbtcToBpro,
                STABLE: convertRbtcToDoc,
                RISKPROX: convertRbtcToBprox2,
                MOC: convertRbtcToMoCToken
            }
        };

        return from === to
            ? new BigNumber(amount)
            : convertMap[from][to](new BigNumber(amount));
    };

    return (
        <AuthenticateContext.Provider
            value={{
                account,
                accountData,
                userBalanceData,
                contractStatusData,
                isLoggedIn,
                web3,
                connect,
                disconnect,
                DoCMint,
                DoCReedem,
                BPROMint,
                BPROReedem,
                Bprox2Mint,
                Bprox2Redeem,
                getTransactionReceipt,
                getStackedBalance,
                getLockedBalance,
                stakingDeposit,
                unstake,
                getMoCAllowance,
                approveMoCToken,
                withdraw,
                cancelWithdraw,
                getPendingWithdrawals,
                transferDocTo,
                transferBproTo,
                transferMocTo,
                calcMintInterestValues,
                socket,
                convertToken
            }}
        >
            {children}
        </AuthenticateContext.Provider>
    );
};

export { AuthenticateContext, AuthenticateProvider };
