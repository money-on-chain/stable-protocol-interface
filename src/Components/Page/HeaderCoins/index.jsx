/* eslint-disable default-case */
import './style.scss';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { AuthenticateContext } from '../../../Context/Auth';
import PriceVariation from '../../PriceVariation';
import {LargeNumber} from "../../LargeNumber";
import web3 from "web3";
import {Alert} from "antd";
import {setNumber, setToLocaleString} from "../../../Helpers/helper";
import {useTranslation} from "react-i18next";

function HeaderCoins(props) {
  const auth = useContext(AuthenticateContext);
  const { accountData = {} } = auth;
  const { image, arrow, color, tokenName } = props;
  const [timeRefresh, setTimeRefresh] = useState(new Date());

  useEffect(() => {
        setInterval(() => {
            setTimeRefresh(new Date())
        }, 30000);
  }, [auth]);

  /*
  useEffect(() => {
    if(accountData.Owner!==undefined){
      callPrices(accountData.Owner)
          .then(items => {
            if(items!== undefined){
              setDailyVariation(items)
            }
          }).catch(err => {
            console.log(err)
        });
    }
  }, [accountData.Owner]);
  */

  // useEffect(() => {
  //   setDailyVariation({
  //     "current": {
  //       "_id": "625031dc240b5f9601c09764",
  //       "blockHeight": 2738557,
  //       "bitcoinPrice": "43214000000000000000000",
  //       "bproDiscountPrice": "626615413899345683",
  //       "bproPriceInRbtc": "626615413899345683",
  //       "bproPriceInUsd": "27078558496246324345162",
  //       "bprox2PriceInBpro": "1581361873673443676",
  //       "bprox2PriceInRbtc": "990905724996529711",
  //       "bprox2PriceInUsd": "4.2821000000000034e+22",
  //       "createdAt": "2022-04-08T12:58:51.000Z",
  //       "reservePrecision": "1000000000000000000"
  //     },
  //     "24hs": {
  //       "_id": "624edff7240b5f96017dc0df",
  //       "blockHeight": 2735684,
  //       "bitcoinPrice": "43602800000000000000000",
  //       "bproDiscountPrice": "630478399400189611",
  //       "bproPriceInRbtc": "630478399400189611",
  //       "bproPriceInUsd": "27490623553366587570510",
  //       "bprox2PriceInBpro": "1585944382649727021",
  //       "bprox2PriceInRbtc": "999903675910721736",
  //       "bprox2PriceInUsd": "4.359860000000002e+22",
  //       "createdAt": "2022-04-07T12:58:18.000Z",
  //       "reservePrecision": "1000000000000000000"
  //     }
  //   })
  // }, [accountData.Owner]);

  const [t, i18n] = useTranslation(["global", 'moc'])

  const getBalanceUSD = () => {
    if (auth.contractStatusData) {
      switch (props.tokenName) {
        case 'stable':
          if (auth.contractStatusData['bitcoinPrice'] != 0) {
            // return (web3.utils.toWei(auth.contractStatusData['bitcoinPrice'], 'ether'));
            // return setToLocaleString(parseFloat(web3.utils.fromWei(setNumber(auth.contractStatusData['bitcoinPrice']), 'ether')),2,i18n)
            return auth.contractStatusData['bitcoinPrice']
          } else {
            return 0;
          }
        case 'riskpro':
          if (auth.contractStatusData['bproPriceInUsd'] != 0) {
            // return (web3.utils.toWei(auth.contractStatusData['bproPriceInUsd'], 'ether'));
            // return setToLocaleString(parseFloat(web3.utils.fromWei(setNumber(auth.contractStatusData['bproPriceInUsd']), 'ether')),2,i18n)
            return auth.contractStatusData['bproPriceInUsd']
          } else {
            return 0;
          }

        case 'riskprox':
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
        case 'reserve':
        case 'stable':
          return {day: auth.contractStatusData.historic.bitcoinPrice, current: auth.contractStatusData.bitcoinPrice};
        case 'riskpro':
          return {day: auth.contractStatusData.historic.bproPriceInUsd, current: auth.contractStatusData.bproPriceInUsd};
        case 'riskprox':
          return {
            day: (auth.contractStatusData.historic.bitcoinPrice * web3.utils.fromWei(setNumber(auth.contractStatusData.historic.bprox2PriceInRbtc), 'ether')),
            current: (auth.contractStatusData.bitcoinPrice * web3.utils.fromWei(setNumber(auth.contractStatusData.bprox2PriceInRbtc), 'ether'))
            };
        default:
      }
    }
  };

  const [currencyCode, setCurrencyCode]=  useState('USDPrice');

  return (
    <>{
      <div className={'mrl-25 div_coin'}>
        {/*<img src={image} alt="arrow" height={38}/>*/}
        <img src={process.env.PUBLIC_URL + "/global/"+image}  alt="arrow" height={38}/>
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