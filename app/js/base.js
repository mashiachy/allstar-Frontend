function webpSupported () {
  const elem = document.createElement('canvas');
  if (!!(elem.getContext && elem.getContext('2d'))) {
    return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }
  return false;
}

let isWebp = null;

function webpInit () {
  isWebp = webpSupported();
  const handler = () => document.body.classList.add(isWebp ? 'webp' : 'no-webp');
  document.readyState === 'interactive' || document.readyState === 'complete' ? handler() :
    window.addEventListener('DOMContentLoaded', handler, {passive: true});
}

const screen = window.innerWidth;

function myWOW ({selector}) {
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('appearance');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold: 1});
  const handler = () => document.querySelectorAll(selector).forEach(el => observer.observe(el));
  document.readyState === 'complete' ? handler() : window.addEventListener('load', handler, {passive: true});
  return observer;
}

function goTopInit ({selector, offset}) {
  const handler = () => {
    const ref = document.querySelector(selector);
    ref.style.top = offset;
    ref.children[0].addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  };
  document.readyState === 'interactive' || document.readyState === 'complete' ? handler() :
    window.addEventListener('load', handler, {passive: true});
}

class LazyLoader {
  constructor({selector}) {
    this.selector = selector;
    this.start();
    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (LazyLoader.showBox(entry.target))
            observer.unobserve(entry.target);
        }
      });
    }, {threshold: 0.1});
    return this;
  }
  start () {
    document.readyState === 'complete' ? this.watch() : window.addEventListener('load', this.watch.bind(this), {passive: false});
  }
  watch () {
    console.log(document.querySelectorAll(this.selector));
    document.querySelectorAll(this.selector).forEach(ref => this.observer.observe(ref));
  }
  static showBox (box) {
    box.removeAttribute('data-lazy');
    if (box.hasAttribute('data-l-pict')) {
      Array.from(box.children).forEach(child => LazyLoader.showBox(child));
      return true;
    }
    if (box.hasAttribute('data-l-back')) {
      let src = box.getAttribute('data-l-back');
      if (isWebp && src.match(/\.(png|jpg|jpeg)$/)) src = src.replace(/\.(png|jpg|jpeg)$/, '.webp');
      box.style.backgroundImage = `url("${src}")`;
      return true;
    }
    if (box.hasAttribute('data-l-src')) {
      box.setAttribute('src', box.getAttribute('data-l-src'));
      return true;
    }
    if (box.hasAttribute('data-l-srcset')) {
      box.setAttribute('srcset', box.getAttribute('data-l-srcset'));
      return true;
    }
    return false;
  }
}

const adaptiveMixin = {
  computed: {
    isSmTab: () => window.innerWidth >= 667,
    isTab: () => window.innerWidth >= 768,
    isSmDesktop: () => window.innerWidth >= 1024,
    isDesktop: () => window.innerWidth >= 1280,
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
        document.documentElement.style.overflowY = val ? 'hidden' : 'visible';
        document.body.style.overflowY = val ? 'hidden' : 'visible';
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
      const ref = this.$refs[type==='clients'?'siemaClients':type==='company'?'siemaCompany':type==='rent'?'siemaRent':type==='sale'?'siemaSale':'siemaTestimonials'].$el;
      ref.classList.add('active');
      this.ll ? this.ll.watch() : 0;
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
        document.documentElement.style.overflowY = val ? 'hidden' : 'visible';
        document.body.style.overflowY = val ? 'hidden' : 'visible';
      }
    },
  },
};

const siemaLazyInitMixin = {
  data () {
    return {
      observer: null,
    };
  },
  mounted () {
    document.querySelectorAll('[data-init]').forEach(ref => this.observer.observe(ref));
  },
  created () {
    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.$refs[entry.target.getAttribute('data-init')].init();
          observer.unobserve(entry.target);
        }
      });
    });
  },
};

const loadMap = function (windowHandler='') {
  const mapApiKey = 'AIzaSyC-ew6H1Lfrj5erNaNZT_Ktf6dAJsIsJf4';
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
  myWOW,
  goTopInit,
  isWebp,
  webpInit,
  LazyLoader,
  screen,
  siemaLazyInitMixin,
};

// TODO: weCanMixin is never used for u bb