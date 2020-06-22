import React from 'react';

// TODO: Add proptypes
// TODO: Add tests
export default function BuildHardCounters(props) {
  const { counterTeams, toggle } = props;

  // const test = counterTeams.filter((x) => x.isHardCounter === true);
  // console.log('test :>> ', test);
  const teams = counterTeams
    .filter((x) => x.isHardCounter === true)
    .map((counterTeam) => (
    // Hard Counter Div
    <div key={counterTeam.counterId} className="hardCounterRow counterCard">
      <img
        id={counterTeam.counterId}
        className="toonImg hardCounter"
        onClick={toggle}
        src={counterTeam.oppFaceImage}
        title={counterTeam.counterTeamName}
        alt={counterTeam.counterTeamName}
      />
    </div>
    ));
  return teams;
}
