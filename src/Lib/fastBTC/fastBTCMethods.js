import io from 'socket.io-client';
import { btcExplorer, currentChainId, fastBtcApis } from './classifiers';

const explorerNetworks = {
  30: 'https://explorer.rsk.co',
  31: 'https://explorer.testnet.rsk.co',
  97: 'https://testnet.bscscan.com/',
  56: 'https://bscscan.com/'
};

export function createSocketConnection() {
  console.log('----- ENTRO A CREATE SOCKET -----');
  const { origin, pathname } = new URL(fastBtcApis[currentChainId]);
  window.btcExplorer = new URL(btcExplorer[currentChainId]);
  const socket = io(`${origin}/`, {
    reconnectionDelayMax: 10000,
    reconnectionAttempts: process.env.NODE_ENV === 'production' ? 15 : 3,
    path: pathname && pathname !== '/' ? pathname : ''
  });
  return socket;
}

export const urlBtcExplorer = new URL(btcExplorer[currentChainId]);
export const urlExplorerUrl = explorerNetworks[parseInt(31)];

export const listenToSocketEvents = socket => {
  console.log('LISTENING TO SOCKET EVENTS');
  console.log(socket);
  socket.on('txAmount', limits => {
    console.log('-----DETECTED NEW LIMITS ------');
    console.log(limits);
  });
  socket.on('depositTx', tx => {
    console.log('-----DETECTED DEPOSIT TX ------');
    console.log(tx);
  });
  socket.on('transferTx', tx => {
    console.log('-----DETECTED TRANSFER TX -------');
    console.log(tx);
  });
  //Deposit error
  socket.on('depositError', error => {
    console.log('----- DETECT DEPOSIT ERROR -----');
    console.log(error);
  });
};

export const closeEvents = socket => {
  socket.off('txAmount');
  socket.off('depositTx');
  socket.off('transferTx');
};

export const closeEventsAndDisconnectSocket = socket => {
  socket.off('txAmount');
  socket.off('depositTx');
  socket.off('transferTx');
  socket.disconnect();
};

export const getBtcAddress = (socket, address) =>
  new Promise(resolve => {
    socket.emit('getDepositAddress', address, (err, res) => {
      resolve({ err, res });
    });
  });

export const getTxAmount = socket => {
  return new Promise(resolve => {
    socket.emit('txAmount', limits => {
      resolve(limits);
    });
  });
};

export const getDepositHistory = (socket, address) => {
  return new Promise(resolve => {
    socket.emit('getDepositHistory', address, res => {
      resolve(res);
    });
  });
};