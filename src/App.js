import React, { useEffect } from 'react';
import MintCard from './Components/MintCard';
import MintData from './Components/MintData';
import AccountData from './Components/AccountData';
import MintBTCX from './Components/MintBTCX';
import MintBPRO from './Components/MintBPRO';
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
import MocState from './MoCState.json';
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
    const [provider, setProvider] = useState(null);
    const [web3, setweb3] = useState(null);
    const [account, setAccount] = useState('');
    const [isLogin, setisLogin] = useState(false);
    const [isRedeem, setisRedeem] = useState(false);
    const [disconnect, setDisconnect] = useState(null);
    const [showMintForm, setshowMintForm] = useState(false);
    const [mocToken, setMoCToken] = useState(null);
    const [moc, setMoc] = useState(null);
    const [mocState, setMocState] = useState(null);

    const [accountData, setaccountData] = useState({
        Wallet: '',
        Owner: '',
        Balance: 0,
        GasPrice: 0,
        RBTCPrice: 0,
        BPROPrice: 0,
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
                    DoCBalance: await getDoCBalance(account),
                    BPROPrice: await getBproPrice()
                });

                setMoc(getContract(MocAbi.abi, mocAddress));

                setMocState(getContract(MocState.abi, mocStateAddress));
            }
        };
        filldata();
    }, [account, web3]);

    const strToBytes32 = (bucket) => web3.utils.asciiToHex(bucket, 32);

    const getContract = (abi, contractAddress) => {
        return new web3.eth.Contract(abi, contractAddress);
    };

    //Show MintForm
    const handleClick = (isRedeem) => {
        setisRedeem(isRedeem);
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
    const getBproPrice = async () => {
        const contract = new web3.eth.Contract(MocState.abi, mocStateAddress);
        let price = await contract.methods.bproUsdPrice().call();
        price = new BigNumber(web3.utils.fromWei(price)).toFixed(2);

        return price;
    };
    const BPROMint = async (amount) => {
        console.log('En BPROMint amount' + amount);

        const amountWei = web3.utils.toWei(amount);
        console.log('En BPROMint amountWei' + amountWei);
        const totalAmount = await getTotalAmount(
            amountWei,
            TransactionTypeIdsMoC.MINT_BPRO_FEES_RBTC
        );
        console.log('En Mint TotalAmount' + totalAmount);
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

    const DoCMint = async (amount) => {
        console.log('En Mint amount' + amount);

        //const connectorAddress = await moc.methods.connector().call();
        //const mocConnector = getContract(MocConnectorAbi.abi, connectorAddress);
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

    const BPROReedem = async (amount) => {
        console.log('En BPROReedem amount' + amount);

        //const connectorAddress = await moc.methods.connector().call();
        //const mocConnector = getContract(MocConnectorAbi.abi, connectorAddress);
        const amountWei = web3.utils.toWei(amount);
        console.log('En BPROReedem amountWei' + amountWei);
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

    const DoCReedem = async (amount) => {
        console.log('En Redeem amount' + amount);

        //const connectorAddress = await moc.methods.connector().call();
        //const mocConnector = getContract(MocConnectorAbi.abi, connectorAddress);
        const amountWei = web3.utils.toWei(amount);
        console.log('En Redeem amountWei' + amountWei);
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

    const getDoCBalance = async (address) => {
        const contract = new web3.eth.Contract(
            ERC20.abi,
            '0xCb46C0DdC60d18eFEB0e586c17AF6Ea36452DaE0'.toLocaleLowerCase()
        );

        let tokenBalance = await contract.methods.balanceOf(address).call();

        return tokenBalance;
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

    const mintBprox2 = async (btcAmount) => {
        const mocInrate = getContract(
            MoCInrate.abi,
            '0x8CA7685F69B4bb96D221049Ac84e2F9363ca7F2c'
        );
        const from = account;
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

    const redeemBprox2 = async (bprox2Amount) => {
        const from = account;
        const weiAmount = web3.utils.toWei(bprox2Amount, 'ether');
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

    const estimateGasMintBprox2 = async (address, weiAmount, totalBtcAmount) =>
        moc.methods
            .mintBProxVendors(strToBytes32(bucketX2), weiAmount, vendorAddress)
            .estimateGas({ from: address, value: totalBtcAmount });

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
                <MintCard
                    handleClick={handleClick.bind(this)}
                    Data={accountData}
                />
            )}
            {isLogin && showMintForm && (
                <MintData
                    IsRedeem={isRedeem}
                    Mint={DoCMint}
                    Redeem={DoCReedem}
                    Data={accountData}
                />
            )}
            {isLogin && showMintForm && (
                <MintBPRO
                    IsRedeem={isRedeem}
                    Data={accountData}
                    Mint={BPROMint}
                    Redeem={BPROReedem}
                />
            )}
            {isLogin && (
                <MintBTCX
                    Data={accountData}
                    Mint={mintBprox2}
                    Redeem={redeemBprox2}
                />
            )}
        </div>
    );
}

export default App;
