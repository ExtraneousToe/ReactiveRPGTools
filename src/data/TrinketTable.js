import BaseDataItem from "./BaseDataItem";
import { DiceRoll } from "rpg-dice-roller";

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

  constructor({ trinketTableType, rows, source }) {
    super(undefined, source);
    this.trinketTableType = trinketTableType;
    this.rows = rows.map((r) => new TrinketTableRow(r));
  }

  get id() {
    return BaseDataItem.convertToId(this.trinketTableType, this.source);
  }

  roll() {
    let roller = new DiceRoll("d8");

    return { result: roller.total, row: this.rows[roller.total - 1] };
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
