//import RLogin  from '@rsksmart/rlogin';
//import WalletConnectProvider from '@walletconnect/web3-provider';
//import { trezorProviderOptions } from '@rsksmart/rlogin-trezor-provider';
//import { ledgerProviderOptions } from '@rsksmart/rlogin-ledger-provider';
//import { dcentProviderOptions } from '@rsksmart/rlogin-dcent-provider';

const getRLogin = () => {

    const rpcUrls = {
        30: 'https://public-node.rsk.co',
        31: 'https://public-node.testnet.rsk.co'
    };

    const chainId = 31;
    var selectedNetwork = {};
    selectedNetwork[parseInt(chainId)] = rpcUrls[parseInt(chainId)];

    const supportedChains = Object.keys(rpcUrls).map(Number);

    const rLogin = new window.RLogin.default({
        cacheProvider: true,
        providerOptions: {
            'custom-ledger': {
                ...window.rLoginLedgerProvider.ledgerProviderOptions,
                options: {
                  rpcUrl: rpcUrls[parseInt(chainId, 10)],
                  chainId: parseInt(chainId, 10)
                }
            },
            'custom-dcent': {
              ...window.rLoginDCentProvider.dcentProviderOptions,
              options: {
                rpcUrl: rpcUrls[parseInt(chainId)],
                chainId: parseInt(chainId),
                debug: true
              }
            },
            'custom-trezor': {
                ...window.rLoginTrezorProvider.trezorProviderOptions,
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
}



export default getRLogin;