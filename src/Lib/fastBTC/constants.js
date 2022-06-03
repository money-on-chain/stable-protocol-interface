export const Step = {
    FIAT: 'FIAT',
    MAIN: 'MAIN',
    WALLET: 'WALLET',
    TRANSAK: 'TRANSAK',
    TRANSACTION: 'TRANSACTION'
  };
  
  export const StepPegOut = {
    STEP_1: 'STEP_1',
    STEP_2: 'STEP_2',
    STEP_3: 'STEP_3',
    STEP_4: 'STEP_4',
    STEP_5: 'STEP_5'
  };
  
  export const TxId = {
    DEPOSIT: 'DEPOSIT',
    TRANSFER: 'TRANSFER'
  };
  
  export const initialState = {
    step: Step.MAIN,
    txId: TxId.DEPOSIT,
    ready: false,
    deposit: {
      loading: false,
      address: '',
      receiver: ''
    },
    history: {
      loading: false,
      items: []
    },
    depositTx: {
      txHash: '',
      value: 0,
      status: ''
    },
    transferTx: {
      txHash: '',
      value: 0,
      status: ''
    },
    limits: {
      min: 0,
      max: 0
    }
  };
  
  export const initialStatePegOut = {
    step: StepPegOut.STEP_1,
    txId: TxId.DEPOSIT,
    ready: false,
    deposit: {
      loading: false,
      address: '',
      receiver: ''
    },
    history: {
      loading: false,
      items: []
    },
    depositTx: {
      txHash: '',
      value: 0,
      status: ''
    },
    transferTx: {
      txHash: '',
      value: 0,
      status: ''
    },
    limits: {
      min: 0,
      max: 0
    },
    inputAddress: '',
    amountToSend: '0',
    tokensToSend: ['RBTC'],
    tokenToSend: 'RBTC',
    maxToSend: '0'
  };
  