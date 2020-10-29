export function getIdFromMonster(monster) {
  let idReplaceRegex = /[\s'\-()]/g;
  return (
    monster.name.replace(idReplaceRegex, "") +
    "_" +
    monster.source
  ).toLowerCase();
}

export function stringFromSize(size) {
  switch (size) {
    case "T":
      return "Tiny";
    case "S":
      return "Small";
    case "M":
      return "Medium";
    case "L":
      return "Large";
    case "H":
      return "Huge";
    case "G":
      return "Gargantuan";
    default:
      return `?[${size}]?`;
  }
}
