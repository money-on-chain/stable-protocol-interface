import api from "../services/api";
import config from "../Config/constants";
import axios from "axios";

async function priceVariation24hs() {
    const response = await fetch("https://api-moctest.coinfabrik.com/api/v1/webapp/prices/var/", {
      method: 'GET',
      mode: 'cors',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      referrerPolicy: 'Access-Control-Allow-Origin',
      // redirect: 'follow',
    });
    return response.json();
  }

export { priceVariation24hs };


export function callPrices(datas) {
    return fetch(`${config.api_moctest}`+'webapp/prices/var/?address='+datas)
        .then((response) => response.json())
        .catch((err) => {
            console.log(err);
        });
}

