export class HarvestingTable {
  static fromOld(oldMonster) {
    if (!oldMonster.HarvestingTable.Rows) return null;

    return new HarvestingTable({
      name: oldMonster.Name,
      rows: oldMonster.HarvestingTable.Rows.map(
        (row) =>
          new HarvestingTableRow({
            difficultyClass: row.DifficultyClass,
            itemNameReference: row.ItemNameRef,
            quantity: row.Quantity,
            notes: row.Notes,
          })
      ),
    });
  }

  constructor({ name, rows }) {
    this.name = name;
    this.rows = rows;
  }
}

class HarvestingTableRow {
  constructor({ difficultyClass, itemNameReference, quantity, notes }) {
    this.difficultyClass = difficultyClass;
    this.itemNameReference = itemNameReference;
    this.quantity = quantity;
    this.notes = notes;
  }
}
