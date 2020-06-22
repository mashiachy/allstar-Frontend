import Vue from 'vue';
import vSelect from 'vue-select';
import {adaptiveMixin, menuMixin, myWOW, goTopInit, webpInit, LazyLoader} from "./base";

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
  mixins: [adaptiveMixin, menuMixin,],
  data () {
    return {
      form: {
        want: 'Sale',
        prop: 'Property',
        address: '',
        description: '',
        price: '',
        name: '',
        surname: '',
        email: '',
        prefix: '+123',
        phone: '',
        files: [],
      },
    };
  },
  computed: {
    prefixList: () => ['+123', '+058', '+059', '+060', '+061', '+062', '+063', '+064', '+065', '+066', '+067',],
  },
  methods: {
    changeFileInput (files) {
      this.form.files = Array.isArray(files) ? files : Array.from(files);
    },
    deleteFile (fileToDel) {
      this.form.files = this.form.files.filter(file => file !== fileToDel);
    },
    highlightFileInput () {
      this.$refs.inputFileBox.classList.add('highlight');
      console.log('worked');
    },
    unHighlightFileInput () {
      this.$refs.inputFileBox.classList.remove('highlight');
    },
  },
  mounted () {
    this.ll = ll;
    const prevent = ev => {
      ev.stopPropagation();
      ev.preventDefault();
    };
    const fileInputObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            this.$refs.inputFileBox.addEventListener(eventName, prevent, false);
          });
          ['dragenter', 'dragover'].forEach(eventName => {
            this.$refs.inputFileBox.addEventListener(eventName, () => this.highlightFileInput(), false);
          });
          ['dragleave', 'drop'].forEach(eventName => {
            this.$refs.inputFileBox.addEventListener(eventName, () => this.unHighlightFileInput(), false);
          });
          this.$refs.inputFileBox.addEventListener('drop', ev => this.changeFileInput(ev.dataTransfer.files), false);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 1 });
    fileInputObserver.observe(this.$refs.inputFileBox);
  },
  filters: {
    filterLength (val, len) {
      if (val.length <= len) return val;
      const re = /\.[^/.]+$/;
      const ext = val.search(re) ? val.match(re) : '';
      return `${val.slice(0, len - ext.length - 2)}..${ext}`;
    },
  },
});
