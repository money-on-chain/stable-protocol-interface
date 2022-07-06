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
    interfaceExchangeMethod: async (sourceCurrency, targetCurrency, amount, slippage, callback) => {},
    interfaceMintRiskPro: async (amount, slippage, callback) => {},
    interfaceRedeemRiskPro: async (amount, slippage, callback) => {},
    interfaceMintStable: async (amount, slippage, callback) => {},
    interfaceRedeemStable: async (amount, slippage, callback) => {},
    interfaceMintRiskProx: async (amount, slippage, callback) => {},
    interfaceRedeemRiskProx: async (amount, slippage, callback) => {},
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
    approveReserve: async (address) => {},
    convertToken: async (from, to, amount) => {}
});

const bucketX2 = 'X2';

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
        setIsLoggedIn(false);
        await window.rLoginDisconnect();
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

    const interfaceExchangeMethod = async (sourceCurrency, targetCurrency, amount, slippage, callback) => {
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
      exchangeMethod(amount, slippage, callback).then((res) => console.log(res, callback));

    }

    const interfaceMintStable = async (amount, slippage, callback) => {
      const interfaceContext = buildInterfaceContext();
      await mintStable(interfaceContext, amount, slippage, callback);
    }

    const interfaceRedeemStable = async (amount, slippage, callback) => {
      const interfaceContext = buildInterfaceContext();
      await redeemStable(interfaceContext, amount, slippage, callback);
    }

    const interfaceMintRiskPro = async (amount, slippage, callback) => {
      const interfaceContext = buildInterfaceContext();
      await mintRiskPro(interfaceContext, amount, slippage, callback);
    }

    const interfaceRedeemRiskPro = async (amount, slippage, callback) => {
      const interfaceContext = buildInterfaceContext();
      await redeemRiskPro(interfaceContext, amount, slippage, callback);
    }

    const interfaceMintRiskProx = async (amount, slippage, callback) => {
      const interfaceContext = buildInterfaceContext();
      await mintRiskProx(interfaceContext, amount, slippage, callback);
    }

    const interfaceRedeemRiskProx = async (amount, slippage, callback) => {
      const interfaceContext = buildInterfaceContext();
      await redeemRiskProx(interfaceContext, amount, slippage, callback);
    }

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

      window.nodeManager = await nodeManagerDecorator( await createNodeManager({
            appMode: window.appMode,
            web3: web3,
            contracts,
            mocContractAddress: window.integration.contracts.moc.options.address,
            registryAddress: window.integration.contracts.iregistry.options.address,
            partialExecutionSteps: {
                settlement: 20,
                liquidation: 20
            },
            gasPrice: getGasPrice
      }));

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
            GasPrice: await getGasPrice(),
            truncatedAddress: truncate_address
        };

        window.address = owner;

        setAccountData(accountData);
    };

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
        /*
        try {
            const mocInrate = getContract(MoCInrate.abi, mocInrateAddress);
            const comission = await mocInrate.methods
                .calcCommissionValue(amount, transactionType)
                .call();
            console.log(comission);

            return comission;
        } catch (e) {
            console.log(e);
        }*/

    };

    const getVendorMarkup = async (amount) => {
    /*
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
        */
    };


    const strToBytes32 = (bucket) => web3.utils.asciiToHex(bucket, 32);

    const getDoCBalance = async (address) => {
    /*
        const contract = new web3.eth.Contract(
            ERC20.abi,
            '0xCb46C0DdC60d18eFEB0e586c17AF6Ea36452DaE0'.toLocaleLowerCase()
        );

        let tokenBalance = await contract.methods.balanceOf(address).call();

        return tokenBalance;
    */
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
    /*
        const from = address || account;
        const anAddress = '0x051F724b67bdB72fd059fBb9c62ca56a92500FF9';
        const moc = getContract(IStakingMachine.abi, anAddress);
        let balance = await moc.methods.getBalance(from).call();
        return balance;
    */
    };

    const getLockedBalance = async (address) => {
        /*
        const from = address || account;
        const anAddress = '0x051F724b67bdB72fd059fBb9c62ca56a92500FF9';
        const moc = getContract(IStakingMachine.abi, anAddress);
        let lockedBalance = await moc.methods.getLockedBalance(from).call();
        return lockedBalance;
        */
    };

    const stakingDeposit = async (mocs, address, callback) => {
        /*
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
        */
    };

    const unstake = async (mocs, callback) => {
        /*
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
        */
    };

    const getMoCAllowance = async (address) => {
        /*
        const mocTokenAddress = '0x0399c7F7B37E21cB9dAE04Fb57E24c68ed0B4635';
        const anAddress = '0x051F724b67bdB72fd059fBb9c62ca56a92500FF9';
        const from = address || account;
        const moc = getContract(ERC20.abi, mocTokenAddress);
        return moc.methods.allowance(from, anAddress).call();
        */
    };

    const approveMoCToken = async (enabled, callback = () => {}) => {
        /*
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
        */
    };

    const withdraw = async (id, callback = () => {}) => {
        /*
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
        */
    };

    const cancelWithdraw = async (id, callback) => {
        /*
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
        */
    };

    const getPendingWithdrawals = async (address) => {
        /*
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
        */
    };

    const transferDocTo = async (to, amount, callback) => {
        /*
        const docAddress = '0x489049c48151924c07F86aa1DC6Cc3Fea91ed963';
        const toWithChecksum = helper.toWeb3CheckSumAddress(to);
        const from = account;
        const contractAmount = web3.utils.toWei(amount, 'ether');
        const docToken = getContract(ERC20.abi, docAddress);
        return docToken.methods
            .transfer(toWithChecksum, contractAmount)
            .send({ from, gasPrice: await getGasPrice() }, callback);
        */
    };

    const transferBproTo = async (to, amount, callback) => {
        /*
        const bproAddress = '0x5639809FAFfF9082fa5B9a8843D12695871f68bd';
        const toWithChecksum = helper.toWeb3CheckSumAddress(to);
        const from = account;
        const contractAmount = web3.utils.toWei(amount, 'ether');
        const bproToken = getContract(ERC20.abi, bproAddress);
        return bproToken.methods
            .transfer(toWithChecksum, contractAmount)
            .send({ from, gasPrice: await getGasPrice() }, callback);
        */
    };

    const transferMocTo = async (to, amount, callback) => {
        /*
        const mocTokenAddress = '0x0399c7F7B37E21cB9dAE04Fb57E24c68ed0B4635';
        const toWithChecksum = helper.toWeb3CheckSumAddress(to);
        const from = await module.getAccount();
        const contractAmount = web3.utils.toWei(amount, 'ether');
        const mocToken = getContract(ERC20.abi, mocTokenAddress);
        return mocToken.methods
            .transfer(toWithChecksum, contractAmount)
            .send({ from, gasPrice: await getGasPrice() }, callback);
        */
    };

    const calcMintInterestValues = (amount) => {
        /*
        const mocInrateAddress = '0x8CA7685F69B4bb96D221049Ac84e2F9363ca7F2c';
        const mocInrate = getContract(MoCInrate.abi, mocInrateAddress);
        mocInrate.methods
            .calcMintInterestValues(strToBytes32(bucketX2), amount)
            .call();
        */
    };

    const approveReserve = (address) => {
        /*
        const weiAmount = web3.utils.toWei(Number.MAX_SAFE_INTEGER.toString());
        const reserveTokenAddress = account;
        const reserveToken = getContract(ERC20.abi, reserveTokenAddress);
        const moc = getContract(MocAbi.abi, mocAddress);
        return getGasPrice().then((price) => {
            return reserveToken.methods
                .approve(moc.options.address, weiAmount)
                .send({ from: account, gasPrice: price });
        });
        */
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
                approveReserve,
                socket,
                convertToken
            }}
        >
            {children}
        </AuthenticateContext.Provider>
    );
};

export { AuthenticateContext, AuthenticateProvider };
