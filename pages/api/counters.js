import axios from 'axios';
import parseGoogleSheet from '../../helpers/parseGoogleSheet';

import { sheetId, apiKey } from '../../config/.config.json';

// TODO: need to parse raw google sheets data

export const getCounterData = (req) => new Promise((resolve, reject) => {
  axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Counters?key=${apiKey}`)
    .then((res) => {
      const parsedData = parseGoogleSheet(res.data.values);
      resolve(parsedData);
    })
    .catch((err) => reject(err));
});

export default (req, res) => {
  res.status(200).json(getCounterData(req));
};