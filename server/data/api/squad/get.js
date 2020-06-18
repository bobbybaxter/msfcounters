const axios = require('axios');

const { squadSheet } = require('../../../.config.json');

// TODO: need to parse raw google sheets data
module.exports = (app) => new Promise((resolve, reject) => {
  axios.get(squadSheet)
    .then((res) => resolve(res.data))
    .catch((err) => reject(err));
});
