import Vue from 'vue';
import vSelect from 'vue-select';
import VV from 'vee-validate';
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

const {ValidationProvider, extend} = VV;

extend('required', {
  validate (value) {
    return {
      required: true,
      valid: ['', null, undefined].indexOf(value) === -1
    };
  },
  computesRequired: true,
  message: 'The {_field_} field is required',
});

Vue.component('validationProvider', ValidationProvider);
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