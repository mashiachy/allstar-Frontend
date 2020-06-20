import Vue from 'vue';
import vSelect from 'vue-select';
import Siema from 'vue2-siema';
import {
  adaptiveMixin,
  filterMixin,
  listingsMixin,
  menuMixin,
  myWOW,
  goTopInit,
  webpInit,
  LazyLoader,
  siemaLazyInitMixin,
} from "./base";

webpInit();
const wow = myWOW({selector: '.animated'});
goTopInit({
  selector: '.gotop',
  offset: '110vh',
});

const ll = new LazyLoader({
  selector: '[data-lazy]',
});

Vue.component('v-select', vSelect);
Vue.use(Siema);

const app = new Vue({
  el: '#app',
  mixins: [adaptiveMixin, menuMixin, filterMixin, listingsMixin, siemaLazyInitMixin,],
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