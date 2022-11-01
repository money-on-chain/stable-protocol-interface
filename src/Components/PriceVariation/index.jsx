
import React, {Fragment, useContext} from 'react';
import { Tooltip } from 'antd';
import {
    //formatVisibleValue,
    formatValueVariation,
    //formatPerc,
    //adjustPrecision,
    //formatLocalMap2
} from '../../Helpers/Formats';
//import i18n from "i18next";
import {AuthenticateContext} from "../../Context/Auth";
import web3 from "web3";
import {setNumber} from "../../Helpers/helper";
import {useTranslation} from "react-i18next";
//import {LargeNumber} from "../LargeNumber";
import {LargeNumberF3} from "../LargeNumberF3";
import { config } from '../../Config/config';
import './style.scss';

export default function PriceVariation(props) {

   // if (!props.priceVariation) return null;

    const auth = useContext(AuthenticateContext);
    const [t, i18n]= useTranslation(["global",'moc']);
    const ns = config.environment.AppProject.toLowerCase();
    const AppProject = config.environment.AppProject;

    const getBalanceUSD = (tokenName) => {
        if (auth.contractStatusData) {
            switch (tokenName) {
                case 'TP':
                    if (auth.contractStatusData['bitcoinPrice']) {
                        return auth.contractStatusData['bitcoinPrice']

                    } else {
                        return 0;
                    }
                case 'TC':
                    if (auth.contractStatusData['bproPriceInUsd']) {
                        return auth.contractStatusData['bproPriceInUsd']
                    } else {
                        return 0;
                    }
                case 'TX':
                    if (auth.contractStatusData['bprox2PriceInRbtc']) {
                         return (auth.contractStatusData['bitcoinPrice'] * web3.utils.fromWei(setNumber(auth.contractStatusData['bprox2PriceInRbtc']), 'ether'))
                    } else {
                        return 0;
                    }
                default:
                    throw new Error('Invalid token name'); 
            }
        }
    };

    const { currencyName, currencyCode, priceVariation, blockHeight } = props;
   /* const {
        isDailyVariation,
        value,
        blockHeightReference,
        valueReference, blockHeight,
    } = props.priceVariation; */
    // const formattedRefValue = formatVisibleValue(valueReference, currencyCode, 'en');
    // const formattedRefValue = formatVisibleValue(interestRate, 'USDPrice', formatLocalMap2[i18n.languages[0]]);

    const isPositive = priceVariation.current > priceVariation.day;
    const arrow = auth.urlBaseFull+`${isPositive ? 'icon-arrow-up2' : 'icon-arrow-down2'}.svg`;
    const sign = isPositive ? '+' : '';
    const color = isPositive ? '#3fcb97' : '#f2316a';
    const formattedVar = formatValueVariation((priceVariation.current - priceVariation.day), i18n.languages[0],auth);
    const formattedPerc = parseFloat(((priceVariation.current - priceVariation.day)/priceVariation.day)*100).toLocaleString(i18n.languages[0], {minimumFractionDigits:2, maximumFractionDigits:2});
    const variationText = `${sign}${formattedVar} (${formattedPerc}%)`;

    const tooltip = (
         <div className="PriceVariationTooltip">
             <p>{t(`${AppProject}.general.priceVariation.tooltip.titleDaily`, { ns: ns })}</p>
             {auth.contractStatusData.blockHeight >= 0 && (
                 <p>
                     <b>{t(`${AppProject}.general.priceVariation.tooltip.currentBlock`, { ns: ns })}:</b> {auth.contractStatusData.blockHeight}
                 </p>
             )}
             <p>
                 <b>{t(`${AppProject}.general.priceVariation.tooltip.currentValue`, { ns: ns })}:</b>{' '}
                 <LargeNumberF3 {...{ amount: getBalanceUSD(props.tokenName), currencyCode: 'USDPrice', includeCurrency: true }} />
             </p>
             {auth.contractStatusData.historic.blockHeight >= 0 && (
                 <p>
                     <b>{t(`${AppProject}.general.priceVariation.tooltip.referenceBlock`, { ns: ns })}:</b>
                     {' '}{auth.contractStatusData.historic.blockHeight}
                 </p>
             )}
             <p>
                 <b>{t(`${AppProject}.general.priceVariation.tooltip.referenceValue`, { ns: ns })}:</b>
                 {' '}{parseFloat(web3.utils.fromWei(auth.contractStatusData.historic.bitcoinPrice, 'ether')).toFixed(2)}{' USD'}
             </p>
         </div>
     );

    return (
        <Tooltip placement="topLeft" tooltip={tooltip} mouseEnterDelay={0.5}>
            <div className={'div_crypto'}>
                <Fragment>
                    <Tooltip placement="topLeft" title={tooltip} mouseEnterDelay={0.5}>
                        <img className={'crypto_img'} src={arrow} alt="arrow" height={11}/>
                        <span className={'crypto_value'} style={{color: `${color}`}}>{variationText}</span>
                    </Tooltip>
                </Fragment>
            </div>
        </Tooltip>
    );
}
