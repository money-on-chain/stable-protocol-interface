import React, { useEffect } from 'react';
import MintCard from './Components/MintCard';
import MintData from './Components/MintData';
import AccountData from './Components/AccountData';
import './App.css';
import { RLoginButton } from '@rsksmart/rlogin';
import { useState } from 'react';
import Web3 from 'web3';
import MocAbi from './Contract.json';
import MocConnectorAbi from './MocConnector.json';
import btcContractProvider from './btcContractProvider.json';
import rLogin from "./Lib/rLogin";
const BigNumber = require('bignumber.js');

const rpcUrls = {
    30: 'https://public-node.rsk.co',
    31: 'https://public-node.testnet.rsk.co'
};

const supportedChains = Object.keys(rpcUrls).map(Number);

function App() {
    const [provider, setProvider] = useState(null);
    const [account, setAccount] = useState(null);
    const [isLogin, setisLogin] = useState(false);
    const [disconnect, setDisconnect] = useState(null);
    const [showMintForm, setshowMintForm] = useState(false);
    const [MoCToken, setMoCToken] = useState(null);
    const [accountData, setaccountData] = useState({
        Wallet: '',
        Owner: '',
        Balance: 0,
        GasPrice: 0,
        RBTCPrice: 0
    });

    useEffect(() => {
        if (account) loadAccountData();
    }, [account]);

    //Show MintForm
    const handleClick = () => {
        if (showMintForm) {
            setshowMintForm(false);
        } else {
            setshowMintForm(true);
        }
    };
    // display pop up
    const connect = () =>
        rLogin.connect().then(({ provider, disconnect }) => {
            // the provider is used to operate with user's wallet
            setProvider(provider);
            // request user's account
            provider.request({ method: 'eth_accounts' }).then(([account]) => {
                setAccount(account);
                setisLogin(true);
            });
        });

    const loadAccountData = async () => {
        console.log('se ejecutóLoadData:' + account);

        setaccountData({
            Wallet: account,
            Owner: await getAccount(),
            Balance: await getBalance(account),
            GasPrice: await getGasPrice(),
            RBTCPrice: await getBTCPrice()
        });
    };
    const callback = (error, transactionHash) => {
        console.log(transactionHash);
        console.log('Mint done ' + transactionHash);
    };

    const HardcodedMint = async (e) => {
        e.preventDefault();
        const web3 = new Web3(provider);
        const getContract = (abi, contractAddress) =>
            new web3.eth.Contract(abi, contractAddress);
        const moc = getContract(
            MocAbi.abi,
            '0x01AD6f8E884ed4DDC089fA3efC075E9ba45C9039'
        );
        const connectorAddress = await moc.methods.connector().call();
        const mocConnector = getContract(MocConnectorAbi.abi, connectorAddress);

        return moc.methods
            .mintBProVendors(
                1000000000000000,
                '0xdda74880d638451e6d2c8d3fc19987526a7af730'
            )
            .send(
                {
                    from: { account },
                    value: 1001500000000000, //Importe con comisión incluida
                    gasPrice: 72983680,
                    gas: 1036684,
                    gasLimit: 1036684
                },
                callback
            );
    };
    const getBalance = async (address) => {
        try {
            const web3 = new Web3(provider);
            var balance = await web3.eth.getBalance(address);
            balance = web3.utils.fromWei(balance);
            console.log('Balance:' + balance);
            return balance;
        } catch (e) {
            console.log(e);
        }
    };
    const getAccount = async () => {
        const web3 = new Web3(provider);
        const [owner] = await web3.eth.getAccounts();

        return owner;
    };
    const getGasPrice = async () => {
        try {
            console.log('Entre a GasPrice');
            console.log('Provider:' + provider);
            const web3 = new Web3(provider);
            const gasPrice = await web3.eth.getGasPrice();
            console.log('Gas crudo formateado:' + gasPrice);
            return gasPrice;
        } catch (e) {
            console.log(e);
        }
    };

    const getBTCPrice = async () => {
        try {
            console.log('Entre a BTCPrice');
            console.log('Account:' + account);
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
            console.log(formatedPrice);
            return formatedPrice;
        } catch (e) {
            console.log(e);
        }
    };
    const disConnect = async () => {
        await disconnect;
        setDisconnect(null);
        setisLogin(false);
        setProvider(null);
        setAccount(null);
        setaccountData({
            Wallet: '',
            Owner: '',
            Balance: 0,
            GasPrice: 0,
            RBTCPrice: 0
        });
    };

    return (
        <div>
            <div className="App">
                <RLoginButton
                    onClick={() => {
                        if (isLogin) {
                            disConnect();
                        } else {
                            connect();
                        }
                    }}
                >
                    {isLogin ? 'Disconnected wallet' : 'Connect wallet'}
                </RLoginButton>
                {isLogin && <AccountData Data={accountData} />}
            </div>
            {isLogin && (
                <form onSubmit={HardcodedMint}>
                    <button>Hardcoded Mint</button>
                </form>
            )}
            <MintCard handleClick={handleClick.bind(this)} />
            {showMintForm && <MintData />}
        </div>
    );
}

export default App;
