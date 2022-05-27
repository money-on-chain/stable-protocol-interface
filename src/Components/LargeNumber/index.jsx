import { Tooltip } from 'antd';
import NumericLabel from 'react-pretty-numbers';
import { adjustPrecision, formatLocalMap } from '../../Lib/Formats';
import i18n from 'i18next';

const LargeNumber = ({ amount, currencyCode, includeCurrency, numericLabelParams, className }) => {

  if (amount !== null && amount !== '' && !Number.isNaN(amount)) {
    const { value, decimals } = adjustPrecision(amount, currencyCode);
    const params = Object.assign(
      {
          commafy: true,
          justification: "L",
          locales: i18n.languages[0],
          precision: decimals,
          shortFormat: true,
          shortFormatMinValue: 1000000,
          shortFormatPrecision: decimals,
          title: "",
          cssClass:['value_usd']
      },
      numericLabelParams
    );

    return (
      <Tooltip title={value === 0 ? '0' : value.toFormat(formatLocalMap[i18n.languages[0]])}>
        <div className={className}>
          <NumericLabel {... {params }}>{value.toString()}</NumericLabel>
          {includeCurrency && currencyCode}
        </div>
      </Tooltip>
    );
  }

  return (
    <Tooltip title="--">
      --
    </Tooltip>
  )
};

export {
    LargeNumber
};
