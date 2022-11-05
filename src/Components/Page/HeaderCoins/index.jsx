/* eslint-disable default-case */

import React, { Fragment, useContext, useEffect, useState } from 'react';
import { AuthenticateContext } from '../../../Context/Auth';
import PriceVariation from '../../PriceVariation';
import {LargeNumber} from "../../LargeNumber";
import web3 from "web3";
//import {Alert} from "antd";
import {setNumber, setToLocaleString} from "../../../Helpers/helper";
import {useTranslation} from "react-i18next";
import './style.scss';

function HeaderCoins(props) {

  const auth = useContext(AuthenticateContext);
  //const { accountData = {} } = auth;
  const { image, arrow, color, tokenName } = props;
  const [timeRefresh, setTimeRefresh] = useState(new Date());

  useEffect(() => {
        setInterval(() => {
            setTimeRefresh(new Date())
        }, 30000);
  }, [auth]);

  const [t, i18n] = useTranslation(["global", 'moc'])

  const getBalanceUSD = () => {
    if (auth.contractStatusData) {
      switch (props.tokenName) {
        case 'TP':
          if (auth.contractStatusData['bitcoinPrice'] != 0) {
            // return (web3.utils.toWei(auth.contractStatusData['bitcoinPrice'], 'ether'));
            // return setToLocaleString(parseFloat(web3.utils.fromWei(setNumber(auth.contractStatusData['bitcoinPrice']), 'ether')),2,i18n)
            return auth.contractStatusData['bitcoinPrice']
          } else {
            return 0;
          }
        case 'TC':
          if (auth.contractStatusData['bproPriceInUsd'] != 0) {
            // return (web3.utils.toWei(auth.contractStatusData['bproPriceInUsd'], 'ether'));
            // return setToLocaleString(parseFloat(web3.utils.fromWei(setNumber(auth.contractStatusData['bproPriceInUsd']), 'ether')),2,i18n)
            return auth.contractStatusData['bproPriceInUsd']
          } else {
            return 0;
          }

        case 'TX':
          if (auth.contractStatusData['bprox2PriceInRbtc'] != 0) {
            return (auth.contractStatusData['bitcoinPrice'] * web3.utils.fromWei(setNumber(auth.contractStatusData['bprox2PriceInRbtc']), 'ether'))
          } else {
            return 0;
          }
      }
    }
  };

  const getPriceVariation = () => {
    if( auth.contractStatusData ){
      switch (tokenName)
      {
        case 'RESERVE':
        case 'TP':
          return {day: auth.contractStatusData.historic.bitcoinPrice, current: auth.contractStatusData.bitcoinPrice};
        case 'TC':
          return {day: auth.contractStatusData.historic.bproPriceInUsd, current: auth.contractStatusData.bproPriceInUsd};
        case 'TX':
          return {
            day: (auth.contractStatusData.historic.bitcoinPrice * web3.utils.fromWei(setNumber(auth.contractStatusData.historic.bprox2PriceInRbtc), 'ether')),
            current: (auth.contractStatusData.bitcoinPrice * web3.utils.fromWei(setNumber(auth.contractStatusData.bprox2PriceInRbtc), 'ether'))
            };
        default:
      }
    }
  };

  //const [currencyCode, setCurrencyCode]=  useState('USDPrice');

  return (
    <>{
      <div className={'mrl-25 div_coin'}>
        {/*<img src={image} alt="arrow" height={38}/>*/}
        {image}
        <div className={'div_values'}>
          <span className="value_usd1">
            <LargeNumber {...{ amount: getBalanceUSD(), currencyCode: 'USDPrice', includeCurrency: true }} />
          </span>
          { auth.contractStatusData && <PriceVariation tokenName={tokenName} priceVariation={getPriceVariation()} blockHeight={auth.contractStatusData.historic.blockHeight} /> }
        </div>
      </div>}
    </>
  );
}

export default HeaderCoins;