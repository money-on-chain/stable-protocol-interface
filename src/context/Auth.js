import { createContext, useEffect, useState } from 'react';
import getRLogin from '../lib/rLogin';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';

import addressHelper from '../helpers/addressHelper';
import { config } from '../projects/config';
import { readContracts } from '../lib/integration/contracts';
import { contractStatus, userBalance } from '../lib/integration/multicall';
import {
    mintTP,
    redeemTP,
    mintTC,
    redeemTC,
    mintTX,
    redeemTX
} from '../lib/integration/interfaces-coinbase';
import {
    AllowanceUseReserveToken,
    mintTPRRC20,
    redeemTPRRC20,
    mintTCRRC20,
    redeemTCRRC20,
    mintTXRRC20,
    redeemTXRRC20
} from '../lib/integration/interfaces-rrc20';
import { decodeEvents } from '../lib/integration/transaction';

import {
    transferTPTo,
    transferTCTo,
    transferTGTo,
    transferRESERVETo,
    transferCoinbaseTo,
    calcMintInterest,
    approveTGTokenCommission,
    vendorMarkup,
    AllowUseTokenMigrator,
    MigrateToken
} from '../lib/integration/interfaces-base';
import {
    stackedBalance,
    lockedBalance,
    pendingWithdrawals,
    stakingDeposit,
    unStake,
    delayMachineWithdraw,
    delayMachineCancelWithdraw,
    approveMoCTokenStaking,
    getMoCAllowance
} from '../lib/integration/interfaces-omoc';
import { getGasPrice } from '../lib/integration/utils';

const helper = addressHelper(Web3);

BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_DOWN });

const AuthenticateContext = createContext({
    isLoggedIn: false,
    account: null,
    userBalanceData: null,
    balanceRbtc: null,
    contractStatusData: null,
    web3: null,
    getAppMode: null,
    connect: () => {},
    interfaceExchangeMethod: async (
        sourceCurrency,
        targetCurrency,
        amount,
        slippage,
        onTransaction,
        onReceipt,
        onError
    ) => {},
    interfaceMintTC: async (amount, slippage, onTransaction, onReceipt, onError) => {},
    interfaceRedeemTC: async (amount, slippage, onTransaction, onReceipt, onError) => {},
    interfaceMintTP: async (amount, slippage, onTransaction, onReceipt, onError) => {},
    interfaceRedeemTP: async (amount, slippage, onTransaction, onReceipt, onError) => {},
    interfaceMintTX: async (amount, slippage, onTransaction, onReceipt, onError) => {},
    interfaceRedeemTX: async (amount, slippage, onTransaction, onReceipt, onError) => {},
    interfaceMintTCRRC20: async (
        amount,
        slippage,
        onTransaction,
        onReceipt,
        onError
    ) => {},
    interfaceRedeemTCRRC20: async (
        amount,
        slippage,
        onTransaction,
        onReceipt,
        onError
    ) => {},
    interfaceMintTPRRC20: async (
        amount,
        slippage,
        onTransaction,
        onReceipt,
        onError
    ) => {},
    interfaceRedeemTPRRC20: async (
        amount,
        slippage,
        onTransaction,
        onReceipt,
        onError
    ) => {},
    interfaceMintTXRRC20: async (
        amount,
        slippage,
        onTransaction,
        onReceipt,
        onError
    ) => {},
    interfaceRedeemTXRRC20: async (
        amount,
        slippage,
        onTransaction,
        onReceipt,
        onError
    ) => {},
    interfaceApproveTGTokenCommission: async (
        enabled,
        onTransaction,
        onReceipt,
        onError
    ) => {},
    interfaceAllowUseTokenMigrator: async (amount, onTransaction, onReceipt, onError) => {},
    interfaceMigrateToken: async (onTransaction, onReceipt, onError) => {},
    disconnect: () => {},
    getTransactionReceipt: (hash) => {},
    interfaceDecodeEvents: async (receipt) => {},
    interfaceStackedBalance: async (address) => {},
    interfaceGetMoCAllowance: async (address) => {},
    interfaceLockedBalance: async (address) => {},
    interfaceStakingDeposit: async (mocs, address) => {},
    interfaceUnStake: async (mocs) => {},
    interfaceApproveMoCTokenStaking: async (enabled) => {},
    interfaceDelayMachineWithdraw: async (id) => {},
    interfaceDelayMachineCancelWithdraw: async (id) => {},
    interfacePendingWithdrawals: async (address) => {},
    interfaceTransferTPTo: async (to, amount) => {},
    interfaceTransferTCTo: async (to, amount) => {},
    interfaceTransferTGTo: async (to, amount) => {},
    interfaceTransferRESERVETo: async (to, amount) => {},
    interfaceTransferCoinbaseTo: async (to, amount) => {},
    interfaceCalcMintInterestValues: async (amount) => {},
    interfaceVendorMarkup: async (vendorAccount) => {},
    interfaceApproveReserve: async (address) => {},
    convertToken: async (from, to, amount) => {},
    getSpendableBalance: async (address) => {},
    loadContractsStatusAndUserBalance: async (address) => {},
    getReserveAllowance: async (address) => {}
});

