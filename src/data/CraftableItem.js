import { Row } from "react-bootstrap";

export class CraftableItem {
  static fromOld(oldItem) {
    return new CraftableItem({
      name: oldItem.Name,
      crafter: oldItem.Crafter,
      rarity: oldItem.Rarity,
      requiresAttunement: oldItem.RequiresAttunement,
      description: oldItem.Description,
      materials: oldItem.Materials.map((matRow) => {
        return { componentId: matRow.ComponentId, quantity: matRow.Quantity };
      }),
      type: oldItem.Type,
      materialGrouping: oldItem.MaterialGrouping,
      attunementNote: oldItem.AttunementNote,
    });
  }

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
}
