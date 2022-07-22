import { createContext, useEffect, useState } from 'react';
import getRLogin from '../Lib/rLogin';
import Web3 from 'web3';
import _ from 'lodash/core';
import addressHelper from '../Lib/addressHelper';
import FastBtcSocketWrapper from '../Lib/FastBtcSocketWrapper';
import convertHelper from '../Lib/convertHelper';
import { getPriceFields } from '../Lib/price';
import { config } from '../Config/config';

import { readContracts } from '../Lib/integration/contracts';
import { contractStatus, userBalance } from '../Lib/integration/multicall';
import { mintStable, redeemStable, mintRiskPro, redeemRiskPro, mintRiskProx, redeemRiskProx } from '../Lib/integration/interfaces-coinbase';
import { AllowanceUseReserveToken } from '../Lib/integration/interfaces-rrc20';
import { decodeEvents } from '../Lib/integration/transaction';

import { transferStableTo, transferRiskProTo, transferMocTo, calcMintInterest, approveMoCTokenCommission } from '../Lib/integration/interfaces-base';
import { stackedBalance, lockedBalance, pendingWithdrawals, stakingDeposit, unStake, delayMachineWithdraw, delayMachineCancelWithdraw, approveMoCTokenStaking } from '../Lib/integration/interfaces-omoc';
import { getGasPrice } from '../Lib/integration/utils';

//import createNodeManager from '../Lib/nodeManagerFactory';

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
    interfaceExchangeMethod: async (sourceCurrency, targetCurrency, amount, slippage, onTransaction, onReceipt) => {},
    interfaceMintRiskPro: async (amount, slippage, onTransaction, onReceipt) => {},
    interfaceRedeemRiskPro: async (amount, slippage, onTransaction, onReceipt) => {},
    interfaceMintStable: async (amount, slippage, onTransaction, onReceipt) => {},
    interfaceRedeemStable: async (amount, slippage, onTransaction, onReceipt) => {},
    interfaceMintRiskProx: async (amount, slippage, onTransaction, onReceipt) => {},
    interfaceRedeemRiskProx: async (amount, slippage, onTransaction, onReceipt) => {},
    interfaceApproveMoCTokenCommission: async (enabled, onTransaction, onReceipt) => {},
    disconnect: () => {},
    getTransactionReceipt: (hash) => {},
    interfaceDecodeEvents: async (receipt) => {},
    interfaceStackedBalance: async (address) => {},
    interfaceLockedBalance: async (address) => {},
    interfaceStakingDeposit: async (mocs, address) => {},
    interfaceUnStake: async (mocs) => {},
    interfaceApproveMoCTokenStaking: async (enabled) => {},
    interfaceDelayMachineWithdraw: async (id) => {},
    interfaceDelayMachineCancelWithdraw: async (id) => {},
    interfacePendingWithdrawals: async (address) => {},
    interfaceTransferStableTo: async (to, amount) => {},
    interfaceTransferRiskProTo: async (to, amount) => {},
    interfaceTransferMocTo: async (to, amount) => {},
    interfaceCalcMintInterestValues: async (amount) => {},
    interfaceApproveReserve: async (address) => {},
    convertToken: async (from, to, amount) => {},
    getSpendableBalance: async (address) => {},
    loadContractsStatusAndUserBalance: async (address) => {}
});

