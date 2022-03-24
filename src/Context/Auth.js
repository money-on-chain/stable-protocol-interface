import { createContext, useEffect, useState } from 'react';
import rLogin from "../Lib/rLogin";
import Web3 from 'web3';
import btcContractProvider from '../btcContractProvider';
const BigNumber = require('bignumber.js');

const AuthenticateContext = createContext({
    isLoggedIn: false,
    account: null,
    connect: () => {},
    disconnect: () => {},
});

const AuthenticateProvider = ({children}) => {
    const [provider, setProvider] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [account, setAccount] = useState(null);
    const [accountData, setAccountData] = useState({
        Wallet: '',
        Owner: '',
        Balance: 0,
        GasPrice: 0,
        RBTCPrice: 0
    });

    useEffect(() => {
        if (account) loadAccountData();
    }, [account]);

    const connect = () =>
        rLogin.connect().then(({ provider, disconnect }) => {
            // the provider is used to operate with user's wallet
            setProvider(provider);
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
            RBTCPrice: 0
        });
        setIsLoggedIn(false);
    };

    const loadAccountData = async () => {
        const accountData = {
            Wallet: account,
            Owner: await getAccount(),
            Balance: await getBalance(account),
            GasPrice: await getGasPrice(),
            RBTCPrice: await getBTCPrice()
        };
        console.log(accountData);
        setAccountData(accountData);
    };
    const getAccount = async () => {
        const web3 = new Web3(provider);
        const [owner] = await web3.eth.getAccounts();
        return owner;
    };
    const getBalance = async (address) => {
        try {
            const web3 = new Web3(provider);
            let balance = await web3.eth.getBalance(address);
            balance = web3.utils.fromWei(balance);
            return balance;
        } catch (e) {
            console.log(e);
        }
    };
    const getGasPrice = async () => {
        try {
            const web3 = new Web3(provider);
            const gasPrice = await web3.eth.getGasPrice();
            return gasPrice;
        } catch (e) {
            console.log(e);
        }
    };

    const getBTCPrice = async () => {
        try {
            const web3 = new Web3(provider);
            const getContract = (abi, contractAddress) =>
                new web3.eth.Contract(abi, contractAddress);
            const btcpriceGeter = getContract(
                btcContractProvider.abi,
                '0x8BF2f24AfBb9dBE4F2a54FD72748FC797BB91F81'
            );
            const price = await btcpriceGeter.methods
                .peek()
                .call({ from: '0x0000000000000000000000000000000000000001' });

            const formatedPrice = new BigNumber(
                web3.utils.fromWei(price[0])
            ).toNumber();
            return formatedPrice;
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <AuthenticateContext.Provider value={{ account, accountData, isLoggedIn, connect, disconnect }}>
            {children}
        </AuthenticateContext.Provider>
    );
};

export {
    AuthenticateContext,
    AuthenticateProvider
}