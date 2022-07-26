import {
  createSocketConnection,
  listenToSocketEvents
} from './fastBTC/fastBTCMethods';

class DispatcherEvent {
  constructor(eventName) {
    this.eventName = eventName;
    this.callbacks = [];
  }

  registerCallback(callback) {
    this.callbacks.push(callback);
  }

  unregisterCallback(callback) {
    // Get the index of the callback in the callbacks array
    const index = this.callbacks.indexOf(callback);
    // If the callback is in the array then remove it
    if (index > -1) {
      this.callbacks.splice(index, 1);
    }
  }

  fire(data) {
    // We loop over a cloned version of the callbacks array
    // in case the original array is spliced while looping
    const callbacks = this.callbacks.slice(0);
    // loop through the callbacks and call each one
    callbacks.forEach(callback => {
      callback(data);
    });
  }
}

export default class FastBtcSocketWrapper {
  static INITIALIZED_EVENT_NAME = 'wrapper_initialized';

  constructor() {
    this.events = {};
    this._initialized = false;
    this._socket = null;
  }

  initialize() {
    if (this._initialized) {
      return;
    }
    const fastBTCEvents = [
      'txAmount',
      'depositTx',
      'transferTx',
      'depositError',
      'getDepositAddress',
      'getStats',
      'getBalances',
      'getThreshold',
      'getDays',
      'getDeposits',
      'getTransfers',
      'getUsersByAddress'
    ];
    this._socket = createSocketConnection();
    this._socket.on('connect', () => {
      console.log('-------------- SOCKET CONNECTED -------------');
      listenToSocketEvents(this._socket);
      fastBTCEvents.forEach(eventName => {
        this._socket.on(eventName, res => this._trigger(eventName, res));
      });
      this._initialized = true;
      this._trigger(FastBtcSocketWrapper.INITIALIZED_EVENT_NAME);
    });
    this._socket.on('error', error => {
      console.log('-------------- SOCKET ERROR -------------');
      console.error(error);
    });
  }

  _trigger(eventName, eventData) {
    const event = this.events[eventName];
    if (event) {
      event.fire(eventData);
    }
  }

  on(eventName, callbackListener) {
    let event = this.events[eventName];
    if (!event) {
      event = new DispatcherEvent(eventName);
      this.events[eventName] = event;
      console.log(this.events);
    }
    event.registerCallback(callbackListener);
  }

  off(eventName, callbackListener) {
    const event = this.events[eventName];
    if (event && event.callbacks.indexOf(callbackListener) > -1) {
      event.unregisterCallback(callbackListener);
      if (event.callbacks.length === 0) {
        delete this.events[eventName];
      }
    }
  }

  emit(...args) {
    if (this._initialized) {
      this._socket.emit(...args);
    } else {
      const internalCallback = () => {
        this._socket.emit(...args);
        this.off(FastBtcSocketWrapper.INITIALIZED_EVENT_NAME, internalCallback);
      };
      this.on(FastBtcSocketWrapper.INITIALIZED_EVENT_NAME, internalCallback);
    }
  }
}