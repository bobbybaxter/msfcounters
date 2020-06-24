/* eslint-disable import/no-dynamic-require */
export default function buildTeam(teamToBuild, allCharacters) {
  const characters = [...allCharacters];
  const team = { ...teamToBuild };

  const options = [
    'toon1Name',
    'toon2Name',
    'toon3Name',
    'toon4Name',
    'toon5Name',
    'oppToon1Name',
    'oppToon2Name',
    'oppToon3Name',
    'oppToon4Name',
    'oppToon5Name',
    'faceName',
    'oppFaceName',
  ];


  options.forEach((option) => {
    const optionKey = option.slice(0, -4);
    const matchedCharacter = characters.find((x) => x.name === team[option]);
    if (matchedCharacter) {
      const characterImgRoute = matchedCharacter.image.split('/u/').pop().split('/')[0];
      const characterImg = require(`../public/static/characterImages/${characterImgRoute}.png`);
      console.log('characterImg :>> ', characterImg);
      team[`${optionKey}Id`] = matchedCharacter.base_id;
      team[`${optionKey}Image`] = characterImg.default;
    }
  });

  return team;
}
