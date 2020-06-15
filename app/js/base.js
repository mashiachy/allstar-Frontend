

const adaptiveMixin = {
  computed: {
    isTab: () => document.documentElement.clientWidth >= 768,
    isDesktop: () => document.documentElement.clientWidth >= 1280,
  },
};

function promiseModInit () {
  const promise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const callback = () => {
      script.removeEventListener('load', callback);
      resolve(script);
    };
    script.addEventListener('load', callback);
    script.src = 'js/modernizr-custom.js';
    script.defer = true;
    document.head.appendChild(script);
  });
  promise.then(() => Modernizr.on("webp", n => document.body.classList.add(n ? "webp" : "no-webp")));
  return promise;
}

const menuMixin = {
  data () {
    return {
      activeMenu: false,
    };
  },
  methods: {
    changeParentMenu (ev) {
      if (this.isDesktop) ev.target.classList.toggle('active');
    },
    clickParentMenu (ev) {
      if (!this.isDesktop) ev.target.parentElement.classList.toggle('active');
    },
    changeSubMenuImage (ev) {
      if (this.isDesktop) {
        this.setNavPicture(ev.target);
      }
    },
    clickLang (ev) {
      if (!this.isDesktop) ev.target.classList.toggle('shared');
    },
    changeLang (ev) {
      if (this.isDesktop) ev.target.classList.toggle('shared');
    },
    setNavPicture (item) {
      const imageSrc = item.getElementsByTagName('a')[0].getAttribute('data-image-src');
      const imageAlt = item.getElementsByTagName('a')[0].getAttribute('data-alt');
      const pictureEl = item.parentElement.getElementsByTagName('picture')[0];
      pictureEl.getElementsByTagName('source')[0].setAttribute('srcset', imageSrc+'.webp');
      pictureEl.getElementsByTagName('source')[1].setAttribute('srcset', imageSrc+'.jpg');
      pictureEl.getElementsByTagName('img')[0].setAttribute('src', imageSrc+'.jpg');
      pictureEl.getElementsByTagName('img')[0].setAttribute('alt', imageAlt);
    },
  },
  watch: {
    activeMenu: function (val) {
      if (!this.isDesktop) {
        document.documentElement.style.overflowY = val ? 'hidden' : 'auto';
        document.body.style.overflowY = val ? 'hidden' : 'auto';
      }
    }
  },
};

const listingsMixin = {
  data () {
    return {
      siemaCatalog: {
        duration: 200,
        easing: 'ease-out',
        perPage: {
          320: 2,
          446: 3,
          768: 4,
        },
        startIndex: 0,
        loop: true,
        draggable: true,
        multipleDrag: true,
        threshold: 20,
      },
    };
  },
  methods: {
    initFoo (type) {
      let s = this.$refs;
      if (type === 'clients') {
        s = s.siemaClients;
      } else if (type === 'company') {
        s = s.siemaCompany;
      } else if (type === 'rent') {
        s = s.siemaRent;
      } else if (type === 'sale') {
        s = s.siemaSale;
      } else if (type === 'testimonial') {
        s = s.siemaTestimonials;
      }
      s.$el.classList.add('active');
    },
  },
};

const weCanMixin = {
  methods: {
    clickService (ev) {
      if (!this.isDesktop) {
        let parent = ev.target;
        if (!parent.classList.contains('service-card'))
          parent = parent.parentElement;
        parent.classList.toggle('service-card_high');
      }
    },
    changeService (ev) {
      if (this.isDesktop) {
        ev.target.classList.toggle('service-card_high');
      }
    },
  },
};

const filterMixin = {
  data () {
    return {
      options: false,
      searchCode: '',
      apartment: 'Apartment 1',
      pricePerMonth: {
        start: 5000,
        end: 15000,
      },
      bedroom: '1 Bedroom',
      size: {
        start: 150,
        end: 200,
      },
      district: '1 District',
      pricePerSqm: {
        start: 500,
        end: 1500,
      },
      floor: {
        start: 2,
        end: 3,
      },
      checkboxList1: [true, false, true, false, true, false],
      district1: '1 District',
      pricePerSqm1: {
        start: 500,
        end: 1500,
      },
      floor1: {
        start: 2,
      },
      checkboxList2: [true, false, true, false, true, false],
    };
  },
  watch: {
    options: function (val) {
      if (!this.isDesktop) {
        document.documentElement.style.overflowY = val ? 'hidden' : 'auto';
        document.body.style.overflowY = val ? 'hidden' : 'auto';
      }
    },
  },
};

const loadMap = function (windowHandler='') {
  const mapApiKey = 'AIzaSyBkwiSd65qwsenm1JUS7sE1Y7ua1jZ85ko';
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const callback = () => {
      script.removeEventListener('load', callback);
      resolve(script);
    };
    script.addEventListener('load', callback);
    script.src = `https://maps.googleapis.com/maps/api/js?key=${mapApiKey}${windowHandler !== '' ? '&callback='+windowHandler : ''}`;
    script.async = true;
    document.head.appendChild(script);
  });
};

export {
  adaptiveMixin,
  promiseModInit,
  menuMixin,
  filterMixin,
  listingsMixin,
  loadMap,
  weCanMixin,
};