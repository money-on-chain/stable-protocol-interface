const ContractFunctions = (appMode, { moc }) =>
  ({
    MoC: {
      redeemAllDoc: moc.methods.redeemAllDoc,
      redeemFreeDoc: moc.methods.redeemFreeDocVendors,
      redeemDoc: moc.methods.redeemDocRequest,
      redeemBprox2: moc.methods.redeemBProxVendors,
      redeemBpro: moc.methods.redeemBProVendors,
      payBitProHoldersInterestPayment: moc.methods.payBitProHoldersInterestPayment
    },
    RRC20: {
      redeemAllDoc: moc.methods.redeemAllStableToken,
      redeemFreeDoc: moc.methods.redeemFreeStableTokenVendors,
      redeemDoc: moc.methods.redeemStableTokenRequest,
      redeemBprox2: moc.methods.redeemRiskProxVendors,
      redeemBpro: moc.methods.redeemRiskProVendors,
      payBitProHoldersInterestPayment: moc.methods.payRiskProHoldersInterestPayment
    }
  }[appMode]);

export { ContractFunctions };
