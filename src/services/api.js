import axios from 'axios';

export default (method, url, params, allData = false) => {
  return new Promise((resolve, reject) => {
    const data = ['delete', 'get'].includes(method) ? {params} : {data: params};
    axios({method, url: `${url}`, ...data})
      .then(response => {
        resolve(allData ? response : response.data)
      })
      .catch(error => {
        reject(error);
      });
  });
};
