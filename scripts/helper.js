const fs = require('fs');

const readJsonFile = (path) => {
  console.log('Read json path: ', path);
  let config;

  if (fs.existsSync(path)) {
    const rawdata = fs.readFileSync(path);
    config = JSON.parse(rawdata);
  } else {
    throw new Error(`Missing json file.`);
  }
  return config;
};


module.exports = {
    readJsonFile
};
  