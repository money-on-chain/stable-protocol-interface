import { config } from '../projects/config';

const TransactionTypeIdsMoC = {
  MINT_BPRO_FEES_RBTC: 1,
  REDEEM_BPRO_FEES_RBTC: 2,
  MINT_DOC_FEES_RBTC: 3,
  REDEEM_DOC_FEES_RBTC: 4,
  MINT_BTCX_FEES_RBTC: 5,
  REDEEM_BTCX_FEES_RBTC: 6,
  MINT_BPRO_FEES_MOC: 7,
  REDEEM_BPRO_FEES_MOC: 8,
  MINT_DOC_FEES_MOC: 9,
  REDEEM_DOC_FEES_MOC: 10,
  MINT_BTCX_FEES_MOC: 11,
  REDEEM_BTCX_FEES_MOC: 12,
}
const TransactionTypeIdsRRC20 = {
  MINT_RISKPRO_FEES_RESERVE: 1,
  REDEEM_RISKPRO_FEES_RESERVE: 2,
  MINT_STABLETOKEN_FEES_RESERVE: 3,
  REDEEM_STABLETOKEN_FEES_RESERVE: 4,
  MINT_RISKPROX_FEES_RESERVE: 5,
  REDEEM_RISKPROX_FEES_RESERVE: 6,
  MINT_RISKPRO_FEES_MOC: 7,
  REDEEM_RISKPRO_FEES_MOC: 8,
  MINT_STABLETOKEN_FEES_MOC: 9,
  REDEEM_STABLETOKEN_FEES_MOC: 10,
  MINT_RISKPROX_FEES_MOC: 11,
  REDEEM_RISKPROX_FEES_MOC: 12,
}

// TODO: pasar el txType por param.
const buyCurrencyMap = {
  TX: {
    RESERVE: {
      TG_COMMISSION: {
        APP_MODE_MoC: {
          exchangeFunction: null,
          transactionTypeId: TransactionTypeIdsMoC.REDEEM_BTCX_FEES_MOC
        },
        APP_MODE_RRC20: {
          exchangeFunction: null,
          transactionTypeId: TransactionTypeIdsRRC20.REDEEM_RISKPROX_FEES_MOC
        }
      },
      RESERVE_COMMISSION: {
        APP_MODE_MoC: {
          exchangeFunction: null,
          transactionTypeId: TransactionTypeIdsMoC.REDEEM_BTCX_FEES_RBTC

        },
        APP_MODE_RRC20: {
          exchangeFunction: null,
          transactionTypeId: TransactionTypeIdsRRC20.REDEEM_RISKPROX_FEES_RESERVE
        }
      },
    }
  },
  TC: {
    RESERVE: {
      TG_COMMISSION:{
        APP_MODE_MoC: {
          exchangeFunction: null,
          transactionTypeId: TransactionTypeIdsMoC.REDEEM_BPRO_FEES_MOC

        },
        APP_MODE_RRC20: {
          exchangeFunction: null,
          transactionTypeId: TransactionTypeIdsRRC20.REDEEM_RISKPRO_FEES_MOC
        }
      },
      RESERVE_COMMISSION: {
        APP_MODE_MoC: {
          exchangeFunction: null,
          transactionTypeId: TransactionTypeIdsMoC.REDEEM_BPRO_FEES_RBTC

        },
        APP_MODE_RRC20: {
          exchangeFunction: null,
          transactionTypeId: TransactionTypeIdsRRC20.REDEEM_RISKPRO_FEES_RESERVE
        }
      }
    }
  },
  TP: {
    RESERVE: {
      TG_COMMISSION:{
        APP_MODE_MoC: {
          exchangeFunction: null,
          transactionTypeId: TransactionTypeIdsMoC.REDEEM_DOC_FEES_MOC

        },
        APP_MODE_RRC20: {
          exchangeFunction: null,
          transactionTypeId: TransactionTypeIdsRRC20.REDEEM_STABLETOKEN_FEES_MOC
        }
      },
      RESERVE_COMMISSION: {
        APP_MODE_MoC: {
          exchangeFunction: null,
          transactionTypeId: TransactionTypeIdsMoC.REDEEM_DOC_FEES_RBTC

        },
        APP_MODE_RRC20: {
          exchangeFunction: null,
          transactionTypeId: TransactionTypeIdsRRC20.REDEEM_STABLETOKEN_FEES_RESERVE
        }
      }
    }
  },
  RESERVE: {
    TC: {
      TG_COMMISSION:{
        APP_MODE_MoC: {
          exchangeFunction: null,
          transactionTypeId: TransactionTypeIdsMoC.MINT_BPRO_FEES_MOC

        },
        APP_MODE_RRC20: {
          exchangeFunction: null,
          transactionTypeId: TransactionTypeIdsRRC20.MINT_RISKPRO_FEES_MOC
        }
      },
      RESERVE_COMMISSION: {
        APP_MODE_MoC: {
          exchangeFunction: null,
          transactionTypeId: TransactionTypeIdsMoC.MINT_BPRO_FEES_RBTC

        },
        APP_MODE_RRC20: {
          exchangeFunction: null,
          transactionTypeId: TransactionTypeIdsRRC20.MINT_RISKPRO_FEES_RESERVE
        }
      }
    },
    TP: {
      TG_COMMISSION:{
        APP_MODE_MoC: {
          exchangeFunction: null,
          transactionTypeId: TransactionTypeIdsMoC.MINT_DOC_FEES_MOC

        },
        APP_MODE_RRC20: {
          exchangeFunction: null,
          transactionTypeId: TransactionTypeIdsRRC20.MINT_STABLETOKEN_FEES_MOC
        }
      },
      RESERVE_COMMISSION: {
        APP_MODE_MoC: {
          exchangeFunction: null,
          transactionTypeId: TransactionTypeIdsMoC.MINT_DOC_FEES_RBTC

        },
        APP_MODE_RRC20: {
          exchangeFunction: null,
          transactionTypeId: TransactionTypeIdsRRC20.MINT_STABLETOKEN_FEES_RESERVE
        }
      }
    },
    TX: {
      TG_COMMISSION:{
        APP_MODE_MoC: {
          exchangeFunction: null,
          transactionTypeId: TransactionTypeIdsMoC.MINT_BTCX_FEES_MOC

        },
        APP_MODE_RRC20: {
          exchangeFunction: null,
          transactionTypeId: TransactionTypeIdsRRC20.MINT_RISKPROX_FEES_MOC
        }
      },
      RESERVE_COMMISSION: {
        APP_MODE_MoC: {
          exchangeFunction: null,
          transactionTypeId: TransactionTypeIdsMoC.MINT_BTCX_FEES_RBTC

        },
        APP_MODE_RRC20: {
          exchangeFunction: null,
          transactionTypeId: TransactionTypeIdsRRC20.MINT_RISKPROX_FEES_RESERVE
        }
      }
    }
  }
};


