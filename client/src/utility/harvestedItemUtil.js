export function getItemReferenceFromName(name) {
    return name.replace(/\s+/gi, "_").toLowerCase();
}

export function getItemReference(harvestedItem) {
    return getItemReferenceFromName(harvestedItem.Name);
}
