import React, { useEffect } from 'react';
import MintCard from './Components/MintCard';
import MintData from './Components/MintData';
import AccountData from './Components/AccountData';
import './App.css';
import RLogin, { RLoginButton } from '@rsksmart/rlogin';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Portis from '@portis/web3';
import Torus from '@toruslabs/torus-embed';
import { trezorProviderOptions } from '@rsksmart/rlogin-trezor-provider';
import { ledgerProviderOptions } from '@rsksmart/rlogin-ledger-provider';
import { dcentProviderOptions } from '@rsksmart/rlogin-dcent-provider';
import { useState } from 'react';
import Web3 from 'web3';
import MocAbi from './Contract.json';
import MocConnectorAbi from './MocConnector.json';
import btcContractProvider from './btcContractProvider.json';
import MoCInrate from './MoCInRateContract.json';
import ERC20 from './RC20Contract.json';
const BigNumber = require('bignumber.js');

const rpcUrls = {
    30: 'https://public-node.rsk.co',
    31: 'https://public-node.testnet.rsk.co'
};

const supportedChains = Object.keys(rpcUrls).map(Number);
// construct rLogin pop-up in DOM
export const rLogin = new RLogin({
    providerOptions: {
        walletconnect: {
            package: WalletConnectProvider,
            options: {
                rpc: rpcUrls
            }
        },
        portis: {
            package: Portis,
            options: {
                id: 'a1c8672b-7b1c-476b-b3d0-41c27d575920',
                network: {
                    nodeUrl: 'https://public-node.testnet.rsk.co',
                    chainId: 31
                }
            }
        },
        torus: {
            package: Torus
        },
        'custom-ledger': ledgerProviderOptions,
        'custom-dcent': dcentProviderOptions,
        'custom-trezor': {
            ...trezorProviderOptions,
            options: {
                manifestEmail: 'info@iovlabs.org',
                manifestAppUrl:
                    'https://basic-sample.rlogin.identity.rifos.org/'
            }
        }
    },
    rpcUrls,
    supportedChains
});

function App() {
    const transactionType = 3;
    const [provider, setProvider] = useState(null);
    const [web3, setweb3] = useState(null);
    const [account, setAccount] = useState('');
    const [isLogin, setisLogin] = useState(false);
    const [disconnect, setDisconnect] = useState(null);
    const [showMintForm, setshowMintForm] = useState(false);
    const [MoCToken, setMoCToken] = useState(null);
    const [accountData, setaccountData] = useState({
        Wallet: '',
        Owner: '',
        Balance: 0,
        GasPrice: 0,
        RBTCPrice: 0,
        DoCBalance: 0
    });

    useEffect(() => {
        const filldata = async () => {
            if (account && web3) {
                setaccountData({
                    Wallet: account,
                    Owner: await getAccount(),
                    Balance: await getBalance(account),
                    GasPrice: await getGasPrice(),
                    RBTCPrice: await getBTCPrice(),
                    DoCBalance: await getDoCBalance(account)
                });
            }
        };
        filldata();
    }, [account, web3]);

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
            //Web3
            const web3 = new Web3(provider);
            setweb3(web3);
            // request user's account
            provider.request({ method: 'eth_accounts' }).then(([account]) => {
                console.log(JSON.stringify(account));
                setAccount(account);
                setisLogin(true);
            });
        });

    const callback = (error, transactionHash) => {
        console.log(transactionHash);
        console.log('Mint done ' + transactionHash);
    };

    const DoCMint = async (amount) => {
        console.log('En Mint amount' + amount);
        const getContract = (abi, contractAddress) =>
            new web3.eth.Contract(abi, contractAddress);
        const moc = getContract(
            MocAbi.abi,
            '0x01AD6f8E884ed4DDC089fA3efC075E9ba45C9039'.toLocaleLowerCase()
        );
        //const connectorAddress = await moc.methods.connector().call();
        //const mocConnector = getContract(MocConnectorAbi.abi, connectorAddress);
        const amountWei = web3.utils.toWei(amount);
        console.log('En Mint amountWei' + amountWei);
        const totalAmount = await getTotalAmount(amountWei);
        console.log('En Mint TotalAmount' + totalAmount);
        const estimateGas = await moc.methods
            .mintDocVendors(
                amountWei,
                '0xdda74880d638451e6d2c8d3fc19987526a7af730'.toLocaleLowerCase()
            )
            .estimateGas({ from: account, value: totalAmount });
        return moc.methods
            .mintDocVendors(
                amountWei,
                '0xdda74880d638451e6d2c8d3fc19987526a7af730'.toLocaleLowerCase()
            )
            .send(
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

    const HardcodedMint = async (e) => {
        e.preventDefault();

        const getContract = (abi, contractAddress) =>
            new web3.eth.Contract(abi, contractAddress);
        const moc = getContract(
            MocAbi.abi,
            '0x01AD6f8E884ed4DDC089fA3efC075E9ba45C9039'.toLocaleLowerCase()
        );
        //const connectorAddress = await moc.methods.connector().call();
        //const mocConnector = getContract(MocConnectorAbi.abi, connectorAddress);

        return moc.methods
            .mintDocVendors(
                1000000000000000,
                '0xdda74880d638451e6d2c8d3fc19987526a7af730'.toLocaleLowerCase()
            )
            .send(
                {
                    from: account,
                    value: 1001500000000000, //Importe con comisión incluida
                    gasPrice: web3.utils.toWei(accountData.GasPrice),
                    gas: 1036684,
                    gasLimit: 1036684
                },
                callback
            );
    };
    const getBalance = async (address) => {
        try {
            var balance = await web3.eth.getBalance(address);
            balance = web3.utils.fromWei(balance);
            return balance;
        } catch (e) {
            console.log(e);
        }
    };
    const getAccount = async () => {
        const [owner] = await web3.eth.getAccounts();

        return owner;
    };
    const getGasPrice = async () => {
        try {
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
            '0xb2d705097D9f80D47289EFB2a25bc78FEe9D3e80'.toLocaleLowerCase()
        );

        let tokenBalance = await contract.methods.balanceOf(address).call();

        return tokenBalance;
    };
    const getTotalAmount = async (amount) => {
        const comision = await getCommissionValue(amount);
        console.log('Comision:' + comision);
        const vendorMarkup = await getVendorMarkup(amount);
        console.log('vendorMarkup:' + vendorMarkup);
        return (
            parseFloat(amount) + parseFloat(comision) + parseFloat(vendorMarkup)
        );
    };
    const getCommissionValue = async (amount) => {
        try {
            const getContract = (abi, contractAddress) =>
                new web3.eth.Contract(abi, contractAddress);
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
            const getContract = (abi, contractAddress) =>
                new web3.eth.Contract(abi, contractAddress);
            const mocInrate = getContract(
                MoCInrate.abi,
                '0x8CA7685F69B4bb96D221049Ac84e2F9363ca7F2c'
            );

            const comission = await mocInrate.methods
                .calculateVendorMarkup(
                    '0xdda74880d638451e6d2c8d3fc19987526a7af730',
                    amount
                )
                .call();
            console.log('Vendor Markup:' + comission);

            return comission;
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
            RBTCPrice: 0,
            DoCBalance: 0
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
            {isLogin && (
                <MintCard
                    handleClick={handleClick.bind(this)}
                    Data={accountData}
                />
            )}
            {isLogin && showMintForm && (
                <MintData Mint={DoCMint} Data={accountData} />
            )}
        </div>
    );
}

export default App;
