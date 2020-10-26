export function getIdFromMonster(monster) {
  let idReplaceRegex = /[\s'\-()]/g;
  return (
    monster.name.replace(idReplaceRegex, "") +
    "_" +
    monster.source
  ).toLowerCase();
}
