import { Tooltip } from 'antd';
import NumericLabel from 'react-pretty-numbers';
import { adjustPrecision, formatLocalMap } from '../../Lib/Formats';
import i18n from 'i18next';
import {useTranslation} from "react-i18next";
import DollarOutlined from '@ant-design/icons/DollarOutlined';

const LargeNumber = ({ amount, currencyCode, includeCurrency, numericLabelParams, className }) => {

  const [t, i18n]= useTranslation(["global",'moc'])
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
          {includeCurrency && ` ${t(`MoC.Tokens_${currencyCode}_code`, {ns: 'moc' })}`}
        </div>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={t('general.invalidValueDescription')}>
      {t('general.invalidValuePlaceholder')}
    </Tooltip>
  )
};

const InfoIcon = ({infoDescription}) => {

    if (infoDescription != '') {
        return (
            <Tooltip placement="topLeft" title={infoDescription}>
                <DollarOutlined className="LargeNumberIcon" />
            </Tooltip>
        );

    }
    return ('');

}

const USDValueLargeNumber = ({amountUSD, showUSD, numericLabelParams}) => {

    if (showUSD && amountUSD > 0) {
        const { value, decimals } = adjustPrecision(amountUSD, 'USD');
        const params = Object.assign(
            {
                shortFormat: true,
                justification: 'L',
                locales: i18n.languages[0],
                shortFormatMinValue: 1000000,
                commafy: true,
                shortFormatPrecision: decimals,
                precision: decimals,
                // without this the antd Tooltip isn't shown ¿¿?? hours wasted: 1.5
                title: '',
                cssClass: ['display-inline']
            },
            numericLabelParams
        );

        return (
            <span> ( <NumericLabel {...{ params }}>{value.toString()}</NumericLabel> USD ) </span>
        );

    }

    return ('');

}

const DetailedLargeNumber = ({ amount, currencyCode, includeCurrency, isPositive, showSign, showUSD, amountUSD, numericLabelParams, infoDescription, showFlat  }) => {
    // Number(null) === 0
    const [t, i18n]= useTranslation(["global",'moc'])

    if (currencyCode == 'RBTC') {
        var displayCurrencyCode = 'RBTC';
        currencyCode = 'RESERVE';
    } else {
        var displayCurrencyCode = t(`Tokens_${currencyCode}_code`);
    }

    if (amount !== null && amount !== '' && !Number.isNaN(Number(amount))) {
        const { value, decimals } = adjustPrecision(amount, currencyCode);
        const params = Object.assign(
            {
                shortFormat: true,
                justification: 'L',
                locales: i18n.languages[0],
                shortFormatMinValue: 1000000,
                commafy: true,
                shortFormatPrecision: decimals,
                precision: decimals,
                // without this the antd Tooltip isn't shown ¿¿?? hours wasted: 1.5
                title: '',
                cssClass: ['display-inline']
            },
            numericLabelParams
        );

        if (showFlat) {
            return value.toString();
        }

        if (infoDescription) {
            return (
                <div>
                    <Tooltip title={value === 0 ? '0' : value.toFormat(formatLocalMap[i18n.languages[0]])}>
                        {showSign && (isPositive ? '+' : '-')}
                        <NumericLabel {...{ params }}>{value.toString()}</NumericLabel>
                        {includeCurrency && ` ${displayCurrencyCode}`}
                        <USDValueLargeNumber amountUSD={amountUSD} showUSD={showUSD} numericLabelParams={numericLabelParams}></USDValueLargeNumber>
                    </Tooltip>
                    <InfoIcon infoDescription={infoDescription}></InfoIcon>
                </div>
            );

        }

        return (
            <Tooltip title={value === 0 ? '0' : value.toFormat(formatLocalMap[i18n.languages[0]])}>
                {showSign && (isPositive ? '+' : '-')}
                <NumericLabel {...{ params }}>{value.toString()}</NumericLabel>
                {includeCurrency && ` ${displayCurrencyCode}`}
                <USDValueLargeNumber amountUSD={amountUSD} showUSD={showUSD} numericLabelParams={numericLabelParams}></USDValueLargeNumber>
            </Tooltip>
        );
    }

    if (showFlat) {
        return '';
    }

    return (
        <Tooltip title={t('general.invalidValueDescription')}>
            {t(`general.invalidValuePlaceholder`, {ns: 'moc' })}
        </Tooltip>
    );
};

DetailedLargeNumber.defaultProps = {
    showFlat: false,
    showSign: false,
    showUSD: false,
    amountUSD: 0.0,
    infoDescription: ''
}

export { LargeNumber, DetailedLargeNumber };

