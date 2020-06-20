'use strict';

const gulp = require('gulp'),
      browserSync = require('browser-sync').create(),
      sass = require('gulp-sass'),
      autoprefixer = require('gulp-autoprefixer'),
      pug = require('gulp-pug'),
      beaty = require('gulp-html-beautify'),
      uglify = require('gulp-uglify-es').default,
      sourcemap = require('gulp-sourcemaps'),
      webpcss = require('gulp-webpcss'),
      argv = require('yargs').argv,
      gulpif = require('gulp-if'),
      shell = require('gulp-shell'),
      rename = require('gulp-rename'),
      createFile = require('create-file'),
      concat = require('gulp-concat'),
      purgecss = require('gulp-purgecss');

const name = argv.name;

gulp.task('js-bundle', shell.task(`node_modules\\.bin\\rollup app\\js\\${name}.js -c`));

gulp.task('js', gulp.series('js-bundle', () => {
  return gulp.src('app/js/bundle.js')
    .pipe(rename(`${name}.js`))
    .pipe(sourcemap.init({ loadMaps: true }))
    .pipe(gulpif(argv.production, uglify()))
    .pipe(sourcemap.write('./'))
    .pipe(gulp.dest('dist/js'));
}));

gulp.task('js-watch', gulp.series('js', done => {
  browserSync.reload();
  done();
}));

const sassGlob = require('gulp-sass-glob');

const whitelistPtrs = {
  'home': [/appearance/, /vs/, /service-card/, /lang/, /animation/,],
  '404': [/appearance/, /footer/, /lang/],
  'mail': [],
  'a4': [],
  'text_page': [/appearance/, /vs/, /service-card/, /lang/, /filter/],
  'useful_information': [/appearance/, /vs/, /service-card/, /lang/, /filter/],
  'category': [/appearance/, /vs/, /service-card/, /lang/, /we-can/, /marker/, /info-window/, /map-control/, /map-card/],
  'category_more': [/appearance/, /vs/, /service-card/, /lang/, /map-control/,],
  'application': [/appearance/, /vs/, /service-card/, /lang/, /highlight/,],
  'contacts': [/appearance/, /vs/, /service-card/, /lang/,],
};

gulp.task('sass',  () => {
  return gulp.src(['app/styles/base.sass', `app/styles/${name}.sass`])
    .pipe(sassGlob({
      ignorePaths: [
        'mixins.sass'
      ],
    }))
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(concat(`${name}.css`))
    .pipe(gulpif(argv.production, purgecss({
      content: [`dist/${name}.html`],
      whitelistPatternsChildren: Object.getOwnPropertyDescriptor(whitelistPtrs, name).value,
    })))
    .pipe(autoprefixer({
      browsers: ['last 20 versions'],
      cascade: false,
    }))
    .pipe(webpcss({
      baseClass: '.webp',
      replace_from: /\.(png|jpg|jpeg)/,
      replace_to: '.webp',
    }))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});

gulp.task('pug', () => {
  return gulp.src([`app/views/${name}.pug`, '!app/views/mixins.pug'])
    .pipe(pug())
    .pipe(gulpif(!argv.production, beaty()))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
});

gulp.task('fonts', () => {
  return gulp.src('app/fonts/*.ttf')
    .pipe(gulp.dest('dist/css/fonts'))
    .pipe(browserSync.stream());
});

const webp = require('gulp-webp');

gulp.task('images', () => {
  return gulp.src('app/img/*.+(png|jpeg|jpg|tiff)')
    .pipe(webp())
    .pipe(gulp.dest('dist/img'))
    .pipe(browserSync.stream());
});

gulp.task('media', () => {
  return gulp.src('app/img/*')
    .pipe(gulp.dest('dist/img'))
    .pipe(browserSync.stream());
});

gulp.task('default', () => {
  gulp.watch([`app/views/${name}.pug`, 'app/views/mixins.pug'], gulp.series('pug'));
  gulp.watch(['app/styles/base.sass', 'app/styles/_mixins.sass', `app/styles/${name}.sass`], gulp.series('sass'));
  gulp.watch('app/fonts/*.ttf', gulp.series('fonts'));
  gulp.watch("app/img/*", gulp.series('images', 'media'));
  gulp.watch([`app/js/${name}.js`, 'app/js/base.js'], gulp.series('js-watch'));
  gulp.watch('dist/*.html',	browserSync.reload);
  gulp.watch('dist/img/*',	browserSync.reload);
  gulp.watch('dist/css/*.css',	browserSync.reload);
  gulp.watch('dist/js/*.js',	browserSync.reload);
  browserSync.init({
    server:  {
      baseDir: './dist',
      index: name+'.html',
    },
  });
});

gulp.task('build', gulp.series('js', 'sass', 'pug', 'images', 'media', 'default'));

gulp.task('new-page', (done) => {
  createFile(`app/views/${name}.pug`,
    'include mixins\n\n' +
    'doctype html\n' +
    'html(lang="us")\n' +
    '  head\n' +
    '    meta(charset="utf-8")\n' +
    '    meta(http-equiv="X-UA-Compatible" content="IE=edge")\n' +
    '    meta(name="viewport" content="width=device-width, initial-scale=1")\n' +
    '    meta(name="robots" content="noindex, nofollow")\n' +
    `    title AllStars | ${name}\n` +
    '    link(rel="preload" href="css/fonts/Roboto-Regular.ttf" as="font" crossorigin="anonymous")\n' +
    '    link(rel="preload" href="css/fonts/Roboto-Medium.ttf" as="font" crossorigin="anonymous")\n' +
    '    link(rel="preload" href="css/fonts/Roboto-Bold.ttf" as="font" crossorigin="anonymous")\n' +
    '    link(rel="preload" href="css/fonts/Roboto-Black.ttf" as="font" crossorigin="anonymous")\n' +
    `    link(rel="preload" href="css/${name}.css" as="style")\n` +
    `    link(rel="preload" href="js/${name}.js" as="script")\n` +
    `    link(href="css/${name}.css" rel="stylesheet")\n` +
    '    script.\n' +
    '      window.addEventListener("load",()=>document.querySelectorAll("[data-lazy]").forEach(d=>d.classList.add("loaded")));\n' +
    '  body\n\n\n' +
    `    script(src="js/${name}.js")`,
    console.log);
  createFile(`app/styles/${name}.sass`,
    '@import "mixins"',
    console.log);
  createFile(`app/js/${name}.js`,
    'import Vue from \'vue\';\n' +
    'import vSelect from \'vue-select\';\n' +
    'import Siema from \'vue2-siema\';\n' +
    'import {adaptiveMixin, promiseModInit} from "./base";\n' +
    '\n' +
    'const promiseMod = promiseModInit();',
    console.log);
  done();
});