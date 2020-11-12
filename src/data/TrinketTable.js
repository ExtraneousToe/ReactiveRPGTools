import BaseDataItem from "./BaseDataItem";

export class TrinketTable extends BaseDataItem {
  // static fromOld({ TrinketTableType, Rows }) {
  //   return new TrinketTable({
  //     trinketTableType: TrinketTableType,
  //     rows: Rows.map(
  //       (row) =>
  //         new TrinketTableRow({
  //           d8Roll: row.D8Roll,
  //           descriptionLine: row.DescriptionLine,
  //           value: row.ValueGP,
  //           weight: row.WeightLB,
  //         })
  //     ),
  //   });
  // }

  constructor({ trinketTableType, rows, source = "HH#" }) {
    super(undefined, source);
    this.trinketTableType = trinketTableType;
    this.rows = rows;
  }

  get id() {
    return BaseDataItem.convertToId(this.trinketTableType, this.source);
  }
}

class TrinketTableRow {
  constructor({ d8Roll, descriptionLine, value, weight }) {
    this.d8Roll = d8Roll;
    this.descriptionLine = descriptionLine;
    this.value = value;
    this.weight = weight;
  }
}
