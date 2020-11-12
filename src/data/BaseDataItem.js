export default class BaseDataItem {
  constructor(name, source) {
    this.name = name;
    this.source = source;
  }

  get id() {
    return BaseDataItem.convertToId(this.name, this.source);
  }

  doSimpleFilter(filterString) {
    return this.name.toLowerCase().includes(filterString.toLowerCase());
  }

  static convertToId(name, source) {
    let outString = name.replace(/[\s'\-()/]/g, "");
    if (source) outString += `_${source}`;
    return outString.toLowerCase();
  }
}
