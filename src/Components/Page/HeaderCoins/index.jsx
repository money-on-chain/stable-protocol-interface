/* eslint-disable default-case */
import './style.scss';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { AuthenticateContext } from '../../../Context/Auth';
import PriceVariation from '../../PriceVariation';
import {LargeNumber} from "../../LargeNumber";
import web3 from "web3";
import {Alert} from "antd";

function HeaderCoins(props) {
  const auth = useContext(AuthenticateContext);
  const { image, arrow, color, tokenName } = props;
  const [dailyVariation, setDailyVariation] = useState(null);

  useEffect(() => {
    // priceVariation24hs().then(data => setDailyVariation(data['24hs']));

    setDailyVariation({
      "current": {
        "_id": "625031dc240b5f9601c09764",
        "blockHeight": 2738557,
        "bitcoinPrice": "43214000000000000000000",
        "bproDiscountPrice": "626615413899345683",
        "bproPriceInRbtc": "626615413899345683",
        "bproPriceInUsd": "27078558496246324345162",
        "bprox2PriceInBpro": "1581361873673443676",
        "bprox2PriceInRbtc": "990905724996529711",
        "bprox2PriceInUsd": "4.2821000000000034e+22",
        "createdAt": "2022-04-08T12:58:51.000Z",
        "reservePrecision": "1000000000000000000"
      },
      "24hs": {
        "_id": "624edff7240b5f96017dc0df",
        "blockHeight": 2735684,
        "bitcoinPrice": "30602800000000000000000",
        "bproDiscountPrice": "630478399400189611",
        "bproPriceInRbtc":" 630478399400189611",
        "bproPriceInUsd": "27490623553366587570510",
        "bprox2PriceInBpro": "1585944382649727021",
        "bprox2PriceInRbtc": "999903675910721736",
        "bprox2PriceInUsd": "4.359860000000002e+22",
        "createdAt": "2022-04-07T12:58:18.000Z",
        "reservePrecision": "1000000000000000000"
      }
    })
  }, []);


  const getBalanceUSD = () => {
    switch (props.tokenName) {
      case 'stable':
        if (dailyVariation.current !== null) {
          return dailyVariation.current.bitcoinPrice;
        } else {
          return 0;
        }
      case 'riskpro':
        if (dailyVariation.current !== null) {
          return dailyVariation.current.bproPriceInUsd;
        } else {
          return 0;
        }

      case 'riskprox':
        if (dailyVariation.current !== null) {
          return dailyVariation.current.bprox2PriceInUsd;
        } else {
          if (dailyVariation.current['bitcoinPrice'] !== null) {
            return dailyVariation.current.bitcoinPrice;
          } else {
            return 0;
          }
        }
    }
  };

  const getPriceVariation = () => {
    switch (tokenName)
    {
      case 'reserve':
      case 'stable':
        return {day: dailyVariation['24hs'].bitcoinPrice, current: dailyVariation['current'].bitcoinPrice};

      case 'riskpro':
        return {day: dailyVariation['24hs'].bproPriceInUsd, current: dailyVariation['current'].bproPriceInUsd};

      case 'riskprox':
        return {day: dailyVariation['24hs'].bprox2PriceInUsd, current: dailyVariation['current'].bprox2PriceInUsd};
      default:
    }
  };

  const [currencyCode, setCurrencyCode]=  useState('USDPrice');

  return (
    <>{ dailyVariation &&
      <div className={'mrl-25 div_coin'}>
        <img src={window.location.origin + '/' + image} alt="arrow" height={38}/>
        <div className={'div_values'}>
          <span className="value_usd">
            <LargeNumber amount={getBalanceUSD()} {...{ currencyCode }} />
            <span className={'div_values-coin'}>USD</span>
          </span>
          <PriceVariation priceVariation={getPriceVariation()} blockHeight={dailyVariation['24hs'].blockHeight} />
        </div>
      </div>}
    </>
  );
}

export default HeaderCoins;