import React from 'react';

// TODO: Add proptypes
// TODO: Add tests
export default function buildSoftCounters(props) {
  const { counterTeams, toggle } = props;
  const exp = counterTeams
    .filter((x) => x.isHardCounter === false)
    .map((counterTeam) => (
    // Soft Counter Div
    <div key={counterTeam.counterId} className="softCounterRow counterCard">
      <img
        id={counterTeam.counterId}
        className="toonImg softCounter"
        onClick={toggle}
        src={counterTeam.oppFaceImage}
        title={counterTeam.counterTeamName}
        alt={counterTeam.counterTeamName}
      />
    </div>
    ));
  return exp;
}
