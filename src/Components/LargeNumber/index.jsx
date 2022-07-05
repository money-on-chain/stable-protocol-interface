import { Tooltip } from 'antd';
import NumericLabel from 'react-pretty-numbers';
import { adjustPrecision, formatLocalMap } from '../../Lib/Formats';
import i18n from 'i18next';
import {useTranslation} from "react-i18next";
import DollarOutlined from '@ant-design/icons/DollarOutlined';
import { formatLocalMap2 } from '../../Lib/Formats';

const LargeNumber = ({ amount, currencyCode, includeCurrency, numericLabelParams, className }) => {

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
          cssClass:['value_usd']
      },
      numericLabelParams
    );

    {/* <Tooltip title={Number(amount)?.toLocaleString(formatLocalMap2[i18n.languages[0]])}>>
    <NumericLabel {... {params }}>{value.toString()}</NumericLabel> */}

  return (<>
          { !isNaN(value) &&
          <Tooltip title={value === 0 ? '0' : value.toFormat(formatLocalMap[i18n.languages[0]])}>
              <div className={className}>
                  {/* <NumericLabel {... {params }}>{amount?.toString()}</NumericLabel> */}
                  <NumericLabel {... {params }}>{value.toString()}</NumericLabel>
                  <span className={'number-label'}>{includeCurrency && ` ${t(`MoC.Tokens_${currencyCode}_code`, {ns: 'moc' })}`}</span>
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

const DetailedLargeNumber= ({ amount, currencyCode, includeCurrency, isPositive, showSign, showUSD, amountUSD, numericLabelParams, infoDescription, showFlat,t, i18n  }) => {

    if (currencyCode == 'RBTC') {
        var displayCurrencyCode = 'RBTC';
        currencyCode = 'RESERVE';
    } else {
        var displayCurrencyCode = t(`MoC.Tokens_${currencyCode}_code`, { ns: 'moc' });
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
        <Tooltip title={t('MoC.general.invalidValueDescription', {ns: 'moc' })}>
            {t(`MoC.general.invalidValuePlaceholder`, {ns: 'moc' })}
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

const getExplainByEvent = ({ event, amount, amount_rbtc, status, token_involved, t, i18n }) => {
    if (status != 'confirmed') {
        return '--';
    }

    const map = {
        RiskProMint: (
            <div class="">
                {t('MoC.operations.explain.RiskProMint', { ns: 'moc' })} {amount}
            </div>
        ),
        RiskProRedeem: (
            <div class="">
                {t('MoC.operations.explain.RiskProRedeem', { ns: 'moc' })} {amount_rbtc}
            </div>
        ),
        StableTokenMint: (
            <div class="">
                {t('MoC.operations.explain.StableTokenMint', { ns: 'moc' })} {amount}
            </div>
        ),
        StableTokenRedeem: (
            <span class="">
                {t('MoC.operations.explain.StableTokenRedeem', { ns: 'moc' })} {amount_rbtc}
            </span>
        ),
        FreeStableTokenRedeem: (
            <span class="">
                {t('MoC.operations.explain.FreeStableTokenRedeem', { ns: 'moc' })} {amount_rbtc}
            </span>
        ),
        RiskProxMint: (
            <span class="">
                {t('MoC.operations.explain.RiskProxMint', { ns: 'moc' })} {amount}
            </span>
        ),
        RiskProxRedeem: (
            <span class="">
                {t('MoC.operations.explain.RiskProxRedeem', { ns: 'moc' })} {amount_rbtc}
            </span>
        ),
        SettlementDeleveraging: (
            <span class="">
                {t('MoC.operations.explain.SettlementDeleveraging', { ns: 'moc' })} {amount_rbtc}
            </span>
        ),
        RedeemRequestAlter: (
            <span class="">
                {t('MoC.operations.explain.RedeemRequestAlter', { ns: 'moc' })} {amount}
            </span>
        ),
        Transfer: (
            <span class="">
                {t('MoC.operations.explain.Transfer_positive', { ns: 'moc' })} {amount}
            </span>
        ),
        BucketLiquidation: (
            <span class="">
                {t('MoC.operations.explain.BucketLiquidation', { ns: 'moc' })} {amount}
            </span>
        )
    };

    return map[event];
};

export { LargeNumber, DetailedLargeNumber, getExplainByEvent };

