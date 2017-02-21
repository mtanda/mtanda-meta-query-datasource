'use strict';

System.register(['./datasource', './query_ctrl'], function (_export, _context) {
  "use strict";

  var MetaQueryDatasource, MetaQueryQueryCtrl;
  return {
    setters: [function (_datasource) {
      MetaQueryDatasource = _datasource.MetaQueryDatasource;
    }, function (_query_ctrl) {
      MetaQueryQueryCtrl = _query_ctrl.MetaQueryQueryCtrl;
    }],
    execute: function () {
      _export('Datasource', MetaQueryDatasource);

      _export('QueryCtrl', MetaQueryQueryCtrl);
    }
  };
});
//# sourceMappingURL=module.js.map
