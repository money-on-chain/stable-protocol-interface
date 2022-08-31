import React, {useContext} from 'react';
import { Select } from 'antd';

import { currencies, getCurrenciesDetail } from '../../Config/currentcy';
import { useTranslation } from "react-i18next";
import {AuthenticateContext} from "../../Context/Auth";

const { Option } = Select;

export default function SelectCurrency(props) {

    async function loadAssets() {
        try {

                let css1= await import('./'+process.env.REACT_APP_ENVIRONMENT_APP_PROJECT+'/style.scss')

        } catch (error) {
            console.log(`Ocurrió un error al cargar imgs: ${error}`);
        }
    }
    loadAssets()

  const { value, onChange, currencyOptions, disabled } = props;
  const [t, i18n]= useTranslation(["global",'moc']);
  const options = getCurrenciesDetail().map(it => ({
    value: it.value,
    image: it.image,
    label: t(it.longNameKey, { ns: 'moc' }),
  }));
  const option = options.find(it => it.value === value);
  const optionsFiltered = options.filter(it => currencyOptions.includes(it.value));
    const auth = useContext(AuthenticateContext);

  return (
    <div className={`SelectCurrency ${disabled ? 'disabled' : ''}`}>
      <Select
        size={"large"}
        onChange={onChange}
        disabled={disabled}
        value={option && option.value}
      >
        {optionsFiltered.map((possibleOption) => <Option key={possibleOption.value} value={possibleOption.value}>
          <div className="currencyOption">
              <img className="currencyImage" src={(auth.urlBase+possibleOption.image.charAt(0)=='.')? auth.urlBase+possibleOption.image.substring(1) : auth.urlBase+possibleOption.image} alt={possibleOption.label} />
            {possibleOption.label}
          </div>
        </Option>)}
      </Select>
    </div>
  )
};

