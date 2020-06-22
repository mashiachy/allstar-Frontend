import Vue from 'vue';
import vSelect from 'vue-select';
import {
  adaptiveMixin,
  menuMixin,
  myWOW,
  webpInit,
  LazyLoader,
} from "./base";

webpInit();
const wow = myWOW({selector: '.animated'});

const ll = new LazyLoader({
  selector: '[data-lazy]',
});

Vue.component('v-select', vSelect);

const app = new Vue({
  el: '#app',
  mixins: [adaptiveMixin, menuMixin,],
  data () {
    return {
      form: {
        name: '',
        surname: '',
        prefix: '+123',
        phone: '',
        email: '',
        message: '',
      },
    };
  },
  computed: {
    prefixList: () => ['+123', '+058', '+059', '+060', '+061', '+062', '+063', '+064', '+065', '+066', '+067',],
  },
  mounted () {
    this.ll = ll;
  },
});