import { ReactComponent as LogoIconReserve } from '../assets/icons/icon-reserve.svg';
import { ReactComponent as LogoIconTP } from '../assets/icons/icon-tp.svg';
import { ReactComponent as LogoIconTC } from '../assets/icons/icon-tc.svg';
import { ReactComponent as LogoIconTX } from '../assets/icons/icon-tx.svg';
import { ReactComponent as LogoIconTG } from '../assets/icons/icon-tg.svg';
import { ReactComponent as LogoIconRBTC } from '../assets/icons/icon-tg.svg';


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
  { value: 'RESERVE', image: <LogoIconReserve className="currencyImage" /> },
  { value: 'TP', image: <LogoIconTP className="currencyImage" /> },
  { value: 'TC', image: <LogoIconTC className="currencyImage" /> },
  { value: 'TX', image: <LogoIconTX className="currencyImage" /> },
  { value: 'TG', image: <LogoIconTG className="currencyImage" /> },
  { value: 'RBTC', image: <LogoIconRBTC className="currencyImage" /> },
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