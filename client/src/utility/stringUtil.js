export function sortAscending(a, b) {
    let x = a.toLowerCase();
    let y = b.toLowerCase();

    if (y < x) {
        return 1;
    }
    if (x < y) {
        return -1;
    }
    return 0;
}
