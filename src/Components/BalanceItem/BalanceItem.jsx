import React from 'react';
import { LargeNumber } from '../LargeNumber';
import {useTranslation} from "react-i18next";

const BalanceItem = ({ theme, amount, currencyCode }) => {

    async function loadAssets() {
        try {

                let css1= await import('./'+process.env.REACT_APP_ENVIRONMENT_APP_PROJECT+'/style.scss')

        } catch (error) {
            console.log(`Ocurrió un error al cargar imgs: ${error}`);
        }
    }
    loadAssets()

  const [t, i18n]= useTranslation(["global",'moc']);
  const classname = `BalanceItem ${theme}`;
  const currencyName = t(`MoC.Tokens_${currencyCode}_code`, {ns: 'moc'});
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
