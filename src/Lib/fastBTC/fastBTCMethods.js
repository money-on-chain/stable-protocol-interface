import io from 'socket.io-client';
import { btcExplorer, currentChainId, fastBtcApis } from './classifiers';

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

export const getTxAmount = socket => {
  return new Promise(resolve => {
    socket.emit('txAmount', limits => {
      resolve(limits);
    });
  });
};