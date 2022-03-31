import { createContext, useEffect, useState } from 'react';
import rLogin from '../Lib/rLogin';
import Web3 from 'web3';
import btcContractProvider from '../btcContractProvider';
import MocAbi from '../Contract.json';
import MoCInrate from '../MoCInRateContract.json';
import MocState from '../MoCState.json';
import ERC20 from '../RC20Contract';
const BigNumber = require('bignumber.js');

const AuthenticateContext = createContext({
    isLoggedIn: false,
    account: null,
    connect: () => {},
    DoCMint: async (amount) => {},
    DoCReedem: async (amount) => {},
    BPROMint: async (amount) => {},
    BPROReedem: async (amount) => {},
    disconnect: () => {}
});

let checkLoginFirstTime = true;
const vendorAddress = '0xdda74880d638451e6d2c8d3fc19987526a7af730';
const mocStateAddress = '0xfb526c0Ace90f52049691389B040a33D03343eb7';
const mocAddress = '0x01AD6f8E884ed4DDC089fA3efC075E9ba45C9039';
const btcProviderAddress = '0x8BF2f24AfBb9dBE4F2a54FD72748FC797BB91F81';
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
            const { provider, disconnect } = rLoginResponse;
            setProvider(provider);

            const web3 = new Web3(provider);
            setweb3(web3);
            window.rLoginDisconnect = disconnect;

            if (rLoginResponse.authKeys) {
                console.log(
                    rLoginResponse.authKeys.refreshToken,
                    rLoginResponse.authKeys.accessToken
                );
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
            owner.substring(0, 6) +
            '...' +
            owner.substring(owner.length - 4, owner.length);
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
            const web3 = new Web3(provider);
            let gasPrice = await web3.eth.getGasPrice();
            gasPrice = web3.utils.fromWei(gasPrice);
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
                btcProviderAddress
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
    const getBproPrice = async () => {
        const web3 = new Web3(provider);
        const contract = new web3.eth.Contract(MocState.abi, mocStateAddress);
        let price = await contract.methods.bproUsdPrice().call();
        price = new BigNumber(web3.utils.fromWei(price)).toFixed(2);

        return price;
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
            const mocInrate = getContract(
                MoCInrate.abi,
                '0x8CA7685F69B4bb96D221049Ac84e2F9363ca7F2c'
            );
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
            const mocInrate = getContract(
                MoCInrate.abi,
                '0x8CA7685F69B4bb96D221049Ac84e2F9363ca7F2c'
            );

            const comission = await mocInrate.methods
                .calculateVendorMarkup(vendorAddress, amount)
                .call();
            console.log('Vendor Markup:' + comission);

            return comission;
        } catch (e) {
            console.log(e);
        }
    };

    const DoCMint = async (amount, callback) => {
        console.log('En Mint amount' + amount);
        const web3 = new Web3(provider);
        const moc = getContract(MocAbi.abi, mocAddress);
        const amountWei = web3.utils.toWei(amount);
        console.log('En Mint amountWei' + amountWei);
        const totalAmount = await getTotalAmount(
            amountWei,
            TransactionTypeIdsMoC.MINT_DOC_FEES_RBTC
        );
        console.log('En Mint TotalAmount' + totalAmount);
        const estimateGas = await moc.methods
            .mintDocVendors(amountWei, vendorAddress)
            .estimateGas({ from: account, value: totalAmount });
        console.log('Estimate gas' + estimateGas);
        console.log('Gas Price' + web3.utils.toWei(accountData.GasPrice));
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

    return (
        <AuthenticateContext.Provider
            value={{
                account,
                accountData,
                isLoggedIn,
                connect,
                disconnect,
                DoCMint,
                DoCReedem,
                BPROMint,
                BPROReedem
            }}
        >
            {children}
        </AuthenticateContext.Provider>
    );
};

export { AuthenticateContext, AuthenticateProvider };