const AuthenticateProvider = ({ children }) => {
    const [contractStatusData, setContractStatusData] = useState(null);
    const [provider, setProvider] = useState(null);
    const [web3, setweb3] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [account, setAccount] = useState(null);
    const [userBalanceData, setUserBalanceData] = useState(null);
    const [balanceRbtc, setBalanceRbtc] = useState(null);
    const [getAppMode, seGetAppMode] = useState(config.environment.AppMode);
    const [accountData, setAccountData] = useState({
        Wallet: '',
        Owner: '',
        Balance: 0,
        BPROBalance: 0,
        BTCxBalance: 0,
        GasPrice: 0,
        truncatedAddress: ''
    });
    //let balanceData;
    // const [transactionReceipt, setTransactionReceipt] = useState(null);

    async function loadCss() {
        let css_logout = await import('../assets/css/logout.scss');
    }

    useEffect(() => {
        if (!window.rLogin) {
            window.rLogin = getRLogin(
                process.env.REACT_APP_ENVIRONMENT_CHAIN_ID
            );

            if (window.rLogin.cachedProvider) {
                connect();
            } else {
                connect();
                disableLogin();
            }
        }
    });

    const disableLogin = () => {
        document
            .querySelectorAll('.rlogin-modal-hitbox')[0]
            .addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        loadCss();
    };

    useEffect(() => {
        if (account) {
            initContractsConnection();
            loadAccountData();
        }
    }, [account]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (account) {
                loadContractsStatusAndUserBalance();
            }
        }, 30000);
        return () => clearInterval(interval);
    }, [account]);

    const connect = () =>
        window.rLogin.connect().then((rLoginResponse) => {
            const { provider, disconnect } = rLoginResponse;
            setProvider(provider);

            const web3 = new Web3(provider);
            provider.on('accountsChanged', function (accounts) {
                disconnect();
                window.location.reload();
                /*if ( accounts.length==0 ){
                    disconnect()
                    window.location.reload()
                }*/
            });
            provider.on('chainChanged', function (accounts) {
                disconnect();
                window.location.reload();
            });

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
        setUserBalanceData(null);
        setBalanceRbtc(null);
        setIsLoggedIn(false);
        await window.rLoginDisconnect();
        connect();
        disableLogin();
    };

    const buildInterfaceContext = () => {
        return {
            web3,
            contractStatusData,
            userBalanceData,
            balanceRbtc,
            config,
            account,
            vendorAddress: config.environment.vendor.address
        };
    };

    const interfaceExchangeMethod = async (
        sourceCurrency,
        targetCurrency,
        amount,
        slippage,
        onTransaction,
        onReceipt,
        onError
    ) => {
        const appMode = config.environment.AppMode;
        const appModeString = `APP_MODE_${appMode}`;

        const exchangeCurrencyMap = {
            TX: {
                RESERVE: {
                    APP_MODE_MoC: {
                        exchangeFunction: interfaceRedeemTX
                    },
                    APP_MODE_RRC20: {
                        exchangeFunction: interfaceRedeemTXRRC20
                    }
                }
            },
            TC: {
                RESERVE: {
                    APP_MODE_MoC: {
                        exchangeFunction: interfaceRedeemTC
                    },
                    APP_MODE_RRC20: {
                        exchangeFunction: interfaceRedeemTCRRC20
                    }
                }
            },
            TP: {
                RESERVE: {
                    APP_MODE_MoC: {
                        exchangeFunction: interfaceRedeemTP
                    },
                    APP_MODE_RRC20: {
                        exchangeFunction: interfaceRedeemTPRRC20
                    }
                }
            },
            RESERVE: {
                TC: {
                    APP_MODE_MoC: {
                        exchangeFunction: interfaceMintTC
                    },
                    APP_MODE_RRC20: {
                        exchangeFunction: interfaceMintTCRRC20
                    }
                },
                TP: {
                    APP_MODE_MoC: {
                        exchangeFunction: interfaceMintTP
                    },
                    APP_MODE_RRC20: {
                        exchangeFunction: interfaceMintTPRRC20
                    }
                },
                TX: {
                    APP_MODE_MoC: {
                        exchangeFunction: interfaceMintTX
                    },
                    APP_MODE_RRC20: {
                        exchangeFunction: interfaceMintTXRRC20
                    }
                }
            }
        };

        const exchangeMethod =
            exchangeCurrencyMap[sourceCurrency][targetCurrency][appModeString]
                .exchangeFunction;
        return exchangeMethod(amount, slippage, onTransaction, onReceipt, onError);
    };

    const interfaceMintTP = async (
        amount,
        slippage,
        onTransaction,
        onReceipt,
        onError
    ) => {
        const interfaceContext = buildInterfaceContext();
        await mintTP(
            interfaceContext,
            amount,
            slippage,
            onTransaction,
            onReceipt,
            onError
        );
    };

    const interfaceMintTPRRC20 = async (
        amount,
        slippage,
        onTransaction,
        onReceipt,
        onError
    ) => {
        const interfaceContext = buildInterfaceContext();
        await mintTPRRC20(
            interfaceContext,
            amount,
            slippage,
            onTransaction,
            onReceipt,
            onError
        );
    };

    const interfaceRedeemTP = async (
        amount,
        slippage,
        onTransaction,
        onReceipt,
        onError
    ) => {
        const interfaceContext = buildInterfaceContext();
        await redeemTP(
            interfaceContext,
            amount,
            slippage,
            onTransaction,
            onReceipt,
            onError
        );
    };

    const interfaceRedeemTPRRC20 = async (
        amount,
        slippage,
        onTransaction,
        onReceipt,
        onError
    ) => {
        const interfaceContext = buildInterfaceContext();
        await redeemTPRRC20(
            interfaceContext,
            amount,
            slippage,
            onTransaction,
            onReceipt,
            onError
        );
    };

    const interfaceMintTC = async (
        amount,
        slippage,
        onTransaction,
        onReceipt,
        onError
    ) => {
        const interfaceContext = buildInterfaceContext();
        await mintTC(
            interfaceContext,
            amount,
            slippage,
            onTransaction,
            onReceipt,
            onError
        );
    };

    const interfaceMintTCRRC20 = async (
        amount,
        slippage,
        onTransaction,
        onReceipt,
        onError
    ) => {
        const interfaceContext = buildInterfaceContext();
        await mintTCRRC20(
            interfaceContext,
            amount,
            slippage,
            onTransaction,
            onReceipt,
            onError
        );
    };

    const interfaceRedeemTC = async (
        amount,
        slippage,
        onTransaction,
        onReceipt,
        onError
    ) => {
        const interfaceContext = buildInterfaceContext();
        await redeemTC(
            interfaceContext,
            amount,
            slippage,
            onTransaction,
            onReceipt,
            onError
        );
    };

    const interfaceRedeemTCRRC20 = async (
        amount,
        slippage,
        onTransaction,
        onReceipt,
        onError
    ) => {
        const interfaceContext = buildInterfaceContext();
        await redeemTCRRC20(
            interfaceContext,
            amount,
            slippage,
            onTransaction,
            onReceipt,
            onError
        );
    };

    const interfaceMintTX = async (
        amount,
        slippage,
        onTransaction,
        onReceipt,
        onError
    ) => {
        const interfaceContext = buildInterfaceContext();
        await mintTX(
            interfaceContext,
            amount,
            slippage,
            onTransaction,
            onReceipt,
            onError
        );
    };

    const interfaceMintTXRRC20 = async (
        amount,
        slippage,
        onTransaction,
        onReceipt,
        onError
    ) => {
        const interfaceContext = buildInterfaceContext();
        await mintTXRRC20(
            interfaceContext,
            amount,
            slippage,
            onTransaction,
            onReceipt,
            onError
        );
    };

    const interfaceRedeemTX = async (
        amount,
        slippage,
        onTransaction,
        onReceipt,
        onError
    ) => {
        const interfaceContext = buildInterfaceContext();
        await redeemTX(
            interfaceContext,
            amount,
            slippage,
            onTransaction,
            onReceipt,
            onError
        );
    };

    const interfaceRedeemTXRRC20 = async (
        amount,
        slippage,
        onTransaction,
        onReceipt,
        onError
    ) => {
        const interfaceContext = buildInterfaceContext();
        await redeemTXRRC20(
            interfaceContext,
            amount,
            slippage,
            onTransaction,
            onReceipt,
            onError
        );
    };

    const interfaceApproveTGTokenCommission = async (
        enabled,
        onTransaction,
        onReceipt,
        onError
    ) => {
        const interfaceContext = buildInterfaceContext();
        return approveTGTokenCommission(
            interfaceContext,
            enabled,
            onTransaction,
            onReceipt,
            onError
        );
    };

    const interfaceAllowUseTokenMigrator = async (amount, onTransaction, onReceipt, onError) => {
        const interfaceContext = buildInterfaceContext();
        return AllowUseTokenMigrator(interfaceContext, amount, onTransaction, onReceipt, onError);
    };

    const interfaceMigrateToken = async (onTransaction, onReceipt, onError) => {
        const interfaceContext = buildInterfaceContext();
        return MigrateToken(interfaceContext, onTransaction, onReceipt, onError);
    };

    const initContractsConnection = async () => {
        window.integration = await readContracts(web3, config.environment);
        await loadContractsStatusAndUserBalance();
    };

    const loadContractsStatusAndUserBalance = async () => {
        if (!window.integration) return;
        const appMode = config.environment.AppMode;

        // Read info from different contract MoCState.sol MoCInrate.sol MoCSettlement.sol MoC.sol
        // in one call throught Multicall
        const dataContractStatus = await contractStatus(
            web3,
            window.integration,
            appMode
        );

        const accountBalance = await userBalance(
            web3,
            window.integration,
            account,
            appMode
        );

        setContractStatusData(dataContractStatus);
        setUserBalanceData(accountBalance);
        setBalanceRbtc(web3.utils.fromWei(accountBalance?.rbtcBalance));

        const contracts = {
            bproToken: window.integration.contracts.riskprotoken,
            docToken: window.integration.contracts.stabletoken,
            mocState: window.integration.contracts.mocstate,
            mocInrate: window.integration.contracts.mocinrate,
            mocExchange: window.integration.contracts.mocexchange,
            mocSettlement: window.integration.contracts.mocsettlement,
            moc: window.integration.contracts.moc,
            mocToken: window.integration.contracts.moctoken
        };

        window.appMode = 'MoC';
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
            GasPrice: await interfaceGasPrice(),
            truncatedAddress: truncate_address
        };

        window.address = owner;

        setAccountData(accountData);
    };

    const getAccount = async () => {
        const [owner] = await web3.eth.getAccounts();
        return owner;
    };
    const getBalance = async (address) => {
        try {
            let balance = await web3.eth.getBalance(web3.utils.toChecksumAddress(address));
            balance = web3.utils.fromWei(balance);
            return balance;
        } catch (e) {
            console.log(e);
        }
    };

    const getMoCBalance = async (address) => {
        const from = address || account;
        const dContracts = window.integration;
        const moctoken = dContracts.contracts.moctoken;
        return moctoken.methods.balanceOf(web3.utils.toChecksumAddress(from)).call();
    };

    const getSpendableBalance = async (address) => {
        const from = address || account;
        const dContracts = window.integration;
        const appMode = config.environment.AppMode;

        if (appMode === 'RRC20') {
            const reservetoken = dContracts.contracts.reservetoken;
            return reservetoken.methods.balanceOf(web3.utils.toChecksumAddress(from)).call();
        } else {
            return await web3.eth.getBalance(web3.utils.toChecksumAddress(from));
        }
    };

    const getReserveAllowance = async (address) => {
        const from = address || account;
        const dContracts = window.integration;
        const appMode = config.environment.AppMode;
        if (appMode === 'RRC20') {
            const reservetoken = dContracts.contracts.reservetoken;
            return reservetoken.methods
                .allowance(web3.utils.toChecksumAddress(from), dContracts.contracts.moc._address)
                .call();
        } else {
            return await web3.eth.getBalance(web3.utils.toChecksumAddress(from));
        }
    };

    const getTransactionReceipt = async (hash, callback) => {
        //const web3 = new Web3(provider);
        let transactionReceipt = false;
        let transaction = await web3.eth.getTransactionReceipt(hash);
        if (transaction) {
            transactionReceipt = true;
        }
        return transactionReceipt;
    };

    const toCheckSumAddress = (address) => helper.toCheckSumAddress(address);

    const isCheckSumAddress = (address) => {
        if (address === undefined) return false;
        return helper.isValidAddressChecksum(address);
    };

    const interfaceGasPrice = async () => {
        return getGasPrice(web3);
    };

    const interfaceDecodeEvents = async (receipt) => {
        const txRcp = await web3.eth.getTransactionReceipt(
            receipt.transactionHash
        );
        const filteredEvents = decodeEvents(txRcp);
        return filteredEvents;
    };

    const interfaceStackedBalance = async (address) => {
        const from = address || account;
        return stackedBalance(from);
    };

    const interfaceGetMoCAllowance = async (address) => {
        const from = address || account;
        return getMoCAllowance(from);
    };

    const interfaceLockedBalance = async (address) => {
        const from = address || account;
        return lockedBalance(from);
    };

    const interfacePendingWithdrawals = async (address) => {
        const from = address || account;
        return pendingWithdrawals(from);
    };

    const interfaceStakingDeposit = async (mocs, address, callback) => {
        const from = address || account;
        const interfaceContext = buildInterfaceContext();
        return stakingDeposit(interfaceContext, mocs, address, callback);
    };

    const interfaceUnStake = async (mocs, callback) => {
        const interfaceContext = buildInterfaceContext();
        return unStake(interfaceContext, mocs, callback);
    };

    const interfaceDelayMachineWithdraw = async (id, callback = () => {}) => {
        const interfaceContext = buildInterfaceContext();
        return delayMachineWithdraw(interfaceContext, id, callback);
    };

    const interfaceDelayMachineCancelWithdraw = async (id, callback) => {
        const interfaceContext = buildInterfaceContext();
        return delayMachineCancelWithdraw(interfaceContext, id, callback);
    };

    const interfaceApproveMoCTokenStaking = async (
        enabled,
        callback = () => {}
    ) => {
        const interfaceContext = buildInterfaceContext();
        return approveMoCTokenStaking(interfaceContext, enabled, callback);
    };

    const interfaceTransferTPTo = async (
        to,
        amount,
        onTransaction,
        onReceipt,
        onError
    ) => {
        const interfaceContext = buildInterfaceContext();
        const toWithChecksum = helper.toWeb3CheckSumAddress(to);
        return transferTPTo(
            interfaceContext,
            toWithChecksum,
            amount,
            onTransaction,
            onReceipt,
            onError
        );
    };

    const interfaceTransferTCTo = async (
        to,
        amount,
        onTransaction,
        onReceipt,
        onError
    ) => {
        const interfaceContext = buildInterfaceContext();
        const toWithChecksum = helper.toWeb3CheckSumAddress(to);
        return transferTCTo(
            interfaceContext,
            toWithChecksum,
            amount,
            onTransaction,
            onReceipt,
            onError
        );
    };

    const interfaceTransferTGTo = async (
        to,
        amount,
        onTransaction,
        onReceipt,
        onError
    ) => {
        const interfaceContext = buildInterfaceContext();
        const toWithChecksum = helper.toWeb3CheckSumAddress(to);
        return transferTGTo(
            interfaceContext,
            toWithChecksum,
            amount,
            onTransaction,
            onReceipt,
            onError
        );
    };

    const interfaceTransferRESERVETo = async (
        to,
        amount,
        onTransaction,
        onReceipt,
        onError
    ) => {
        const interfaceContext = buildInterfaceContext();
        const toWithChecksum = helper.toWeb3CheckSumAddress(to);
        return transferRESERVETo(
            interfaceContext,
            toWithChecksum,
            amount,
            onTransaction,
            onReceipt,
            onError
        );
    };

    const interfaceTransferCoinbaseTo = async (
        to,
        amount,
        onTransaction,
        onReceipt,
        onError
    ) => {
        const interfaceContext = buildInterfaceContext();
        const toWithChecksum = helper.toWeb3CheckSumAddress(to);
        return transferCoinbaseTo(
            interfaceContext,
            toWithChecksum,
            amount,
            onTransaction,
            onReceipt,
            onError
        );
    };

    const interfaceCalcMintInterestValues = async (amount) => {
        const interfaceContext = buildInterfaceContext();
        const mintInterest = await calcMintInterest(interfaceContext, amount);
        return mintInterest;
    };

    const interfaceVendorMarkup = (vendorAccount) => {
        const interfaceContext = buildInterfaceContext();
        return vendorMarkup(interfaceContext, vendorAccount);
    };

    const interfaceApproveReserve = (address, callback) => {
        const interfaceContext = buildInterfaceContext();
        return AllowanceUseReserveToken(interfaceContext, true, callback);
    };

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
            TP: { USD: convertDocToUsd, RESERVE: convertDocToRbtc },
            TC: {
                USD: convertBproToUsd,
                RESERVE: convertBproToRbtc,
                TX: convertBproToBprox2
            },
            TX: {
                RESERVE: convertBprox2ToRbtc,
                TC: convertBprox2ToBpro,
                USD: convertBprox2ToUsd
            },
            TG: {
                RESERVE: convertMoCTokenToRbtc,
                USD: convertMoCTokenToUsd
            },
            RESERVE: {
                USD: convertRbtcToUsd,
                TC: convertRbtcToBpro,
                TP: convertRbtcToDoc,
                TX: convertRbtcToBprox2,
                TG: convertRbtcToMoCToken
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
                balanceRbtc,
                contractStatusData,
                isLoggedIn,
                web3,
                getAppMode,
                connect,
                disconnect,
                interfaceExchangeMethod,
                interfaceMintTC,
                interfaceRedeemTC,
                interfaceMintTP,
                interfaceRedeemTP,
                interfaceMintTX,
                interfaceRedeemTX,
                interfaceMintTCRRC20,
                interfaceRedeemTCRRC20,
                interfaceMintTPRRC20,
                interfaceRedeemTPRRC20,
                interfaceMintTXRRC20,
                interfaceRedeemTXRRC20,
                interfaceApproveTGTokenCommission,
                interfaceAllowUseTokenMigrator,
                interfaceMigrateToken,
                getTransactionReceipt,
                interfaceStackedBalance,
                interfaceGetMoCAllowance,
                interfaceLockedBalance,
                interfaceStakingDeposit,
                interfaceUnStake,
                interfaceApproveMoCTokenStaking,
                interfaceDelayMachineWithdraw,
                interfaceDelayMachineCancelWithdraw,
                interfacePendingWithdrawals,
                interfaceTransferTPTo,
                interfaceTransferTCTo,
                interfaceTransferTGTo,
                interfaceTransferRESERVETo,
                interfaceTransferCoinbaseTo,
                interfaceCalcMintInterestValues,
                interfaceVendorMarkup,
                interfaceApproveReserve,
                convertToken,
                getSpendableBalance,
                getReserveAllowance,
                interfaceDecodeEvents,
                loadContractsStatusAndUserBalance
            }}
        >
            {children}
        </AuthenticateContext.Provider>
    );
};

export { AuthenticateContext, AuthenticateProvider };
