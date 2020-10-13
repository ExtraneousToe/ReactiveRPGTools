export function getIdFromMonster(monster) {
    return monster.Name.replace(/\s+/g, "_").replace(/[()]/g, "").toLowerCase();
}
