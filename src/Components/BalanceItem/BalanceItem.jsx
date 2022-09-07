import React from 'react';
import { LargeNumber } from '../LargeNumber';
import {useTranslation} from "react-i18next";
import { config } from './../../Config/config';

const BalanceItem = ({ theme, amount, currencyCode }) => {

  const [t, i18n]= useTranslation(["global",'moc','rdoc']);
  const ns = config.environment.AppMode === 'MoC' ? 'moc' : 'rdoc';
    const appMode = config.environment.AppMode;
  const classname = `BalanceItem ${theme}`;
  const currencyName = t(`${appMode}.Tokens_${currencyCode}_code`, {ns: ns});
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
