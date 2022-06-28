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

const redeemBpro = () => async (memo, amount, callback) => window.nodeManager.redeemBpro(memo, amount, callback);

const buyBproWithRBTC = (txType, commissionCurrencyCode, callback) => async (memo, amount, callback) => window.nodeManager.mintBpro(memo, amount, txType, commissionCurrencyCode, callback);

const buyDocWithRBTC = (txType, commissionCurrencyCode, callback) => async (memo, amount, callback) => window.nodeManager.mintDoc(memo, amount, txType, commissionCurrencyCode, callback);

const buyBprox2WithRBTC = (txType, commissionCurrencyCode, callback) => async (memo, amount, callback) => window.nodeManager.mintBprox2(memo, amount, txType, commissionCurrencyCode, callback);

const redeemBprox2 = () => async (memo, amount, callback) => window.nodeManager.redeemBprox2(memo, amount, callback);

const redeemFreeDoc = () => async (memo, amount, callback) => window.nodeManager.redeemFreeDoc(memo, amount, callback);


// TODO: pasar el txType por param.
const buyCurrencyMap = {
  RISKPROX: {
    RESERVE: {
      MOC_COMMISSION: {
        APP_MODE_MoC: {
          exchangeFunction: redeemBprox2(),
          transactionTypeId: TransactionTypeIdsMoC.REDEEM_BTCX_FEES_MOC
        },
        APP_MODE_RRC20: {
          exchangeFunction: redeemBprox2(),
          transactionTypeId: TransactionTypeIdsRRC20.REDEEM_RISKPROX_FEES_MOC
        }
      },
      RESERVE_COMMISSION: {
        APP_MODE_MoC: {
          exchangeFunction: redeemBprox2(),
          transactionTypeId: TransactionTypeIdsMoC.REDEEM_BTCX_FEES_RBTC

        },
        APP_MODE_RRC20: {
          exchangeFunction: redeemBprox2(),
          transactionTypeId: TransactionTypeIdsRRC20.REDEEM_RISKPROX_FEES_RESERVE
        }
      },
    }
  },
  RISKPRO: {
    RESERVE: {
      MOC_COMMISSION:{
        APP_MODE_MoC: {
          exchangeFunction: redeemBpro(),
          transactionTypeId: TransactionTypeIdsMoC.REDEEM_BPRO_FEES_MOC

        },
        APP_MODE_RRC20: {
          exchangeFunction: redeemBpro(),
          transactionTypeId: TransactionTypeIdsRRC20.REDEEM_RISKPRO_FEES_MOC
        }
      },
      RESERVE_COMMISSION: {
        APP_MODE_MoC: {
          exchangeFunction: redeemBpro(),
          transactionTypeId: TransactionTypeIdsMoC.REDEEM_BPRO_FEES_RBTC

        },
        APP_MODE_RRC20: {
          exchangeFunction: redeemBpro(),
          transactionTypeId: TransactionTypeIdsRRC20.REDEEM_RISKPRO_FEES_RESERVE
        }
      }
    }
  },
  STABLE: {
    RESERVE: {
      MOC_COMMISSION:{
        APP_MODE_MoC: {
          exchangeFunction: redeemFreeDoc(),
          transactionTypeId: TransactionTypeIdsMoC.REDEEM_DOC_FEES_MOC

        },
        APP_MODE_RRC20: {
          exchangeFunction: redeemFreeDoc(),
          transactionTypeId: TransactionTypeIdsRRC20.REDEEM_STABLETOKEN_FEES_MOC
        }
      },
      RESERVE_COMMISSION: {
        APP_MODE_MoC: {
          exchangeFunction: redeemFreeDoc(),
          transactionTypeId: TransactionTypeIdsMoC.REDEEM_DOC_FEES_RBTC

        },
        APP_MODE_RRC20: {
          exchangeFunction: redeemFreeDoc(),
          transactionTypeId: TransactionTypeIdsRRC20.REDEEM_STABLETOKEN_FEES_RESERVE
        }
      }
    }
  },
  RESERVE: {
    RISKPRO: {
      MOC_COMMISSION:{
        APP_MODE_MoC: {
          exchangeFunction: buyBproWithRBTC(TransactionTypeIdsMoC.MINT_BPRO_FEES_MOC, "MOC"),
          transactionTypeId: TransactionTypeIdsMoC.MINT_BPRO_FEES_MOC

        },
        APP_MODE_RRC20: {
          exchangeFunction: buyBproWithRBTC(TransactionTypeIdsRRC20.MINT_RISKPRO_FEES_MOC, "MOC"),
          transactionTypeId: TransactionTypeIdsRRC20.MINT_RISKPRO_FEES_MOC
        }
      },
      RESERVE_COMMISSION: {
        APP_MODE_MoC: {
          exchangeFunction: buyBproWithRBTC(TransactionTypeIdsMoC.MINT_BPRO_FEES_RBTC, "RESERVE"),
          transactionTypeId: TransactionTypeIdsMoC.MINT_BPRO_FEES_RBTC

        },
        APP_MODE_RRC20: {
          exchangeFunction: buyBproWithRBTC(TransactionTypeIdsRRC20.MINT_RISKPRO_FEES_RESERVE, "RESERVE"),
          transactionTypeId: TransactionTypeIdsRRC20.MINT_RISKPRO_FEES_RESERVE
        }
      }
    },
    STABLE: {
      MOC_COMMISSION:{
        APP_MODE_MoC: {
          exchangeFunction: buyDocWithRBTC(TransactionTypeIdsMoC.MINT_DOC_FEES_MOC, "MOC"),
          transactionTypeId: TransactionTypeIdsMoC.MINT_DOC_FEES_MOC

        },
        APP_MODE_RRC20: {
          exchangeFunction: buyDocWithRBTC(TransactionTypeIdsRRC20.MINT_STABLETOKEN_FEES_MOC, "MOC"),
          transactionTypeId: TransactionTypeIdsRRC20.MINT_STABLETOKEN_FEES_MOC
        }
      },
      RESERVE_COMMISSION: {
        APP_MODE_MoC: {
          exchangeFunction: buyDocWithRBTC(TransactionTypeIdsMoC.MINT_DOC_FEES_RBTC, "RESERVE"),
          transactionTypeId: TransactionTypeIdsMoC.MINT_DOC_FEES_RBTC

        },
        APP_MODE_RRC20: {
          exchangeFunction: buyDocWithRBTC(TransactionTypeIdsRRC20.MINT_STABLETOKEN_FEES_RESERVE, "RESERVE"),
          transactionTypeId: TransactionTypeIdsRRC20.MINT_STABLETOKEN_FEES_RESERVE
        }
      }
    },
    RISKPROX: {
      MOC_COMMISSION:{
        APP_MODE_MoC: {
          exchangeFunction: buyBprox2WithRBTC(TransactionTypeIdsMoC.MINT_BTCX_FEES_MOC, "MOC"),
          transactionTypeId: TransactionTypeIdsMoC.MINT_BTCX_FEES_MOC

        },
        APP_MODE_RRC20: {
          exchangeFunction: buyBprox2WithRBTC(TransactionTypeIdsRRC20.MINT_RISKPROX_FEES_MOC, "MOC"),
          transactionTypeId: TransactionTypeIdsRRC20.MINT_RISKPROX_FEES_MOC
        }
      },
      RESERVE_COMMISSION: {
        APP_MODE_MoC: {
          exchangeFunction: buyBprox2WithRBTC(TransactionTypeIdsMoC.MINT_BTCX_FEES_RBTC, "RESERVE"),
          transactionTypeId: TransactionTypeIdsMoC.MINT_BTCX_FEES_RBTC

        },
        APP_MODE_RRC20: {
          exchangeFunction: buyBprox2WithRBTC(TransactionTypeIdsRRC20.MINT_RISKPROX_FEES_RESERVE, "RESERVE"),
          transactionTypeId: TransactionTypeIdsRRC20.MINT_RISKPROX_FEES_RESERVE
        }
      }
    }
  }
};

