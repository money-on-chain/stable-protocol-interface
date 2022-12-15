import { createContext, useEffect, useState, useContext } from 'react';
import FastBtcBridge from "../../contracts/FastBtcBridge.json";
import {AuthenticateContext} from "../../context/Auth";
import { config } from '../../projects/config';


const FastRbtcContext = createContext({
    limits: null,
    getLimits:  async () => {},
    // connect: () => {},
    loadData: async () => {},
});

const FastRbtcProvider = ({ children }) => {

    let checkLoginFirstTime = true;
    const [provider, setProvider] = useState(null);
    const [account, setAccount] = useState(null);
    const [web3, setweb3] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [limits, setLimits] = useState(null);
    const auth = useContext(AuthenticateContext);

    useEffect(() => {
        if (checkLoginFirstTime) {
            if (window.rLogin.cachedProvider) {
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

    const connect = () => auth.connect();

    const loadData = async () => {
        const fastBtcBridgeAddress = config.environment.fastBtcBridgeAddress;
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