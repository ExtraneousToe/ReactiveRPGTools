import BaseDataItem from "./BaseDataItem";

export class CraftableItem extends BaseDataItem {
  constructor({
    name,
    crafter,
    rarity,
    requiresAttunement,
    description,
    materials,
    type,
    materialGrouping,
    attunementNote,
  }) {
    super();
    this.name = name;
    this.crafter = crafter;
    this.rarity = rarity;
    this.requiresAttunement = requiresAttunement;
    this.description = description;
    this.materials = materials;
    this.type = type;
    this.materialGrouping = materialGrouping;
    this.attunementNote = attunementNote;
  }

  get id() {
    return this.name.toLowerCase().replace(/\s+/g, "_");
  }

  doSimpleFilter(filterString) {
    return this.name.toLowerCase().includes(filterString.toLowerCase());
  }
}
