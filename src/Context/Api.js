import api from "../services/api";
import {config} from "../Config/config";

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


export async function callPrices(datas) {
    try {
        const resp = await fetch(`${config.api.api_moctest}`+'webapp/prices/var/?address='+datas, {}, 1000)
        const data = await resp.json()
        return data
    } catch (e) {
        if (e === "timeout") {
            return e
        }
    }
}
