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
    source,
  }) {
    super(name, source);
    this.crafter = crafter;
    this.rarity = rarity;
    this.requiresAttunement = requiresAttunement;
    this.description = description;
    this.materials = materials;
    // this.materials = materials.map((mat) => {
    //   return {
    //     componentId: mat.componentId.replace(/[_-]/g, "") + "_hh1",
    //     quantity: mat.quantity,
    //   };
    // });
    this.type = type;
    this.materialGrouping = materialGrouping;
    this.attunementNote = attunementNote;

    // check name and source
    // const match = / \((\D?\D?\D?)\)$/.exec(this.name);
    // if (match) {
    //   console.log(
    //     `match on name [${this.name}]. Result: ${JSON.stringify(match)}`
    //   );
    //   this.name = this.name.substring(0, this.name.indexOf(match[0]));
    //   this.source = match[1];
    //   console.log(`Replaced name: ${this.name}`);
    // }
  }
}
