export default class BaseDataItem {
  get id() {
    return "BASE CLASS";
  }

  doSimpleFilter(filterString) {
    return filterString.length === 0;
  }
}
