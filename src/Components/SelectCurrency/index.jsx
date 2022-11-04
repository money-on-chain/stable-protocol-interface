import React, {useContext} from 'react';
import { Select } from 'antd';

import { currencies, getCurrenciesDetail } from '../../Helpers/currency';
import { useTranslation } from "react-i18next";
import {AuthenticateContext} from "../../Context/Auth";
import './style.scss';

const { Option } = Select;

export default function SelectCurrency(props) {

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
              <img className="currencyImage" src={(process.env.REACT_APP_PUBLIC_URL+possibleOption.image.charAt(0)=='.')? process.env.REACT_APP_PUBLIC_URL+possibleOption.image.substring(1) : process.env.REACT_APP_PUBLIC_URL+possibleOption.image} alt={possibleOption.label} />
            {possibleOption.label}
          </div>
        </Option>)}
      </Select>
    </div>
  )
};

