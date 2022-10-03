import { createContext, useEffect, useState } from 'react';
import getRLogin from '../Lib/rLogin';
import Web3 from 'web3';
//import _ from 'lodash/core';
import addressHelper from '../Lib/addressHelper';
import FastBtcSocketWrapper from '../Lib/FastBtcSocketWrapper';
//import { getPriceFields } from '../Lib/price';
import { config } from '../Config/config';
import { readContracts } from '../Lib/integration/contracts';
import { contractStatus, userBalance } from '../Lib/integration/multicall';
import { mintStable, redeemStable, mintRiskPro, redeemRiskPro, mintRiskProx, redeemRiskProx } from '../Lib/integration/interfaces-coinbase';
import { AllowanceUseReserveToken,
    mintStableRRC20,
    redeemStableRRC20,
    mintRiskProRRC20,
    redeemRiskProRRC20,
    mintRiskProxRRC20,
    redeemRiskProxRRC20 } from '../Lib/integration/interfaces-rrc20';
import { decodeEvents } from '../Lib/integration/transaction';

import { transferStableTo, transferRiskProTo, transferMocTo,transferRBTCTo, calcMintInterest, approveMoCTokenCommission } from '../Lib/integration/interfaces-base';
import { stackedBalance, lockedBalance, pendingWithdrawals, stakingDeposit, unStake, delayMachineWithdraw, delayMachineCancelWithdraw, approveMoCTokenStaking, getMoCAllowance } from '../Lib/integration/interfaces-omoc';
import { getGasPrice } from '../Lib/integration/utils';
import BigNumber from "bignumber.js";
//import createNodeManager from '../Lib/nodeManagerFactory';

const helper = addressHelper(Web3);

BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_DOWN });