const appMode = 'MoC' // o RRC20;
const appModeString = `APP_MODE_MoC`;

const getExchangeMethod = (sourceCurrency, targetCurrency, commissionCurrency) =>
  buyCurrencyMap[sourceCurrency][targetCurrency][commissionCurrency][appModeString].exchangeFunction;

const getTargetOptionsFor = currency => {
  if (!Object.prototype.hasOwnProperty.call(buyCurrencyMap, currency))
    // throw new Meteor.Error('not-valid-currency');
  return Object.keys(buyCurrencyMap[currency]);
};

const getDefaultTargetOptionsFor = currency => {
  const targetOptions = getTargetOptionsFor(currency);
  return targetOptions.length ? targetOptions[0] : undefined;
};

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

const getDefaultSourceByTarget = currency =>
  Object.keys(buyCurrencyMap).find(it => Object.keys(buyCurrencyMap[it]).includes(currency));

const getTransactionTypeId = (sourceCurrency, targetCurrency, commissionCurrency) => {
  return buyCurrencyMap[sourceCurrency][targetCurrency][commissionCurrency][appModeString]?.transactionTypeId;
}

const getTransactionType = (sourceCurrency, targetCurrency, commissionCurrency) => {
  let TransactionTypeIds = (appMode === "MoC") ? TransactionTypeIdsMoC : TransactionTypeIdsRRC20;
  return Object.keys(TransactionTypeIds).find(k => TransactionTypeIds[k] === buyCurrencyMap[sourceCurrency][targetCurrency][commissionCurrency][appModeString]?.transactionTypeId);
}

const getSourceOptions = () => Object.keys(buyCurrencyMap);

export {
  getExchangeMethod,
  getTargetOptionsFor,
  getTargetOptions,
  getSourceOptions,
  getDefaultSourceByTarget,
  getDefaultTargetOptionsFor,
  getTransactionTypeId,
  getTransactionType
};
