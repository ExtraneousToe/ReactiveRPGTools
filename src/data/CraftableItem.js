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
    source = "HH#",
  }) {
    super(name, source);
    this.crafter = crafter;
    this.rarity = rarity;
    this.requiresAttunement = requiresAttunement;
    this.description = description;
    this.materials = materials;
    this.type = type;
    this.materialGrouping = materialGrouping;
    this.attunementNote = attunementNote;
  }
}
