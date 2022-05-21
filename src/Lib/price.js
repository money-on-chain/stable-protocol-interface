
export const priceCommonFields = {
  bitcoinPrice: { type: String },
  bproPriceInRbtc: { type: String },
  bproPriceInUsd: { type: String },
  bproDiscountPrice: { type: String },
  bprox2PriceInRbtc: { type: String },
  bprox2PriceInBpro: { type: String },
  bprox2PriceInUsd: { type: String },
  mocPrice: { type: String }
};
  
  export const getPriceFields = () =>
  Object.keys(priceCommonFields).reduce((accum, key) => {
    const result = { ...accum };
    result[key] = 1;
    return result;
  }, {});