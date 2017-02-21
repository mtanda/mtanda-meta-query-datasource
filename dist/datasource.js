'use strict';

System.register(['lodash'], function (_export, _context) {
  "use strict";

  var _, _createClass, MetaQueryDatasource;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_lodash) {
      _ = _lodash.default;
    }],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      _export('MetaQueryDatasource', MetaQueryDatasource = function () {
        function MetaQueryDatasource(instanceSettings, $q, datasourceSrv) {
          _classCallCheck(this, MetaQueryDatasource);

          this.instanceSettings = instanceSettings;
          this.$q = $q;
          this.datasourceSrv = datasourceSrv;
        }

        _createClass(MetaQueryDatasource, [{
          key: 'query',
          value: function query(options) {
            var _this = this;

            var sets = _.groupBy(options.targets, 'datasource');
            var promises = _.map(sets, function (targets) {
              var dsName = targets[0].datasource;
              if (dsName === 'Meta Query') {
                return _this.$q.when({ data: [] });
              }

              return _this.datasourceSrv.get(dsName).then(function (ds) {
                var opt = angular.copy(options);
                opt.targets = targets;
                return ds.query(opt).then(function (results) {
                  _.each(results.data, function (result, idx) {
                    result.refId = opt.targets[idx].refId;
                  });
                  return results;
                });
              });
            });

            return this.$q.all(promises).then(function (results) {
              var data = _.flatten(_.map(results, 'data'));
              var indexedData = _.keyBy(data, 'refId');
              _.each(options.targets, function (target) {
                var dsName = target.datasource;
                if (dsName === 'Meta Query') {
                  var expr = target.expression.split(/ /);
                  var opRefId = expr[0].replace(/#/, '');
                  var datapoints = _.map(indexedData[opRefId].datapoints, function (d) {
                    if (!d[0]) {
                      return [d[0], d[1]];
                    }
                    expr[2] = parseFloat(expr[2]);
                    var r = d[0];
                    switch (expr[1]) {
                      case '+':
                        r += expr[2];
                        break;
                      case '-':
                        r -= expr[2];
                        break;
                      case '*':
                        r *= expr[2];
                        break;
                      case '/':
                        r /= expr[2];
                        break;
                    }
                    return [r, d[1]];
                  });
                  data.push({
                    refId: target.refId,
                    target: target.expression,
                    datapoints: datapoints
                  });
                }
              });
              return { data: data };
            });
          }
        }]);

        return MetaQueryDatasource;
      }());

      _export('MetaQueryDatasource', MetaQueryDatasource);
    }
  };
});
//# sourceMappingURL=datasource.js.map
