const getBalanceAndTransferMethodOfTokenToSend = (userState, currencyCode, auth) => {
  if(!userState) return {};
  switch (currencyCode) {
    case 'RISKPRO':
      return {
        amount: userState?.bproBalance,
        methodTransferTo: auth?.interfaceTransferRiskProTo,
      };
    case 'STABLE':
      return {
        amount: userState?.docBalance,
        methodTransferTo: auth?.interfaceTransferStableTo,
      };
    case 'MOC':
      return{
        amount:userState?.mocBalance,
        methodTransferTo: auth?.interfaceTransferMocTo,
      }
    default:
      return {};
  }
};

const getMaxAvailableOfCurrencyCode = (mocState, currencyCode, isRedeem) => {
  switch (currencyCode) {
    case 'RISKPRO':
      return mocState.bproAvailableToRedeem;
    case 'STABLE':
      return isRedeem ? mocState.docAvailableToRedeem : mocState.docAvailableToMint;
    case 'RISKPROX':
      return mocState.bprox2AvailableToMint;
    default:
      return undefined;
  }
};

const currencies = [
  { value: 'RESERVE',     image: `Moc/icon-reserve.svg`,    label: 'RBTC' },
  { value: 'STABLE',      image: `Moc/icon-stable.svg`,     label: 'DOC' },
  { value: 'RISKPRO',     image: `Moc/icon-riskpro.svg`,    label: 'BPRO' },
  { value: 'RISKPROX',    image: `Moc/icon-riskprox.svg`,   label: 'BTCX' },
  { value: 'MOC',         image: `Moc/icon-moc.svg`,        label: 'MOC' },
  { value: 'RBTC',         image: `Moc/icon-moc.svg`,        label: 'RBTC' },
];

export {
  getBalanceAndTransferMethodOfTokenToSend,
  currencies,
  getMaxAvailableOfCurrencyCode
}