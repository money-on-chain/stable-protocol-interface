/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { Form, Tooltip, Radio } from 'antd';
import { DebounceInput } from 'react-debounce-input';
import SelectCurrency from '../../SelectCurrency';
import { LargeNumber } from '../../LargeNumber';
import { toBigNumber } from '../../../Lib/numberHelper';
import { amountIsTooSmall } from '../../../Lib/exchangeManagerHelper';
import {
  formatValueToContract,
  formatVisibleValue,
  formatValueWithContractPrecision
} from '../../../Lib/Formats';
import './style.scss';
import { useTranslation } from "react-i18next";
import BigNumber from "bignumber.js";

export default function InputWithCurrencySelector(props) {
  const {
    currencyOptions,
    currencySelected,
    onCurrencySelect,
    inputValueInWei,
    maxValueAllowedInWei,
    showMaxValueAllowed,
    onInputValueChange,
    disableCurrencySelector,
    onValidationStatusChange,
    validate,
    title,
    className,
    cleanInputCount,
    showConvertBTC_RBTC_Link,
    placeholder = '',
    showSelectPercent = false,
    onValueChange = () => {}
  } = props;

  const [t, i18n]= useTranslation(["global",'moc'])

  const [inputValidation, setInputValidation] = useState({ validateStatus: 'success' });
  const [dirty, setDirty] = useState(false);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    setDirty(false);
    setInputValidation({ validateStatus: 'success' });
  }, [cleanInputCount]);

  useEffect(
    () => {
      if (validate && dirty) {
        setInputValidation(validateValue(inputValueInWei, maxValueAllowedInWei));
      }
    },
    [inputValueInWei, maxValueAllowedInWei, currencySelected, dirty]
);

  useEffect(
    () => {
      onValidationStatusChange(inputValidation.validateStatus === 'success');
    },
    [inputValidation]
  );

  const handleValueChange = newValueInEther => {
    const newValueInWei = formatValueToContract(newValueInEther, currencySelected);
    handleValueChangeInWei(newValueInWei);
    onValueChange(newValueInEther);
  };

  const handleValueChangeInWei = newValueInWei => {
    setDirty(true);
    onInputValueChange(newValueInWei);
  };

  const setValueToMax = () => {
    handleValueChangeInWei(maxValueAllowedInWei);
  };

const handleCurrencySelect = newCurrencySelected => {
  onCurrencySelect(newCurrencySelected);
};

const checkBiggerThanMaxValueAllowed = (value, maxValueAllowedInWei) => {
  const valueAsBigNumber = toBigNumber(value);
  return (
      maxValueAllowedInWei &&
      valueAsBigNumber.isGreaterThan(toBigNumber(maxValueAllowedInWei))
  );
};

const testConditions = (conditionsAndMessages, value) => {
  let error;
  conditionsAndMessages.forEach(({ condition, message }) => {
      if (condition(value) && !error) {
          error = {
              validateStatus: 'error',
              errorMsg: message
          };
      }
  });
  return error || { validateStatus: 'success' };
};

const validateValue = (value, maxValueAllowedInWei) => {
  const validNumberRegex = /^$|^\d+\.?(\d+)?$/;
  const valueIsInvalidNumber = value => {
      const valueInEther = formatVisibleValue(value, currencySelected, 'en');
      return !validNumberRegex.test(valueInEther);
  };
  const valueIsBiggerThanMaxValueAllowed = value =>
      checkBiggerThanMaxValueAllowed(value, maxValueAllowedInWei);
  const valueIsTooSmall = value => amountIsTooSmall(value);
  const valueIsUndefined = value => value === undefined || value === null;
  const valueIncludesComma = value => value && value.includes(',');
  const result = testConditions(
      [
          { condition: valueIsUndefined, message: t('global.Error_numericField') },
          { condition: valueIncludesComma, message: t('global.Error_separateDecimals') },
          { condition: valueIsInvalidNumber, message: t('global.Error_numericField') },
          {
              condition: valueIsBiggerThanMaxValueAllowed,
              message: t('global.Error_maxExceeded')
          },
          { condition: valueIsTooSmall, message: t('global.Error_numberTooSmall') }
      ],
      value
  );
  return result;
};

  const handlePercentChange = e => {
    setPercent(e.target.value);
    handleValueChangeInWei(new BigNumber(maxValueAllowedInWei).multipliedBy(parseFloat(e.target.value)).dividedBy(100).toString());
  };

  return (
    <div className={`InputWithCurrencySelector ${className || ''}`}>
      <h3>{title}</h3>
      <Form>
        <Form.Item
          validateStatus={inputValidation.validateStatus}
          help={inputValidation.errorMsg}
        >
          <div className='MainContainer'>
            <Tooltip title={formatValueWithContractPrecision(inputValueInWei, currencySelected)}>
              <DebounceInput
                placeholder={placeholder}
                value={formatVisibleValue(inputValueInWei, currencySelected, 'en')}
                debounceTimeout={1000}
                onChange={event => handleValueChange(event.target.value)}
                className={`valueInput ${
                    inputValidation.validateStatus === 'error' ? 'formError' : ''
                }`}
                type={"number"}
              />
            </Tooltip>
            <SelectCurrency
              disabled={currencyOptions.length === 1 || disableCurrencySelector}
              value={currencySelected}
              onChange={handleCurrencySelect}
              currencyOptions={currencyOptions}
            />
          </div>
        </Form.Item>
      </Form>
      {showMaxValueAllowed && !showSelectPercent && (
        <div className="AlignedAndCentered">
          <span className="setValueToMaxLink" onClick={setValueToMax}>
            {t('global.InputWithCurrencySelector_AddTotalAvailable')}
          </span>
          <div className="text-align-right">
            <LargeNumber
              currencyCode={currencySelected}
              amount={maxValueAllowedInWei}
              includeCurrency
            />
            {/* showConvertBTC_RBTC_Link && (        
              <button onClick={() => FlowRouter.go('getRBTC') } 
                className="link-like-btn">Convert BTC to RBTC</button>
            )*/} 
          </div>
        </div>
      )}
      {
        showSelectPercent && (
          <div className="BalanceSelectorContainer">
            <Radio.Group value={percent} onChange={handlePercentChange}>
              <Radio.Button value={10}>10%</Radio.Button>
              <Radio.Button value={25}>25%</Radio.Button>
              <Radio.Button value={50}>50%</Radio.Button>
              <Radio.Button value={75}>75%</Radio.Button>
              <Radio.Button value={100}>100%</Radio.Button>
            </Radio.Group>
            <div className="AlignedAndCentered">
              <span className="setValueToMax" onClick={setValueToMax}>
                {t('global.InputWithCurrencySelector_AddAvailable')}
              </span>
              <div className="text-align-right">
                <LargeNumber
                  currencyCode={currencySelected}
                  amount={maxValueAllowedInWei}
                  includeCurrency
                />
                {/* showConvertBTC_RBTC_Link && (
                  <button onClick={() => FlowRouter.go('getRBTC') }
                    className="link-like-btn">{t(`global.InputWithCurrencySelector_ConvertBTCtoRBTC`)}
                  </button>
                )*/}
              </div>
            </div>
          </div>
        )
      }
    </div>
  )
};