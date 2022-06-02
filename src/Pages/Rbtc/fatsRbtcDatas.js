import { createContext, useEffect, useState } from 'react';
import rLogin from "../../Lib/rLogin";
import Web3 from "web3";
import FastBtcBridge from "../../Contracts/MoC/abi/FastBtcBridge.json";
import {toNumberFormat} from "../../Helpers/helper";
import {AuthenticateContext} from "../../Context/Auth";


const FastRbtcContext = createContext({
    limits: null,
    getLimits:  async () => {},
    connect: () => {},
    loadData: async () => {},
});

const FastRbtcProvider = ({ children }) => {

    let checkLoginFirstTime = true;
    const [provider, setProvider] = useState(null);
    const [account, setAccount] = useState(null);
    const [web3, setweb3] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [limits, setLimits] = useState(null);

    useEffect(() => {
        if (checkLoginFirstTime) {
            if (rLogin.cachedProvider) {
                connect();
            }
        }
    },checkLoginFirstTime);

    useEffect(() => {
        if (account) {
            // loadAccountData();
            loadData();
        }
    }, [account]);

    const connect = () =>
        rLogin.connect().then((rLoginResponse) => {
            const { provider, disconnect } = rLoginResponse;
            setProvider(provider);

            //const web3 = new Web3(provider);
            setweb3(new Web3(provider));
            window.rLoginDisconnect = disconnect;
            checkLoginFirstTime = false;

            // request user's account
            provider.request({ method: 'eth_accounts' }).then(([account]) => {
                setAccount(account);
                setIsLoggedIn(true);
            });
        });

    const loadData = async () => {
        const fastBtcBridgeAddress = '0x10C848e9495a32acA95F6c23C92eCA2b2bE9903A';
        console.log('Reading fastBtcBridge Contract... address: ', fastBtcBridgeAddress);
        const fastBtcBridge= new web3.eth.Contract(FastBtcBridge, fastBtcBridgeAddress);
        const fastBtcBridgeGetFees = () => {
            return new Promise((resolve, reject) => {
                fastBtcBridge.methods.currentFeeStructureIndex()
                    .call().then(async feeIndex => {
                    const minTransfer = await fastBtcBridge.methods.minTransferSatoshi().call();
                    const maxTransfer = await fastBtcBridge.methods.maxTransferSatoshi().call();
                    fastBtcBridge.methods.feeStructures(feeIndex)
                        .call().then(result => resolve(setLimits({
                        min: minTransfer, max: maxTransfer, baseFee: result.baseFeeSatoshi, dynamicFee: result.dynamicFee
                    })))
                        .catch(error => {
                            console.log(error);
                            reject(error);
                        });
                }).catch(error => {
                    console.log(error);
                    reject(error);
                });
            });
        };

        fastBtcBridgeGetFees().then(result => {
            console.log("execute");
        });
    };


    const getLimits = async () => {
        return "holasss"
    };

    return (
        <FastRbtcContext.Provider
            value={{
                limits,
                getLimits,
                connect,
                loadData
            }}
        >
            {children}
        </FastRbtcContext.Provider>
    );

};


export { FastRbtcContext, FastRbtcProvider };