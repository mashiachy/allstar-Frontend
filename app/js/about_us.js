import Vue from 'vue';
import vSelect from 'vue-select';
import Siema from 'vue2-siema';
import {
  adaptiveMixin,
  menuMixin,
  filterMixin,
  myWOW,
  goTopInit,
  webpInit,
  LazyLoader,
  listingsMixin,
  siemaLazyInitMixin,
} from "./base";

webpInit();
const wow = myWOW({selector: '.animated'});
goTopInit({
  selector: '.gotop',
  offset: '100vh',
});

const ll = new LazyLoader({
  selector: '[data-lazy]',
});

Vue.component('v-select', vSelect);

const app = new Vue({
  el: '#app',
  mixins: [adaptiveMixin, menuMixin, filterMixin, listingsMixin, siemaLazyInitMixin,],
});
