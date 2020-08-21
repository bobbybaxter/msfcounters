const axios = require('axios');

const buildSquad = require('../../../util/buildSquad');
const buildOpponentTeam = require('../../../util/buildOpponentTeam');
const characters = require('../../../util/characters.json');

const parseGoogleSheet = require('../../../helpers/parseGoogleSheet');

const { sheetId, apiKey } = require('../../../.config.json');

const buildSquadObjects = (res, squads, squad, view) => {
  // get the correct counter info
  const counterInfo = res
    .filter((x) => (view === 'normal'
      ? x.opponentTeam === squad.id
      : x.counterTeam === squad.id
    ));

  // get the left side squad
  const leftSideSquad = buildSquad(squad, characters.data);

  // get the right side squads
  const rightSideSquads = counterInfo
    .map((matchup) => buildOpponentTeam(
      matchup, squads, characters.data, view,
    ));

  // put them into an object and push into state
  const squadObject = rightSideSquads.length ? { leftSideSquad, rightSideSquads } : '';
  return squadObject;
};

module.exports = async (app) => {
  const unparsedSquads = await axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Teams?key=${apiKey}`);
  const unparsedCounters = await axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Counters?key=${apiKey}`);
  const parsedSquads = parseGoogleSheet(unparsedSquads.data.values);
  const parsedCounters = parseGoogleSheet(unparsedCounters.data.values);

  const normal = [];
  const reverse = [];

  parsedSquads.forEach((squad) => {
    normal.push(buildSquadObjects(parsedCounters, parsedSquads, squad, 'normal'));
    reverse.push(buildSquadObjects(parsedCounters, parsedSquads, squad, 'reverse'));
  });

  const countersObject = {
    squads: parsedSquads,
    countersNormal: normal.filter((x) => x !== ''),
    countersReverse: reverse.filter((x) => x !== ''),
  };

  return countersObject;
};
