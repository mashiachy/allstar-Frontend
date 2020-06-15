import Vue from 'vue';
import vSelect from 'vue-select';
import Siema from 'vue2-siema';
import {adaptiveMixin, filterMixin, listingsMixin, menuMixin, promiseModInit} from "./base";

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

const main = new Vue({
  el: '#main',
  mixins: [adaptiveMixin, listingsMixin],
  data () {
    return {
      form: {
        name: '',
        surname: '',
        prefix: '123',
        phone: '',
        email: '',
        message: '',
      },
    };
  },
  computed: {
    prefixList: () => ['123', '058', '059', '060', '061', '062', '063', '064', '065', '066', '067',],
  },
});