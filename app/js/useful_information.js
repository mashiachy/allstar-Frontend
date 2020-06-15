import Vue from 'vue';
import vSelect from 'vue-select';
import Siema from 'vue2-siema';
import {adaptiveMixin, filterMixin, listingsMixin, menuMixin, promiseModInit, weCanMixin} from "./base";

const promiseMod = promiseModInit();

Vue.component('v-select', vSelect);
Vue.use(Siema);

const menu = new Vue({
  el: '#header',
  mixins: [adaptiveMixin, menuMixin],
});

const filter = new Vue({
  el: '#filter',
  mixins: [adaptiveMixin, filterMixin],
});

let mixinsForMain = adaptiveMixin.computed.isDesktop() ? [adaptiveMixin, listingsMixin] : [adaptiveMixin, listingsMixin, weCanMixin];
const main = new Vue({
  el: '#main',
  mixins: mixinsForMain,
});