import notification from 'antd/lib/notification';
import { login } from '../../client/helpers/loginHelper';
import { Log } from 'meteor/logging';
import { t } from './i18nHelper';
import { getWeb3ByRLoginResponse } from '../../../imports/api/helpers/getWeb3';
import NodeManagerFactory from '../../../imports/api/helpers/nodeManagerFactory';
import NodeManagerDecorator from '../../../imports/client/helpers/nodeManagerDecorator';
const BigNumber = require('bignumber.js');

const enableUserAccount = async nodeManager => {
  if (!nodeManager) {
    const captionNetworks = { 30: 'RSK', 31: 'RSK Testnet', 97: 'BSC Testnet', 56:'BSC Mainnet' };
    const { chainId } = "31" //cambiar a 30 en prod;
    if (window.web3) {
      const getId = await window.web3.eth.net.getId();
      if (parseInt(getId) !== parseInt(chainId)) {
        const correctNetwork = captionNetworks[parseInt(chainId)];
        notification['error']({
          message: 'Invalid network',
          description: `Please select network: ${correctNetwork} in nifty/metamask`,
          duration: 0
        });
      }
    } else {
      notification['error']({
        message: 'No wallet',
        description: `Please verify that you have an installed and active wallet`,
        duration: 0
      });
    }
    {
      connected: false;
    }
  }
  if (window.address) {
    const user = Meteor.user();
    const plainAddress = window.address.toLowerCase();
    let token = localStorage.getItem(plainAddress);
    if (token) {
      if (user && window.address !== user.username) {
        Accounts.logout();
      }
      console.log('User id and token already exist, login with token');
      // If there are a token try to loggin with it
      await new Promise(() => {
        Accounts.loginWithToken(token, function () {
          // CallbackLoginWithToken(plainAddress, () => {});
          CallbackLoginWithToken(plainAddress, () => window.location.reload());
        });
      });
    } else {
      return initializeUserAccount(nodeManager);
    }
  }
};

export const logout = async () => {
  Accounts.logout();
  localStorage.removeItem('selectedProvider');
  localStorage.removeItem(window.address.toLowerCase());
  if (window.rLoginDisconnect) {
    await window.rLoginDisconnect();
  }
  Session.set('rLoginConnected', false);
  window.web3.eth = undefined;
};

export const protectedEnableUserAcc = (function () {
  var executing = false;
  return async function (nodeManager) {
    if (!executing) {
      executing = true;
      const result = await enableUserAccount(nodeManager);
      executing = false;
      return result;
    }
  };
})();

const notifyIncorrectNetwork = () => {
  const { chainId } = Meteor.settings.public;
  const captionNetworks = { 30: 'RSK', 31: 'RSK Testnet', 97: 'BSC Testnet', 56:'BSC Mainnet' };
  const correctNetwork = captionNetworks[parseInt(chainId)];
  notification['error']({
    message: 'Invalid network',
    description: `Please select network: ${correctNetwork} in your wallet`,
    duration: 0
  });
};

export const getWeb3AndDefineNodeManager = async response => {
  try {
    const { chainId } = Meteor.settings.public;
    if (!window.web3 || !window.web3.eth) {
      window.web3 = await getWeb3ByRLoginResponse(response);
    }
    // Check chainid from network, display error message if not correct
    const getId = await web3.eth.net.getId();
    if (parseInt(getId) !== parseInt(chainId)) {
      notifyIncorrectNetwork();
    }
    window.nodeManager = await NodeManagerDecorator(
      await NodeManagerFactory.createNodeManager({
        web3: web3,
        mocContractAddress: Meteor.settings.public.contractAddress.private,
        registryAddress: Meteor.settings.public.staking.registryAddress,
        partialExecutionSteps: Meteor.settings.public.partialExecutionSteps,
        gasPrice: getGasPrice
      })
    );
    const address = await window.nodeManager.getAccount();
    window.address = address;
    window.checksum_address = window.nodeManager.toCheckSumAddress(window.address);

    return true;
  } catch (error) {
    notifyIncorrectNetwork();
    console.error(error);
    Log.error({
      message: 'There was an error creating node manager.'
    });
  }
};

