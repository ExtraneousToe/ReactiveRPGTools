export function sortAscending(a, b) {
    if (a === null) return -1;
    if (b === null) return 1;

    let out = a.CR - b.CR;

    if (out !== 0) {
        return out;
    }

    out = a.InLair - b.InLair;

    if (out !== 0) {
        return out;
    }

    out = a.InCoven - b.InCoven;

    return out;
}
