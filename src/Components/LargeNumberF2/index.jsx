import { Tooltip } from 'antd';
import NumericLabel from 'react-pretty-numbers';
import { adjustPrecision, formatLocalMap } from '../../Lib/Formats';
import i18n from 'i18next';
import {useTranslation} from "react-i18next";
import DollarOutlined from '@ant-design/icons/DollarOutlined';
import { formatLocalMap2 } from '../../Lib/Formats';

const LargeNumberF2 = ({ amount, currencyCode, includeCurrency, numericLabelParams, className, auth }) => {

  const [t, i18n]= useTranslation(["global",'moc']);
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
          cssClass:[auth.getAppMode+'-'+currencyCode]
      },
      numericLabelParams
    );

  return (<>
          { !isNaN(value) &&
          <Tooltip placement="topLeft" title={value === 0 ? '0' : value.toFormat(formatLocalMap[i18n.languages[0]])}>
              <div className={className} style={{'display':'flex'}}>
                  <NumericLabel style={{'flexGrow':'0'}} {... {params }}>{value.toString()}</NumericLabel>
                  <span className={`number-label ${auth.getAppMode}-${currencyCode}`} style={{'flexGrow':'1'}}>{includeCurrency && ` ${t(`MoC.Tokens_${currencyCode}_code`, {ns: 'moc' })}`}</span>
              </div>
          </Tooltip>}</>
  );
  }

  return (
    <Tooltip title={t('MoC.general.invalidValueDescription', {ns: 'moc'})}>
      {t('MoC.general.invalidValuePlaceholder', {ns: 'moc'})}
    </Tooltip>
  )
};

export { LargeNumberF2 };

