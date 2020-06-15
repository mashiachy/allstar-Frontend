import Vue from 'vue';
import vSelect from 'vue-select';
import {promiseModInit, adaptiveMixin, menuMixin, filterMixin} from "./base";


const promiseMod = promiseModInit();

Vue.component('v-select', vSelect);

const menu = new Vue({
  el: '#header',
  mixins: [adaptiveMixin, menuMixin],
});

const filter = new Vue({
  el: '#filter',
  mixins: [adaptiveMixin, filterMixin],
});