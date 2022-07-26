export const getDaysToSettlement = mocState => {
  const { dayBlockSpan, blocksToSettlement } = mocState;
  const daysToSettlement = blocksToSettlement / dayBlockSpan;

  return daysToSettlement;
};

export const getInrateToSettlement = mocState => {
  const { spotInrate } = mocState;

  return spotInrate * contractDaysToSettlement(mocState);
};

export const getBTCxRedeemInrateToSettlement = mocState => {
  const { spotInrate } = mocState;

  return spotInrate * (contractDaysToSettlement(mocState) - 1);
};

// Calculates rate to settlement using custom rate
export const rateToSettlement = (mocState, dailyInrate) =>
  dailyInrate * contractDaysToSettlement(mocState);

// Contract use integers for daysToSettlement
const contractDaysToSettlement = mocState => Math.floor(getDaysToSettlement(mocState));
