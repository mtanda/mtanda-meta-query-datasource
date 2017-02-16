import {QueryCtrl} from 'app/plugins/sdk';

import _ from 'lodash';

class MetaQueryQueryCtrl extends QueryCtrl {
  constructor($scope, $injector) {
    super($scope, $injector);
  }
}

MetaQueryQueryCtrl.templateUrl = 'partials/query.editor.html';
export {MetaQueryQueryCtrl};
