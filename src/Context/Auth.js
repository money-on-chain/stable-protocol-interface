import { createContext, useEffect, useState } from 'react';
import rLogin from '../Lib/rLogin';
import Web3 from 'web3';
import btcContractProvider from '../Contracts/MoC/abi/btcContractProvider';
import MocAbi from '../Contracts/MoC/abi/Contract.json';
import MoCInrate from '../Contracts/MoC/abi/MoCInRateContract.json';
import MocState from '../Contracts/MoC/abi/MoCState.json';
import MultiCall from '../Contracts/MoC/abi/Multicall2.json';
import MoCExchange from '../Contracts/MoC/abi/MoCExchange.json';
import MoCSettlement from '../Contracts/MoC/abi/MoCSettlement.json';
import DocToken from '../Contracts/MoC/abi/DocToken.json';
import BProToken from '../Contracts/MoC/abi/BProToken.json';
import MoCToken from '../Contracts/MoC/abi/MoCToken.json';
import ERC20 from '../Contracts/MoC/abi/RC20Contract';
import {
    connectorAddresses,
    contractStatus,
    userBalance
} from './MultiCallFunctions.js';
const BigNumber = require('bignumber.js');

const AuthenticateContext = createContext({
    isLoggedIn: false,
    account: null,
    userBalanceData: null,
    contractStatusData: null,
    connect: () => {},
    DoCMint: async (amount) => {},
    DoCReedem: async (amount) => {},
    BPROMint: async (amount) => {},
    BPROReedem: async (amount) => {},
    Bprox2Mint: async (amount) => {},
    Bprox2Redeem: async (amount) => {},
    disconnect: () => {}
});

