import { createContext, useEffect, useState } from 'react';
import RLogin  from '@rsksmart/rlogin';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Portis from '@portis/web3';
import Torus from '@toruslabs/torus-embed';
import { trezorProviderOptions } from '@rsksmart/rlogin-trezor-provider';
import { ledgerProviderOptions } from '@rsksmart/rlogin-ledger-provider';
import { dcentProviderOptions } from '@rsksmart/rlogin-dcent-provider';

const rpcUrls = {
    30: 'https://public-node.rsk.co',
    31: 'https://public-node.testnet.rsk.co'
};

const supportedChains = Object.keys(rpcUrls).map(Number);

const AuthenticateContext = createContext({
    isLoggedIn: false,
    account: null,
    connect: () => {},
    disconnect: () => {},
});

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

const AuthenticateProvider = ({children}) => {
    const [provider, setProvider] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [account, setAccount] = useState(null);
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
        setIsLoggedIn(false);
    };

    const loadAccountData = async () => {
        setaccountData({
            Wallet: account,
            // Owner: await getAccount(),
            // Balance: await getBalance(account),
            // GasPrice: await getGasPrice(),
            // RBTCPrice: await getBTCPrice()
        });
    };

    return (
        <AuthenticateContext.Provider value={{ account, setAccount, isLoggedIn, connect, disconnect }}>
            {children}
        </AuthenticateContext.Provider>
    );
};

export {
    AuthenticateContext,
    AuthenticateProvider
}