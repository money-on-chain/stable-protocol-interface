import { createContext, useEffect, useState } from 'react';
import rLogin from "../Lib/rLogin";
import Web3 from 'web3';
import btcContractProvider from '../btcContractProvider';
import ERC20 from '../RC20Contract';
import MocState from '../MoCState';
const BigNumber = require('bignumber.js');

const AuthenticateContext = createContext({
    isLoggedIn: false,
    account: null,
    connect: () => {},
    disconnect: () => {},
});

let checkLoginFirstTime = true;

const AuthenticateProvider = ({children}) => {
    const mocStateAddress = '0xfb526c0Ace90f52049691389B040a33D03343eb7';
    const [provider, setProvider] = useState(null);
    const [web3, setweb3] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [account, setAccount] = useState(null);
    const [accountData, setAccountData] = useState({
        Wallet: '',
        Owner: '',
        Balance: 0,
        GasPrice: 0,
        RBTCPrice: 0,
        BPROPrice: 0,
        DoCBalance: 0,
        truncatedAddress: ''
    });

    useEffect(() => {
        if (checkLoginFirstTime) {
            if (rLogin.cachedProvider) {
                connect();
            }
            checkLoginFirstTime = false;
        }
    });

    useEffect(() => {
        if (account) loadAccountData();
    }, [account]);

    const connect = () =>
        rLogin.connect().then((rLoginResponse) => {
            const {provider, disconnect} = rLoginResponse;
            setProvider(provider);

            const web3 = new Web3(provider);
            setweb3(web3);
            window.rLoginDisconnect = disconnect;

            if (rLoginResponse.authKeys) {
                console.log(rLoginResponse.authKeys.refreshToken, rLoginResponse.authKeys.accessToken);
            }
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
            RBTCPrice: 0,
            truncatedAddress: ''
        });
        setIsLoggedIn(false);
        await window.rLoginDisconnect();
    };

    const loadAccountData = async () => {
        const owner = await getAccount();
        const truncate_address =
            owner.substring(0, 6) + '...' + owner.substring(owner.length - 4, owner.length);
        const accountData = {
            Wallet: account,
            Owner: owner,
            Balance: await getBalance(account),
            GasPrice: await getGasPrice(),
            RBTCPrice: await getBTCPrice(),
            DoCBalance: await getDoCBalance(account),
            BPROPrice: await getBproPrice(),
            truncatedAddress: truncate_address
        };
        console.log(accountData);
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
    const getGasPrice = async () => {
        try {
            const gasPrice = await web3.eth.getGasPrice();
            return gasPrice;
        } catch (e) {
            console.log(e);
        }
    };

    const getBTCPrice = async () => {
        try {
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

    const getDoCBalance = async (address) => {
        const contract = new web3.eth.Contract(
            ERC20.abi,
            '0xCb46C0DdC60d18eFEB0e586c17AF6Ea36452DaE0'.toLocaleLowerCase()
        );

        let tokenBalance = await contract.methods.balanceOf(address).call();

        return tokenBalance;
    };

    const getBproPrice = async () => {
        const contract = new web3.eth.Contract(MocState.abi, mocStateAddress);
        let price = await contract.methods.bproUsdPrice().call();
        price = new BigNumber(web3.utils.fromWei(price)).toFixed(2);

        return price;
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