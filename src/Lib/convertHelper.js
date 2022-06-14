const BigNumber = require('bignumber.js');
BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_DOWN });

module.exports = ({
  bitcoinPrice,
  bproPriceInUsd,
  bproPriceInRbtc,
  reservePrecision,
  bprox2PriceInRbtc,
  bprox2PriceInBpro,
  mocPrice
}) => {
  // const reservePrecision = 1;
  const convertDocToUsd = amount => amount;
  const convertBproToRbtc = amount => amount.times(bproPriceInRbtc).div(reservePrecision);
  const convertBproToUsd = amount => amount.times(bproPriceInUsd).div(reservePrecision);
  const convertDocToRbtc = amount => amount.div(bitcoinPrice).times(reservePrecision);
  const convertRbtcToUsd = amount => amount.times(bitcoinPrice).div(reservePrecision);
  const convertRbtcToBpro = amount => amount.div(bproPriceInRbtc).times(reservePrecision);
  const convertRbtcToDoc = amount => convertRbtcToUsd(amount);
  const convertRbtcToBprox2 = amount => amount.div(bprox2PriceInRbtc).times(reservePrecision);
  const convertBprox2ToRbtc = amount => amount.times(bprox2PriceInRbtc).div(reservePrecision);
  const convertBproToBprox2 = amount => amount.div(bprox2PriceInBpro).times(reservePrecision);
  const convertBprox2ToBpro = amount => amount.times(bprox2PriceInBpro).div(reservePrecision);
  const convertBprox2ToUsd = amount =>
    amount // RESERVE
      .times(bprox2PriceInRbtc) // RESERVE * RESERVE
      .div(reservePrecision) // RESERVE
      .times(bitcoinPrice) // RESERVE * USD
      .div(reservePrecision); // USD

  const convertMoCTokenToRbtc = amount => convertDocToRbtc(convertMoCTokenToUsd(amount));
  const convertMoCTokenToUsd = amount => amount.times(mocPrice).div(reservePrecision);
  const convertRbtcToMoCToken = amount => convertRbtcToDoc(amount).div(mocPrice).times(reservePrecision);

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