const CallbackLoginWithToken = async (tokenAccount, resolve) => {
  const userId = Meteor.userId();
  if (!userId) {
    // This is invalid address token, so remove from local storage
    console.log('Invalid token removing it ...');
    localStorage.removeItem(tokenAccount);
    localStorage.removeItem('selectedProvider');
  } else {
    const addrLen = window.address.length;
    const truncate_address =
      window.address.substring(0, 6) + '...' + window.address.substring(addrLen - 4, addrLen);

    notification['success']({
      message: t('notifications_onscreen.userAccount.connected.message'),
      description: t('notifications_onscreen.userAccount.connected.description', {
        truncate_address: truncate_address
      }),
      duration: 10
    });

    Session.set('rLoginConnected', true);

    // Force update balance in indexer
    Meteor.call('user.forceUpdate');
  }
  resolve();
};

const initializeUserAccount = async nodeManager => {
  const address = await nodeManager.getAccount();
  //window.address = address;
  const userId = Meteor.userId();
  if (userId) {
    console.log('Retrieving meteor user');
    const user = Meteor.user();
    if (!user) return initializeUserAccount(nodeManager);
    console.log('checking if user', user);
    if (user) {
      if (address !== user.username) {
        console.log('Account change detected, login again');
        Accounts.logout();

        notification['info']({
          message: t('notifications_onscreen.userAccount.signin.message'),
          description: t('notifications_onscreen.userAccount.signin.description'),
          duration: 60
        });

        const res = await login(window.nodeManager);
        res && Session.set('rLoginConnected', true);
      }

      window.address = address;
      window.checksum_address = nodeManager.toCheckSumAddress(address);

      await Meteor.call('user.new', { user, prefLanguage: TAPi18n.getLanguage() });

      // Only truncate to visualize
      const addrLen = address.length;
      const truncate_address =
        address.substring(0, 6) + '...' + address.substring(addrLen - 4, addrLen);

      notification['success']({
        message: t('notifications_onscreen.userAccount.connected.message'),
        description: t('notifications_onscreen.userAccount.connected.description', {
          truncate_address: truncate_address
        }),
        duration: 10
      });
    }
  }
  if (!userId) {
    Log.info({ message: `Creating user for address ${address}` });
    try {
      const res = await login(window.nodeManager);
      if (res) Session.set('rLoginConnected', true);
    } catch (error) {
      Log.error({ error: error, message: 'User failed login in' });
    }
  }
};

export const autoLoginIfPossible = async () => {
  const selectedProvider = window.rLogin.cachedProvider;
  if (!selectedProvider || selectedProvider === '') {
    Session.set('rLoginConnected', false);
    return undefined;
  }
  if (!window.nodeManager) {
    await getWeb3AndDefineNodeManager();
  }
  if (window.address) {
    const user = Meteor.user();
    if (!user) {
      await initializeUserAccount(window.nodeManager);
    }
    const plainAddress = window.address.toLowerCase();
    let token = localStorage.getItem(plainAddress);
    if (token) {
      if (user && window.address !== user.username) {
        Accounts.logout();
      }
      console.log('User id and token already exist, login with token');
      // If there are a token try to loggin with it
      await new Promise(resolve => {
        Accounts.loginWithToken(token, function () {
          CallbackLoginWithToken(plainAddress, resolve);
        });
      });
      return undefined;
    }
  }
};

export const userAccountIsEnabled = () => window.address !== undefined; //&& Meteor.userId();
export const userAccountIsLoggedIn = () => {
  const user = Meteor.user();
  // console.log(`User ${user && user.username} is logged in?`, window.address !== undefined
  // &&  user && user.username
  // && user.username === window.address);
  const isLoggedId =
    window.address !== undefined && user && user.username && user.username === window.address;
  return isLoggedId;
};

export const getGasPrice = async () => {
  const percentage = Meteor.settings.public.defaultPlusPercentageGasPrice;
  let gasPrice;
  try {
    gasPrice = await window.web3.eth.getGasPrice();
  } catch (error) {
    gasPrice = Meteor.settings.public.defaultGasPrice;
  }
  gasPrice = new BigNumber(gasPrice);
  if (!percentage) {
    return gasPrice.toString();
  }
  return gasPrice
    .multipliedBy(percentage * 0.01)
    .plus(gasPrice)
    .toString();
};