let checkLoginFirstTime = true;
const vendorAddress = '0xdda74880d638451e6d2c8d3fc19987526a7af730';
let mocStateAddress = '';
const mocAddress = '0x01AD6f8E884ed4DDC089fA3efC075E9ba45C9039';
const btcProviderAddress = '0x8BF2f24AfBb9dBE4F2a54FD72748FC797BB91F81';
let mocInrateAddress = '';
let mocExchangeAddress = '';
let mocSettlementAddress = '';
let docTokenAddress = '';
let bproTokenAddress = '';
const multicall2 = '0xaf7be1ef9537018feda5397d9e3bb9a1e4e27ac8';
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
    const [contractStatusData, setcontractStatusData] = useState(null);
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

    useEffect(() => {
        if (checkLoginFirstTime) {
            if (rLogin.cachedProvider) {
                connect();
            }
            checkLoginFirstTime = false;
        }
    });

    useEffect(() => {
        if (account) {
            loadAccountData();
            loadBalanceData();
        }
    }, [account]);

    const connect = () =>
        rLogin.connect().then((rLoginResponse) => {
            const { provider, disconnect } = rLoginResponse;
            setProvider(provider);

            const web3 = new Web3(provider);
            setweb3(web3);
            window.rLoginDisconnect = disconnect;

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

        setAccountData(accountData);
    };
    const loadBalanceData = async () => {
        console.log('Reading Multicall2 Contract... address: ', multicall2);
        const multicall = new web3.eth.Contract(MultiCall.abi, multicall2);

        console.log('Reading MoC Contract... address: ', mocAddress);
        const moc = new web3.eth.Contract(MocAbi.abi, mocAddress);

        // Read contracts addresses from connector
        [
            mocStateAddress,
            mocInrateAddress,
            mocExchangeAddress,
            mocSettlementAddress,
            docTokenAddress,
            bproTokenAddress
        ] = await connectorAddresses(web3, multicall, moc);

        console.log('Reading MoC State Contract... address: ', mocStateAddress);
        const mocstate = new web3.eth.Contract(MocState.abi, mocStateAddress);

        console.log(
            'Reading MoC Inrate Contract... address: ',
            mocInrateAddress
        );
        const mocinrate = new web3.eth.Contract(
            MoCInrate.abi,
            mocInrateAddress
        );

        console.log(
            'Reading MoC Exchange Contract... address: ',
            mocExchangeAddress
        );
        const mocexchange = new web3.eth.Contract(
            MoCExchange.abi,
            mocExchangeAddress
        );

        console.log(
            'Reading MoC Settlement  Contract... address: ',
            mocSettlementAddress
        );
        const mocsettlement = new web3.eth.Contract(
            MoCSettlement.abi,
            mocSettlementAddress
        );

        console.log('Reading DoC Token Contract... address: ', docTokenAddress);
        const doctoken = new web3.eth.Contract(DocToken.abi, docTokenAddress);

        console.log(
            'Reading BPro Token Contract... address: ',
            bproTokenAddress
        );
        const bprotoken = new web3.eth.Contract(
            BProToken.abi,
            bproTokenAddress
        );

        const mocTokenAddress = await mocstate.methods.getMoCToken().call();

        console.log('Reading MoC Token Contract... address: ', mocTokenAddress);
        const moctoken = new web3.eth.Contract(MoCToken.abi, mocTokenAddress);

        // Read info from different contract MoCState.sol MoCInrate.sol MoCSettlement.sol MoC.sol
        // in one call throught Multicall
        const dataContractStatus = await contractStatus(
            web3,
            multicall,
            moc,
            mocstate,
            mocinrate,
            mocsettlement
        );

        console.log(dataContractStatus);
        setcontractStatusData(dataContractStatus);

        const user_address = account;

        // Example user balance
        const user_balance = await userBalance(
            web3,
            multicall,
            moc,
            mocinrate,
            moctoken,
            bprotoken,
            doctoken,
            user_address
        );

        setUserBalanceData(user_balance);
        console.log(user_balance);
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
            const mocInrate = getContract(MoCInrate.abi, mocInrateAddress);
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
            const mocInrate = getContract(MoCInrate.abi, mocInrateAddress);

            const comission = await mocInrate.methods
                .calculateVendorMarkup(vendorAddress, amount)
                .call();
            console.log('Vendor Markup:' + comission);

            return comission;
        } catch (e) {
            console.log(e);
        }
    };

    const estimateGasMintBprox2 = async (
        address,
        weiAmount,
        totalBtcAmount
    ) => {
        const moc = getContract(MocAbi.abi, mocAddress);
        moc.methods
            .mintBProxVendors(strToBytes32(bucketX2), weiAmount, vendorAddress)
            .estimateGas({ from: address, value: totalBtcAmount });
    };

    const strToBytes32 = (bucket) => web3.utils.asciiToHex(bucket, 32);

    const DoCMint = async (amount, callback) => {
        const web3 = new Web3(provider);
        const moc = getContract(MocAbi.abi, mocAddress);
        const amountWei = web3.utils.toWei(amount);
        const totalAmount = await getTotalAmount(
            amountWei,
            TransactionTypeIdsMoC.MINT_DOC_FEES_RBTC
        );

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
    const Bprox2Mint = async (btcAmount, callback) => {
        const mocInrate = getContract(MoCInrate.abi, mocInrateAddress);
        const from = account;
        const moc = getContract(MocAbi.abi, mocAddress);
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

    const Bprox2Redeem = async (bprox2Amount, callback) => {
        const from = account;
        const weiAmount = web3.utils.toWei(bprox2Amount, 'ether');
        const moc = getContract(MocAbi.abi, mocAddress);
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
    return (
        <AuthenticateContext.Provider
            value={{
                account,
                accountData,
                userBalanceData,
                contractStatusData,
                isLoggedIn,
                connect,
                disconnect,
                DoCMint,
                DoCReedem,
                BPROMint,
                BPROReedem,
                Bprox2Mint,
                Bprox2Redeem
            }}
        >
            {children}
        </AuthenticateContext.Provider>
    );
};

export { AuthenticateContext, AuthenticateProvider };
