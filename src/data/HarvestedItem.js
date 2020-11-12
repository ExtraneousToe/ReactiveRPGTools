import BaseDataItem from "./BaseDataItem";

export class HarvestedItem extends BaseDataItem {
  constructor({
    name,
    value,
    weight,
    craftingUsage,
    description,
    useText,
    requiredToolNames,
    source,
  }) {
    super(name, source);
    this.value = value;
    this.weight = weight;
    this.craftingUsage = craftingUsage;
    this.description = description;
    this.useText = useText;
    this.requiredToolNames = requiredToolNames;
  }
}
