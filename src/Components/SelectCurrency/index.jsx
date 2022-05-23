import React from 'react';
import { Select } from 'antd';
import './style.scss';
import { currencies } from '../../Config/currentcy';

const { Option } = Select;

export default function SelectCurrency(props) {
  const { value, onChange, currencyOptions, disabled } = props;
  const options = currencies.map(it => ({
    value: it.value,
    image: it.image,
    label: it.label
  }));
  const option = options.find(it => it.value === value);
  const optionsFiltered = options.filter(it => currencyOptions.includes(it.value));

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
            <img className="currencyImage" src={possibleOption.image} alt={possibleOption.label} />
            {possibleOption.label}
          </div>
        </Option>)}
      </Select>
    </div>
  )
};

