import { useContext } from 'react';
import { AuthenticateContext } from '../Context/Auth';
const BigNumber = require('bignumber.js');
BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_DOWN });

export default function ConvertHelper() {
  const auth = useContext(AuthenticateContext);
  const { contractStatusData } = auth;
  const convertDocToUsd = amount => amount;
  const convertBproToRbtc = amount => amount.times(contractStatusData.bproPriceInRbtc).div(contractStatusData.reservePrecision);
  const convertBproToUsd = amount => amount.times(contractStatusData.bproPriceInUsd).div(contractStatusData.reservePrecision);
  const convertDocToRbtc = amount => amount.div(contractStatusData.bitcoinPrice).times(contractStatusData.reservePrecision);
  const convertRbtcToUsd = amount => amount.times(contractStatusData.bitcoinPrice).div(contractStatusData.reservePrecision);
  const convertRbtcToBpro = amount => amount.div(contractStatusData.bproPriceInRbtc).times(contractStatusData.reservePrecision);
  const convertRbtcToDoc = amount => convertRbtcToUsd(amount);
  const convertRbtcToBprox2 = amount => amount.div(contractStatusData.bprox2PriceInRbtc).times(contractStatusData.reservePrecision);
  const convertBprox2ToRbtc = amount => amount.times(contractStatusData.bprox2PriceInRbtc).div(contractStatusData.reservePrecision);
  const convertBproToBprox2 = amount => amount.div(contractStatusData.bprox2PriceInBpro).times(contractStatusData.reservePrecision);
  const convertBprox2ToBpro = amount => amount.times(contractStatusData.bprox2PriceInBpro).div(contractStatusData.reservePrecision);
  const convertBprox2ToUsd = amount =>
    amount // RESERVE
      .times(contractStatusData.bprox2PriceInRbtc) // RESERVE * RESERVE
      .div(contractStatusData.reservePrecision) // RESERVE
      .times(contractStatusData.bitcoinPrice) // RESERVE * USD
      .div(contractStatusData.reservePrecision); // USD

  const convertMoCTokenToRbtc = amount => convertDocToRbtc(convertMoCTokenToUsd(amount));
  const convertMoCTokenToUsd = amount => amount.times(contractStatusData.mocPrice).div(contractStatusData.reservePrecision);
  const convertRbtcToMoCToken = amount => convertRbtcToDoc(amount).div(contractStatusData.mocPrice).times(contractStatusData.reservePrecision);

  const convertMap = {
    STABLE: { USD: convertDocToUsd, RESERVE: convertDocToRbtc },
    RISKPRO: { USD: convertBproToUsd, RESERVE: convertBproToRbtc, RISKPROX: convertBproToBprox2 },
    RISKPROX: {
      RESERVE: convertBprox2ToRbtc,
      RISKPRO: convertBprox2ToBpro,
      USD: convertBprox2ToUsd
    },
    MOC: {
      RESERVE: convertMoCTokenToRbtc,
      USD: convertMoCTokenToUsd
    },
    RESERVE: {
      USD: convertRbtcToUsd,
      RISKPRO: convertRbtcToBpro,
      STABLE: convertRbtcToDoc,
      RISKPROX: convertRbtcToBprox2,
      MOC: convertRbtcToMoCToken
    }
  };
  
  return (from, to, amount) =>
    from === to ? new BigNumber(amount) : convertMap[from][to](new BigNumber(amount));
};
