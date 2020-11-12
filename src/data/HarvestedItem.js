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
    source = "HH1",
  }) {
    super(name, source);
    this.value = value;
    this.weight = weight;
    this.craftingUsage = craftingUsage.map((cu) => {
      if (/hh\d$/i.test(cu)) return cu;
      else return BaseDataItem.convertToId(cu, "HH1");
    });
    this.description = description;
    this.useText = useText;
    this.requiredToolNames = requiredToolNames;
  }
}
