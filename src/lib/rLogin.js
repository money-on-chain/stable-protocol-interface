import RLogin from '@rsksmart/rlogin';
import { WalletConnect2Provider } from '@rsksmart/rlogin-walletconnect2-provider';
import { ledgerProviderOptions } from '@rsksmart/rlogin-ledger-provider';
import { dcentProviderOptions } from '@rsksmart/rlogin-dcent-provider';
import { trezorProviderOptions } from '@rsksmart/rlogin-trezor-provider';
import { config } from '../projects/config';

const getRLogin = (port) => {
    let rpcUrls = {};

    if (parseInt(port) === 31) {
        rpcUrls = {
            31: 'https://public-node.testnet.rsk.co'
        };
    }
    if (parseInt(port) === 30) {
        rpcUrls = {
            30: 'https://public-node.rsk.co'
        };
    }

    const chainId = config.environment.chainId;
    var selectedNetwork = {};
    selectedNetwork[parseInt(chainId)] = rpcUrls[parseInt(chainId)];

    const supportedChains = Object.keys(rpcUrls).map(Number);

    const rLogin = new RLogin({
        cacheProvider: false,
        providerOptions: {
            walletconnect: {
                package: WalletConnect2Provider,
                options: {
                    projectId: process.env.REACT_APP_RLOGIN_WALLETCONNECT2_PROJECTID,
                    chains: [parseInt(chainId, 10)],
                    showQrModal: true,
                    rpcMap: rpcUrls
                }
            },
            'custom-ledger': {
                ...ledgerProviderOptions,
                options: {
                    rpcUrl: rpcUrls[parseInt(chainId, 10)],
                    chainId: parseInt(chainId, 10)
                }
            },
            'custom-dcent': {
                ...dcentProviderOptions,
                options: {
                    rpcUrl: rpcUrls[parseInt(chainId)],
                    chainId: parseInt(chainId),
                    debug: true
                }
            },
            'custom-trezor': {
                ...trezorProviderOptions,
                options: {
                    rpcUrl: rpcUrls[parseInt(chainId, 10)],
                    chainId: parseInt(chainId, 10),
                    manifestEmail: 'info@moneyonchain.com',
                    manifestAppUrl: 'https://moneyonchain.com/'
                }
            }
        },
        rpcUrls: selectedNetwork,
        supportedChains
    });

    return rLogin;
};

export default getRLogin;
