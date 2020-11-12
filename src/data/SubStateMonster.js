import BaseDataItem from "./BaseDataItem";

export class SubStateMonster extends BaseDataItem {
  constructor({
    name,
    cardSize,
    source,
    trinketTableType,
    harvestingTableGroup,
  }) {
    super(name, source);
    this.cardSize = cardSize;
    this.trinketTableType = trinketTableType;
    this.harvestingTableGroup = harvestingTableGroup;

    // if (!trinketTableType || /HH\d$/i.test(trinketTableType)) {
    //   this.trinketTableType = trinketTableType;
    // } else {
    //   this.trinketTableType = BaseDataItem.convertToId(trinketTableType, "HH1");
    // }

    // if (!harvestingTableGroup || /HH\d$/i.test(harvestingTableGroup)) {
    //   this.harvestingTableGroup = harvestingTableGroup;
    // } else {
    //   this.harvestingTableGroup = BaseDataItem.convertToId(
    //     harvestingTableGroup,
    //     "HH1"
    //   );
    // }
  }
}
