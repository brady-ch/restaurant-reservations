module.exports = class Table {
  /**
   *
   * @param {string} table_name
   * @param {number} capacity
   */
  constructor(table_name = "", capacity = 0) {
    this.table_name = table_name;
    this.capacity = capacity;
  }
  get validateData() {
    return this.table_name.length < 2 || this.capacity < 1 ? false : true;
  }
};
