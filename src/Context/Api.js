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