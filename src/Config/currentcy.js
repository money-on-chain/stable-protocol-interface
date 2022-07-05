const getBalanceAndTransferMethodOfTokenToSend = (userState, currencyCode, auth) => {
  if(!userState) return {};
  switch (currencyCode) {
    case 'RISKPRO':
      return {
        amount: userState?.bproBalance,
        methodTransferTo: window.nodeManager.transferBproTo,
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
  { value: 'RESERVE',     image: `Moc/icon-reserve.svg`,    label: 'RBTC' },
  { value: 'STABLE',      image: `Moc/icon-stable.svg`,     label: 'DOC' },
  { value: 'RISKPRO',     image: `Moc/icon-riskpro.svg`,    label: 'BPRO' },
  { value: 'RISKPROX',    image: `Moc/icon-riskprox.svg`,   label: 'BTCX' },
  { value: 'MOC',         image: `Moc/icon-moc.svg`,        label: 'MOC' },
  { value: 'RBTC',         image: `Moc/icon-moc.svg`,        label: 'RBTC' },
];

export {
  getBalanceAndTransferMethodOfTokenToSend,
  currencies
}