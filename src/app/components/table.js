class TableController { }

export const Table = {
  template: require('./table.html'),
  controller: TableController,
  bindings: {
    columns: '<',
    rows: '<'
  }
};
