export class HarvestedItem {
  static fromOld(oldItem) {
    return new HarvestedItem({
      name: oldItem.Name,
      value: oldItem.ValueGP,
      weight: oldItem.WeightLB,
      craftingUsage: oldItem.CraftingUsage,
      description: oldItem.Description,
      useText: oldItem.UseText,
      requiredToolNames: oldItem.RequiredToolNames,
    });
  }

  constructor({
    name,
    value,
    weight,
    craftingUsage,
    description,
    useText,
    requiredToolNames,
  }) {
    this.name = name;
    this.value = value;
    this.weight = weight;
    this.craftingUsage = craftingUsage;
    this.description = description;
    this.useText = useText;
    this.requiredToolNames = requiredToolNames;
  }

  get id() {
    return this.name.replace(/\s+/gi, "_").replace(/\//gi, "-").toLowerCase();
  }
}
