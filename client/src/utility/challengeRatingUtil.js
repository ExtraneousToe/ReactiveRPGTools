export function sortAscending(a, b) {
    if (a === null) return -1;
    if (b === null) return 1;

    let aRating = Number(a.CR);
    let bRating = Number(b.CR);

    return aRating - bRating;
}
