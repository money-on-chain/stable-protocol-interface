import './style.scss';
import React from 'react';
import { Tooltip } from 'antd';
import { formatVisibleValue, formatValueVariation, formatPerc } from '../../Lib/Formats';

export default function PriceVariation(props) {
   // if (!props.priceVariation) return null;

    const { currencyName, currencyCode, priceVariation, blockHeight } = props;
   /* const {
        isDailyVariation,
        value,
        blockHeightReference,
        valueReference, blockHeight,
    } = props.priceVariation; */
    // const formattedRefValue = formatVisibleValue(valueReference, currencyCode, 'en');
    const isPositive = priceVariation.current > priceVariation.day;
    const arrow = `${window.location.origin}/Moc/${isPositive ? 'icon-arrow-up2' : 'icon-arrow-down2'}.svg`;
    const sign = isPositive ? '+' : '-';
    const color = isPositive ? '#3fcb97' : '#f2316a';
    const formattedVar = formatValueVariation(priceVariation.current, 'en');
    // const formattedPerc = formatPerc(2, 'en');
    const variationText = `${sign}${formattedVar} (${''}%)`;
    const tooltip = (
        <div className="PriceVariationTooltip">
          <p>{/*isDailyVariation ? 'Daily variation' : 'Settlement Day' */}</p>
          {blockHeight >= 0 && (
            <p>
              <b>Current block #:</b> {blockHeight}
            </p>
          )}
          <p>
            <b>Current value:</b>{' '}
            {/*formatVisibleValue(value, currencyCode, 'en')} {currencyName */}
          </p>
          {/*blockHeightReference >= 0 && (
            <p>
              <b>Reference block #":</b> {blockHeightReference}
            </p>
          )*/}
          <p>
            <b>Reference value:</b> {/*formattedRefValue*/}{' '}
            {currencyName}
          </p>
        </div>
      );

    return (
        <Tooltip placement="topLeft" tooltip={tooltip} mouseEnterDelay={0.5}>
            <div className={'div_crypto'}>
                <img className={'crypto_img'} src={arrow} alt="arrow"
                    height={11}/>
                <span className={'crypto_value'} style={{ color: `${color}` }}>{variationText}</span>
            </div>
        </Tooltip>
    );
}
