import React from 'react';
import { LargeNumber } from '../../LargeNumber';

const BalanceItemCard = ({ theme, amount, currencyCode }) => {
  const classname = `BalanceItemCard ${theme}`;
  return (
    <div className={classname}>
      <h4>
        <LargeNumber {...{ amount, currencyCode }} />
      </h4>
    </div>
  );
};

export default BalanceItemCard;
