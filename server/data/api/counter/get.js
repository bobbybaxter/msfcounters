const axios = require('axios');
const parseGoogleSheet = require('../../../helpers/parseGoogleSheet');

const { sheetId, apiKey } = require('../../../.config.json');

// TODO: need to parse raw google sheets data

module.exports = (app) => new Promise((resolve, reject) => {
  axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Counters?key=${apiKey}`)
    .then((res) => {
      const parsedData = parseGoogleSheet(res.data.values);
      resolve(parsedData);
    })
    .catch((err) => reject(err));
});
