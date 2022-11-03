const getBalanceAndTransferMethodOfTokenToSend = (userState, currencyCode, auth) => {
  if(!userState) return {};
  switch (currencyCode) {
    case 'TC':
      return {
        amount: userState?.bproBalance,
        methodTransferTo: auth?.interfaceTCTo,
      };
    case 'TP':
      return {
        amount: userState?.docBalance,
        methodTransferTo: auth?.interfaceTransferTPTo,
      };
    case 'TG':
      return{
        amount:userState?.mocBalance,
        methodTransferTo: auth?.interfaceTransferTGTo,
      }
    case 'RESERVE':
      return {
        amount:userState?.rbtcBalance,
        methodTransferTo: auth?.interfaceTransferCoinbaseTo,
      }
    default:
      return {};
  }
};

const getMaxAvailableOfCurrencyCode = (mocState, currencyCode, isRedeem) => {
  switch (currencyCode) {
    case 'TC':
      return mocState.bproAvailableToRedeem;
    case 'TP':
      return isRedeem ? mocState.docAvailableToRedeem : mocState.docAvailableToMint;
    case 'TX':
      return mocState.bprox2AvailableToMint;
    default:
      return undefined;
  }
};

const currencies = [
  { value: 'RESERVE',     image:  process.env.REACT_APP_ENVIRONMENT_APP_PROJECT+ "/icon-reserve.svg" },
  { value: 'TP',      image:  process.env.REACT_APP_ENVIRONMENT_APP_PROJECT+ "/icon-tp.svg" },
  { value: 'TC',     image: process.env.REACT_APP_ENVIRONMENT_APP_PROJECT+ "/icon-tc.svg" },
  { value: 'TX',    image:  process.env.REACT_APP_ENVIRONMENT_APP_PROJECT+ "/icon-tx.svg" },
  { value: 'TG',         image:  process.env.REACT_APP_ENVIRONMENT_APP_PROJECT+ "/icon-tg.svg" },
  { value: 'RBTC',         image:  process.env.REACT_APP_ENVIRONMENT_APP_PROJECT+ "/icon-tg.svg" },
].map(it => ({
  ...it,
  longNameKey: `${process.env.REACT_APP_ENVIRONMENT_APP_PROJECT}.Tokens_${it.value}_code`,
}));

const getCurrenciesDetail = () => currencies;
const getCurrencyDetail = currencyCode => currencies.find(it => it.value === currencyCode);

export {
  getBalanceAndTransferMethodOfTokenToSend,
  currencies,
  getMaxAvailableOfCurrencyCode,
  getCurrenciesDetail,
  getCurrencyDetail
}