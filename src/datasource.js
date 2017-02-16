import _ from 'lodash';

export class MetaQueryDatasource {
  constructor(instanceSettings, $q, datasourceSrv) {
    this.instanceSettings = instanceSettings;
    this.$q = $q;
    this.datasourceSrv = datasourceSrv;
  }

  query(options) {
    var sets = _.groupBy(options.targets, 'datasource');
    var promises = _.map(sets, targets => {
      var dsName = targets[0].datasource;
      if (dsName === 'Meta Query') {
        return this.$q.when({ data: [] });
      }

      return this.datasourceSrv.get(dsName).then(ds => {
        var opt = angular.copy(options);
        opt.targets = targets;
        return ds.query(opt).then(results => {
          _.each(results.data, (result, idx) => {
            result.refId = opt.targets[idx].refId;
          });
          return results;
        });
      });
    });

    return this.$q.all(promises).then(results => {
      let data = _.flatten(_.map(results, 'data'));
      let indexedData = _.keyBy(data, 'refId');
      _.each(options.targets, target => {
        let dsName = target.datasource;
        if (dsName === 'Meta Query') {
          let expr = target.expression.split(/ /);
          let opRefId = expr[0].replace(/#/, '');
          let datapoints = _.map(indexedData[opRefId].datapoints, d => {
            if (!d[0]) {
              return [d[0], d[1]];
            }
            expr[2] = parseFloat(expr[2]);
            var r = d[0]
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
          })
        }
      });
      return { data: data };
    });
  }
}