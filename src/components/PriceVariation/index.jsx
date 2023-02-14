import React, {Fragment, useContext} from 'react';
import { Tooltip } from 'antd';
import web3 from "web3";

import { formatValueVariation } from '../../helpers/Formats';
import {AuthenticateContext} from "../../context/Auth";
import {LargeNumberF3} from "../LargeNumberF3";
import { config } from '../../projects/config';
import { useProjectTranslation } from '../../helpers/translations';

import { ReactComponent as LogoIconUp } from '../../assets/icons/icon-arrow-up2.svg';
import { ReactComponent as LogoIconDown } from '../../assets/icons/icon-arrow-down2.svg';

import './style.scss';
import BigNumber from "bignumber.js";

export default function PriceVariation(props) {

   // if (!props.priceVariation) return null;

    const auth = useContext(AuthenticateContext);
    const [t, i18n, ns] = useProjectTranslation();
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
                        const txPrice = new BigNumber(web3.utils.fromWei(auth.contractStatusData['bitcoinPrice']))
                            .times(new BigNumber(web3.utils.fromWei(auth.contractStatusData['bprox2PriceInRbtc'])))
                        return web3.utils.toWei(txPrice.toFixed(6), 'ether')
                    } else {
                        return 0;
                    }
                case 'TG':
                    if (auth.contractStatusData['mocPrice']) {
                        return auth.contractStatusData['mocPrice']
                    } else {
                        return 0;
                    }
                default:
                    throw new Error('Invalid token name'); 
            }
        }
    };

    const { currencyName, currencyCode, priceVariation, blockHeight } = props;
   
    const isPositive = priceVariation.current.gt(priceVariation.day);
    const sign = isPositive ? '+' : '';
    const color = isPositive ? '#3fcb97' : '#f2316a';

    let priceDiff = priceVariation.current.minus(priceVariation.day);
    let referenceValue = priceVariation.day
    // If price diff > 100000000 is an error
    if (priceDiff.abs().gt(100000000)) {
        priceDiff = new BigNumber(0);
        referenceValue = new BigNumber(0);
    }

    const formattedVar = formatValueVariation(priceDiff.times(new BigNumber(10).exponentiatedBy(18)), i18n.languages[0],auth);
    const formattedPerc = parseFloat(priceDiff.div(priceVariation.day).times(100)).toLocaleString(
        i18n.languages[0],
        {minimumFractionDigits:2, maximumFractionDigits:2}
    );

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

                 {' '}{parseFloat(referenceValue).toFixed(2)}{' USD'}
             </p>
         </div>
     );

    return (
        <Tooltip placement="topLeft" tooltip={tooltip} mouseEnterDelay={0.5}>
            <div className={'div_crypto'}>
                <Fragment>
                    <Tooltip placement="topLeft" title={tooltip} mouseEnterDelay={0.5}>

                        {isPositive && <LogoIconUp className={'crypto_img'} alt="arrow" height={11}/>}
                        {!isPositive && <LogoIconDown className={'crypto_img'} alt="arrow" height={11}/>}

                        <span className={'crypto_value'} style={{color: `${color}`}}>{variationText}</span>
                    </Tooltip>
                </Fragment>
            </div>
        </Tooltip>
    );
}
