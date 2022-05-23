const getBalanceAndTransferMethodOfTokenToSend = (userState, currencyCode, auth) => {
  if(!userState) return {};
  switch (currencyCode) {
    case 'RISKPRO':
      return {
        amount: userState?.bproBalance,
        methodTransferTo: auth?.transferBproTo,
      };
    case 'STABLE':
      return {
        amount: userState?.docBalance,
        methodTransferTo: auth?.transferDocTo,
      };
    case 'MOC':
      return{
        amount:userState?.mocBalance,
        methodTransferTo: auth?.transferMocTo,
      }
    default:
      return {};
  }
};

const currencies = [
  { value: 'RESERVE',     image: `${window.location.origin}/Moc/icon-reserve.svg`,    label: 'RBTC' },
  { value: 'STABLE',      image: `${window.location.origin}/Moc/icon-stable.svg`,     label: 'DOC' },
  { value: 'RISKPRO',     image: `${window.location.origin}/Moc/icon-riskpro.svg`,    label: 'BPRO' },
  { value: 'RISKPROX',    image: `${window.location.origin}/Moc/icon-riskprox.svg`,   label: 'BTCX' },
  { value: 'MOC',         image: `${window.location.origin}/Moc/icon-moc.svg`,        label: 'MOC' },
  { value: 'RBTC',         image: `${window.location.origin}/Moc/icon-moc.svg`,        label: 'RBTC' },
];

export {
  getBalanceAndTransferMethodOfTokenToSend,
  currencies
}