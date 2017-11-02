import angular from 'angular';

import {App} from './app';
import {Model} from './app/services/model';
import {Header} from './app/components/header';
import {Table} from './app/components/table';

angular
  .module('writers', [])
  .service('model', Model)
  .component('writersApp', App)
  .component('writersHeader', Header)
  .component('writersTable', Table)
  ;
