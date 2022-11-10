import React from 'react';
import { LargeNumber } from '../LargeNumber';
import { config } from '../../projects/config';
import { useProjectTranslation } from '../../helpers/translations';

const BalanceItem = ({ theme, amount, currencyCode }) => {

  const [t, i18n, ns]= useProjectTranslation();
  const AppProject = config.environment.AppProject;
  const classname = `BalanceItem ${theme}`;
  const currencyName = t(`${AppProject}.Tokens_${currencyCode}_code`, {ns: ns});
  return (
    <div className={classname}>
      <h1>
        <LargeNumber {...{ amount, currencyCode }} />
      </h1>
      <h4> {currencyName} </h4>
    </div>
  );
};

export default BalanceItem;
