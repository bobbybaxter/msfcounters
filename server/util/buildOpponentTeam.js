/* eslint-disable import/no-dynamic-require */
const buildSquad = require('./buildSquad');

module.exports = function buildOpponentTeam(matchupToBuild, allTeams, allCharacters, view) {
  // finds opponent team from the counterData
  const matchup = matchupToBuild;
  const filteredTeam = view === 'normal'
    ? allTeams.find((team) => team.id === matchup.counterTeam)
    : allTeams.find((team) => team.id === matchup.opponentTeam);

  // adds fields needed to display on CounterRow and BuildDescriptions
  if (filteredTeam) {
    matchup.oppFaceName = filteredTeam.faceName;
    matchup.oppToon1Name = filteredTeam.toon1Name;
    matchup.oppToon2Name = filteredTeam.toon2Name;
    matchup.oppToon3Name = filteredTeam.toon3Name;
    matchup.oppToon4Name = filteredTeam.toon4Name;
    matchup.oppToon5Name = filteredTeam.toon5Name;
    matchup.oppTeamName = filteredTeam.name;
    matchup.oppSubs = filteredTeam.subs;
    matchup.oppDetails = filteredTeam.description;
    matchup.oppCounterStrategy = filteredTeam.counterStrategy;
    return buildSquad(matchup, allCharacters);
  }

  return [];
};