const AuthenticateProvider = ({ children }) => {
    const [contractStatusData, setContractStatusData] = useState(null);
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
            } else {
                connect();
                document.querySelectorAll('.rlogin-modal-hitbox')[0].addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); })
            }
        }
    });

    useEffect(() => {
        if (account) {
            initContractsConnection();
            loadAccountData();
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
        setUserBalanceData(null);
        setIsLoggedIn(false);
        await window.rLoginDisconnect();
        connect();
    };

    const buildInterfaceContext = () => {
        return {
            web3,
            contractStatusData,
            userBalanceData,
            config,
            account,
            vendorAddress: config.vendor
        }

    }

    const interfaceExchangeMethod = async (sourceCurrency, targetCurrency, amount, slippage, onTransaction, onReceipt) => {
        const appMode = config.environment.AppMode;
        const appModeString = `APP_MODE_${appMode}`;

        const exchangeCurrencyMap = {
            RISKPROX: {
                RESERVE: {
                    APP_MODE_MoC: {
                        exchangeFunction: interfaceRedeemRiskProx
                    },
                    APP_MODE_RRC20: {
                        exchangeFunction: null
                    }
                }
            },
            RISKPRO: {
                RESERVE: {
                    APP_MODE_MoC: {
                        exchangeFunction: interfaceRedeemRiskPro
                    },
                    APP_MODE_RRC20: {
                        exchangeFunction: null
                    }
                }
            },
            STABLE: {
                RESERVE: {
                    APP_MODE_MoC: {
                        exchangeFunction: interfaceRedeemStable
                    },
                    APP_MODE_RRC20: {
                        exchangeFunction: null
                    }
                }
            },
            RESERVE: {
                RISKPRO: {
                    APP_MODE_MoC: {
                        exchangeFunction: interfaceMintRiskPro
                    },
                    APP_MODE_RRC20: {
                        exchangeFunction: null
                    }
                },
                STABLE: {
                    APP_MODE_MoC: {
                        exchangeFunction: interfaceMintStable
                    },
                    APP_MODE_RRC20: {
                        exchangeFunction: null
                    }
                },
                RISKPROX: {
                    APP_MODE_MoC: {
                        exchangeFunction: interfaceMintRiskProx
                    },
                    APP_MODE_RRC20: {
                        exchangeFunction: null
                    }
                }
            }
        };

        const exchangeMethod = exchangeCurrencyMap[sourceCurrency][targetCurrency][appModeString].exchangeFunction;
        return exchangeMethod(amount, slippage, onTransaction, onReceipt);

    }

    const interfaceMintStable = async (amount, slippage, onTransaction, onReceipt) => {
        const interfaceContext = buildInterfaceContext();
        await mintStable(interfaceContext, amount, slippage, onTransaction, onReceipt);
    }

    const interfaceRedeemStable = async (amount, slippage, onTransaction, onReceipt) => {
        const interfaceContext = buildInterfaceContext();
        await redeemStable(interfaceContext, amount, slippage, onTransaction, onReceipt);
    }

    const interfaceMintRiskPro = async (amount, slippage, onTransaction, onReceipt) => {
        const interfaceContext = buildInterfaceContext();
        await mintRiskPro(interfaceContext, amount, slippage, onTransaction, onReceipt);
    }

    const interfaceRedeemRiskPro = async (amount, slippage, onTransaction, onReceipt) => {
        const interfaceContext = buildInterfaceContext();
        await redeemRiskPro(interfaceContext, amount, slippage, onTransaction, onReceipt);
    }

    const interfaceMintRiskProx = async (amount, slippage, onTransaction, onReceipt) => {
        const interfaceContext = buildInterfaceContext();
        await mintRiskProx(interfaceContext, amount, slippage, onTransaction, onReceipt);
    }

    const interfaceRedeemRiskProx = async (amount, slippage, onTransaction, onReceipt) => {
        const interfaceContext = buildInterfaceContext();
        await redeemRiskProx(interfaceContext, amount, slippage, onTransaction, onReceipt);
    }

    const interfaceApproveMoCTokenCommission = async (enabled, onTransaction, onReceipt) => {
        const interfaceContext = buildInterfaceContext();
        return approveMoCTokenCommission(interfaceContext, enabled, onTransaction, onReceipt);
    };

    const initContractsConnection = async () => {
        window.integration = await readContracts(web3, config.environment);
        await loadContractsStatusAndUserBalance();
    }

    const loadContractsStatusAndUserBalance = async () => {
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

    }

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
            let balance = await web3.eth.getBalance(address);
            balance = web3.utils.fromWei(balance);
            return balance;
        } catch (e) {
            console.log(e);
        }
    };

    const getMoCAllowance = async (address) => {
        const from = address || account;
        const dContracts = window.integration;
        const moctoken = dContracts.contracts.moctoken;
        const moc = dContracts.contracts.moc;
        return moctoken.methods.allowance(from, moc._address).call();
    };

    const getMoCBalance = async (address) => {
        const from = address || account;
        const dContracts = window.integration;
        const moctoken = dContracts.contracts.moctoken;
        return moctoken.methods.balanceOf(from).call();
    }

    const getSpendableBalance = async (address) => {
        const from = address || account;
        return await web3.eth.getBalance(from);
    }

    const getReserveAllowance = async (address) => {
        const from = address || account;
        return await web3.eth.getBalance(from);
    }

    const getTransactionReceipt = async (hash, callback) => {
        //const web3 = new Web3(provider);
        let transactionReceipt = false;
        let transaction = await web3.eth.getTransactionReceipt(hash);
        if (transaction) {
            transactionReceipt = true;
        }
        return transactionReceipt;
    };

    const toCheckSumAddress = address => helper.toCheckSumAddress(address);

    const isCheckSumAddress = address => {
        if (address === undefined) return false;
        return helper.isValidAddressChecksum(address);
    };

    const interfaceGasPrice = async () => {
        return getGasPrice(web3);
    };

    const interfaceDecodeEvents = async (receipt) => {
        const txRcp = await web3.eth.getTransactionReceipt(receipt.transactionHash);
        const filteredEvents = decodeEvents(txRcp);
        return filteredEvents;
    };

    const interfaceStackedBalance = async (address) => {
        const from = address || account;
        return stackedBalance(from);
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

    const interfaceApproveMoCTokenStaking = async (enabled, callback = () => {}) => {
        const interfaceContext = buildInterfaceContext();
        return approveMoCTokenStaking(interfaceContext, enabled, callback);
    };

    const interfaceTransferStableTo = async (to, amount, onTransaction, onReceipt) => {
        const interfaceContext = buildInterfaceContext();
        const toWithChecksum = helper.toWeb3CheckSumAddress(to);
        return transferStableTo(interfaceContext, toWithChecksum, amount, onTransaction, onReceipt);
    };

    const interfaceTransferRiskProTo = async (to, amount, onTransaction, onReceipt) => {
        const interfaceContext = buildInterfaceContext();
        const toWithChecksum = helper.toWeb3CheckSumAddress(to);
        return transferRiskProTo(interfaceContext, toWithChecksum, amount, onTransaction, onReceipt);
    };

    const interfaceTransferMocTo = async (to, amount, onTransaction, onReceipt) => {
        const interfaceContext = buildInterfaceContext();
        const toWithChecksum = helper.toWeb3CheckSumAddress(to);
        return transferMocTo(interfaceContext, toWithChecksum, amount, onTransaction, onReceipt);
    };

    const interfaceCalcMintInterestValues = async (amount) => {
        const interfaceContext = buildInterfaceContext();
        const mintInterest = await calcMintInterest(interfaceContext, amount);
        const formattedValue = new BigNumber(Web3.utils.fromWei(mintInterest));
        return formattedValue;
    };

    const interfaceApproveReserve = (address, callback) => {
        const interfaceContext = buildInterfaceContext();
        AllowanceUseReserveToken(interfaceContext, true, callback);
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
                interfaceExchangeMethod,
                interfaceMintRiskPro,
                interfaceRedeemRiskPro,
                interfaceMintStable,
                interfaceRedeemStable,
                interfaceMintRiskProx,
                interfaceRedeemRiskProx,
                interfaceApproveMoCTokenCommission,
                getTransactionReceipt,
                interfaceStackedBalance,
                interfaceLockedBalance,
                interfaceStakingDeposit,
                interfaceUnStake,
                interfaceApproveMoCTokenStaking,
                interfaceDelayMachineWithdraw,
                interfaceDelayMachineCancelWithdraw,
                interfacePendingWithdrawals,
                interfaceTransferStableTo,
                interfaceTransferRiskProTo,
                interfaceTransferMocTo,
                interfaceCalcMintInterestValues,
                interfaceApproveReserve,
                socket,
                convertToken,
                getSpendableBalance,
                interfaceDecodeEvents,
                loadContractsStatusAndUserBalance
            }}
        >
            {children}
        </AuthenticateContext.Provider>
    );
};

export { AuthenticateContext, AuthenticateProvider };