const AuthenticateContext = createContext({
    isLoggedIn: false,
    account: null,
    userBalanceData: null,
    balanceRbtc: null,
    contractStatusData: null,
    web3: null,
    urlBaseFull:null,
    urlBase:null,
    getAppMode:null,
    connect: () => {},
    interfaceExchangeMethod: async (sourceCurrency, targetCurrency, amount, slippage, onTransaction, onReceipt) => {},
    interfaceMintRiskPro: async (amount, slippage, onTransaction, onReceipt) => {},
    interfaceRedeemRiskPro: async (amount, slippage, onTransaction, onReceipt) => {},
    interfaceMintStable: async (amount, slippage, onTransaction, onReceipt) => {},
    interfaceRedeemStable: async (amount, slippage, onTransaction, onReceipt) => {},
    interfaceMintRiskProx: async (amount, slippage, onTransaction, onReceipt) => {},
    interfaceRedeemRiskProx: async (amount, slippage, onTransaction, onReceipt) => {},
    interfaceMintRiskProRRC20: async (amount, slippage, onTransaction, onReceipt) => {},
    interfaceRedeemRiskProRRC20: async (amount, slippage, onTransaction, onReceipt) => {},
    interfaceMintStableRRC20: async (amount, slippage, onTransaction, onReceipt) => {},
    interfaceRedeemStableRRC20: async (amount, slippage, onTransaction, onReceipt) => {},
    interfaceMintRiskProxRRC20: async (amount, slippage, onTransaction, onReceipt) => {},
    interfaceRedeemRiskProxRRC20: async (amount, slippage, onTransaction, onReceipt) => {},
    interfaceApproveMoCTokenCommission: async (enabled, onTransaction, onReceipt) => {},
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
    interfaceTransferStableTo: async (to, amount) => {},
    interfaceTransferRiskProTo: async (to, amount) => {},
    interfaceTransferMocTo: async (to, amount) => {},
    interfaceTransferRBTCTo: async (to, amount) => {},
    interfaceCalcMintInterestValues: async (amount) => {},
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
    const [urlBaseFull, setUrlBaseFull] = useState(process.env.REACT_APP_PUBLIC_URL+process.env.REACT_APP_ENVIRONMENT_APP_PROJECT+'/');
    const [urlBase, setUrlBase] = useState(process.env.REACT_APP_PUBLIC_URL);
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

    // Fast BTC socket
    const socket = new FastBtcSocketWrapper();

    async function loadCss() {
        let css_logout= await import ('../assets/css/logout.scss');
     }

    useEffect(() => {
        if (!window.rLogin) {
            window.rLogin = getRLogin(process.env.REACT_APP_CHAIN_ID);

            if (window.rLogin.cachedProvider) {
                connect();
            } else {
                connect();
                disableLogin();
            }
        }
    });

    const disableLogin = () => {
        document.querySelectorAll('.rlogin-modal-hitbox')[0].addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); })
        loadCss()
    }

    useEffect(() => {
        if (account) {
            initContractsConnection();
            loadAccountData();
        }
    }, [account]);

    useEffect(() => {
        const interval = setInterval(() => {
            if(account){
                loadContractsStatusAndUserBalance();
            }
        }, 30000);
        return () => clearInterval(interval);
    },[account]);

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
            })

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
            vendorAddress: config.vendor.address
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
                        exchangeFunction: interfaceRedeemRiskProxRRC20
                    }
                }
            },
            RISKPRO: {
                RESERVE: {
                    APP_MODE_MoC: {
                        exchangeFunction: interfaceRedeemRiskPro
                    },
                    APP_MODE_RRC20: {
                        exchangeFunction: interfaceRedeemRiskProRRC20
                    }
                }
            },
            STABLE: {
                RESERVE: {
                    APP_MODE_MoC: {
                        exchangeFunction: interfaceRedeemStable
                    },
                    APP_MODE_RRC20: {
                        exchangeFunction: interfaceRedeemStableRRC20
                    }
                }
            },
            RESERVE: {
                RISKPRO: {
                    APP_MODE_MoC: {
                        exchangeFunction: interfaceMintRiskPro
                    },
                    APP_MODE_RRC20: {
                        exchangeFunction: interfaceMintRiskProRRC20
                    }
                },
                STABLE: {
                    APP_MODE_MoC: {
                        exchangeFunction: interfaceMintStable
                    },
                    APP_MODE_RRC20: {
                        exchangeFunction: interfaceMintStableRRC20
                    }
                },
                RISKPROX: {
                    APP_MODE_MoC: {
                        exchangeFunction: interfaceMintRiskProx
                    },
                    APP_MODE_RRC20: {
                        exchangeFunction: interfaceMintRiskProxRRC20
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

    const interfaceMintStableRRC20 = async (amount, slippage, onTransaction, onReceipt) => {
        const interfaceContext = buildInterfaceContext();
        await mintStableRRC20(interfaceContext, amount, slippage, onTransaction, onReceipt);
    }

    const interfaceRedeemStable = async (amount, slippage, onTransaction, onReceipt) => {
        const interfaceContext = buildInterfaceContext();
        await redeemStable(interfaceContext, amount, slippage, onTransaction, onReceipt);
    }

    const interfaceRedeemStableRRC20 = async (amount, slippage, onTransaction, onReceipt) => {
        const interfaceContext = buildInterfaceContext();
        await redeemStableRRC20(interfaceContext, amount, slippage, onTransaction, onReceipt);
    }

    const interfaceMintRiskPro = async (amount, slippage, onTransaction, onReceipt) => {
        const interfaceContext = buildInterfaceContext();
        await mintRiskPro(interfaceContext, amount, slippage, onTransaction, onReceipt);
    }

    const interfaceMintRiskProRRC20 = async (amount, slippage, onTransaction, onReceipt) => {
        const interfaceContext = buildInterfaceContext();
        await mintRiskProRRC20(interfaceContext, amount, slippage, onTransaction, onReceipt);
    }

    const interfaceRedeemRiskPro = async (amount, slippage, onTransaction, onReceipt) => {
        const interfaceContext = buildInterfaceContext();
        await redeemRiskPro(interfaceContext, amount, slippage, onTransaction, onReceipt);
    }

    const interfaceRedeemRiskProRRC20 = async (amount, slippage, onTransaction, onReceipt) => {
        const interfaceContext = buildInterfaceContext();
        await redeemRiskProRRC20(interfaceContext, amount, slippage, onTransaction, onReceipt);
    }

    const interfaceMintRiskProx = async (amount, slippage, onTransaction, onReceipt) => {
        const interfaceContext = buildInterfaceContext();
        await mintRiskProx(interfaceContext, amount, slippage, onTransaction, onReceipt);
    }

    const interfaceMintRiskProxRRC20 = async (amount, slippage, onTransaction, onReceipt) => {
        const interfaceContext = buildInterfaceContext();
        await mintRiskProxRRC20(interfaceContext, amount, slippage, onTransaction, onReceipt);
    }

    const interfaceRedeemRiskProx = async (amount, slippage, onTransaction, onReceipt) => {
        const interfaceContext = buildInterfaceContext();
        await redeemRiskProx(interfaceContext, amount, slippage, onTransaction, onReceipt);
    }

    const interfaceRedeemRiskProxRRC20 = async (amount, slippage, onTransaction, onReceipt) => {
        const interfaceContext = buildInterfaceContext();
        await redeemRiskProxRRC20(interfaceContext, amount, slippage, onTransaction, onReceipt);
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
            return balance
        } catch (e) {
            console.log(e);
        }
    };

    const getMoCBalance = async (address) => {
        const from = address || account;
        const dContracts = window.integration;
        const moctoken = dContracts.contracts.moctoken;
        return moctoken.methods.balanceOf(from).call();
    }

    const getSpendableBalance = async (address) => {
        const from = address || account;
        const dContracts = window.integration;
        const appMode = config.environment.AppMode;

        if (appMode === 'RRC20') {
            const reservetoken = dContracts.contracts.reservetoken;
            return reservetoken.methods.balanceOf(from).call();
        } else {
            return await web3.eth.getBalance(from);
        }

    }

    const getReserveAllowance = async (address) => {
        const from = address || account;
        const dContracts = window.integration;
        const appMode = config.environment.AppMode;
        if (appMode === 'RRC20') {
            const reservetoken = dContracts.contracts.reservetoken;
            return reservetoken.methods.allowance(from, dContracts.contracts.moc._address).call();
        } else {
            return await web3.eth.getBalance(from);
        }

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


    const interfaceGetMoCAllowance = async (address) => {
        const from = address || account;
        return getMoCAllowance(from);
    }

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

    const interfaceTransferRBTCTo = async (to, amount, onTransaction, onReceipt) => {
        const interfaceContext = buildInterfaceContext();
        const toWithChecksum = helper.toWeb3CheckSumAddress(to);
        return transferRBTCTo(interfaceContext, toWithChecksum, amount, onTransaction, onReceipt);
    }

    const interfaceCalcMintInterestValues = async (amount) => {
        const interfaceContext = buildInterfaceContext();
        const mintInterest = await calcMintInterest(interfaceContext, amount);
        return mintInterest;
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
                balanceRbtc,
                contractStatusData,
                isLoggedIn,
                web3,
                urlBaseFull,
                urlBase,
                getAppMode,
                connect,
                disconnect,
                interfaceExchangeMethod,
                interfaceMintRiskPro,
                interfaceRedeemRiskPro,
                interfaceMintStable,
                interfaceRedeemStable,
                interfaceMintRiskProx,
                interfaceRedeemRiskProx,
                interfaceMintRiskProRRC20,
                interfaceRedeemRiskProRRC20,
                interfaceMintStableRRC20,
                interfaceRedeemStableRRC20,
                interfaceMintRiskProxRRC20,
                interfaceRedeemRiskProxRRC20,
                interfaceApproveMoCTokenCommission,
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
                interfaceTransferStableTo,
                interfaceTransferRiskProTo,
                interfaceTransferMocTo,
                interfaceTransferRBTCTo,
                interfaceCalcMintInterestValues,
                interfaceApproveReserve,
                socket,
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