const appMode = config.environment.AppMode
const appModeString = `APP_MODE_${appMode}`;

const getExchangeMethod = (sourceCurrency, targetCurrency, commissionCurrency) => {
    return buyCurrencyMap[sourceCurrency][targetCurrency][commissionCurrency][appModeString].exchangeFunction;
}

/*
const getTargetOptionsFor = currency => {
  if (!Object.prototype.hasOwnProperty.call(buyCurrencyMap, currency))
    // throw new Meteor.Error('not-valid-currency');
  return Object.keys(buyCurrencyMap[currency]);
};
*/
/*
const getDefaultTargetOptionsFor = currency => {
  const targetOptions = getTargetOptionsFor(currency);
  return targetOptions.length ? targetOptions[0] : undefined;
};
*/
/*
const getTargetOptions = (currency) => [
  ...new Set(
    Object.keys(buyCurrencyMap).reduce(
      (accum, it) => {
        if(it === currency) {
          accum.concat(Object.keys(buyCurrencyMap[it]))
        } else if (Object.keys(buyCurrencyMap[it]).includes(currency)) {
          accum.concat([currency]);
        }
      },
      []
    )
  )
];
*/
/*
const getDefaultSourceByTarget = currency =>
  Object.keys(buyCurrencyMap).find(it => Object.keys(buyCurrencyMap[it]).includes(currency));
*/
/*
const getTransactionTypeId = (sourceCurrency, targetCurrency, commissionCurrency) => {
  return buyCurrencyMap[sourceCurrency][targetCurrency][commissionCurrency][appModeString]?.transactionTypeId;
}
*/

const getTransactionType = (sourceCurrency, targetCurrency, commissionCurrency) => {
  let TransactionTypeIds = (appMode === "MoC") ? TransactionTypeIdsMoC : TransactionTypeIdsRRC20;
  return Object.keys(TransactionTypeIds).find(k => TransactionTypeIds[k] === buyCurrencyMap[sourceCurrency][targetCurrency][commissionCurrency][appModeString]?.transactionTypeId);
}

//const getSourceOptions = () => Object.keys(buyCurrencyMap);

export {
  getExchangeMethod,
  //getTargetOptionsFor,
  //getTargetOptions,
  //getSourceOptions,
  //getDefaultSourceByTarget,
  //getDefaultTargetOptionsFor,
  //getTransactionTypeId,
  getTransactionType
};
