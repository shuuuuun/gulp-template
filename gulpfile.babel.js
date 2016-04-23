'use strict';

// const
const PORT = '5353';
const FALLBACK = '404.html';

const HTTP_PATH = './public/';
const DEST_PATH = './public/';
const SRC_PATH = './src/';
const CONFIG_PATH = './config/';
const DEST_HTML = DEST_PATH;
const DEST_CSS = `${DEST_PATH}css/`;
const DEST_JS = `${DEST_PATH}js/`;
const SRC_JADE = `${SRC_PATH}jade/`;
const SRC_SASS = `${SRC_PATH}sass/`;
const SRC_JS = `${SRC_PATH}js/`;
const GLOB_UNBUILD = '!' + `${SRC_PATH}**/_**`;
const GLOB_JADE = `${SRC_JADE}**/*.jade`;
const GLOB_SASS = `${SRC_SASS}**/*.sass`;
const GLOB_SCSS = `${SRC_SASS}**/*.scss`;
const GLOB_JS = `${SRC_JS}**/*.js`;
const GLOB_CONFIG = `${CONFIG_PATH}**/*`;
const COMPASS_CONFIG_PATH = `${CONFIG_PATH}compass.rb`;

const config = {
  site: require(`${CONFIG_PATH}site.js`),
  jsCopy: require(`${CONFIG_PATH}js-copy.js`),
  browserify: require(`${CONFIG_PATH}browserify.js`),
  autoprefixer: require(`${CONFIG_PATH}autoprefixer.js`),
};


// import
import gulp from 'gulp';
import plumber from 'gulp-plumber';
import compass from 'gulp-compass';
import jade from 'gulp-jade';
import watch from 'gulp-watch';
import webserver from 'gulp-webserver';
import uglify from 'gulp-uglify';
import gutil from 'gulp-util';
import rename from 'gulp-rename';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import babelify from 'babelify';
import minifyCss from 'gulp-minify-css';
import gulpif from 'gulp-if';
import gulpIgnore from 'gulp-ignore';
import notify from 'gulp-notify';
import autoprefixer from 'gulp-autoprefixer';


// tasks
gulp.task('default',['build', 'server', 'watch']);
gulp.task('build', ['html', 'css', 'js']);
gulp.task('html', ['jade']);
gulp.task('css', ['compass']);
gulp.task('js', ['browserify', 'js-copy']);

gulp.task('watch', () => {
  // gulp.watch(['./src/jade/*.jade','./src/jade/**/*.jade','./src/jade/**/_*.jade'],['jade']);
  watch(GLOB_JADE, () => {
    gulp.start('jade');
  });
  watch(GLOB_JS, () => {
    gulp.start('js');
  });
  watch([GLOB_SASS, GLOB_SCSS], () => {
    gulp.start('compass');
  });
});

gulp.task('server', () => {
  gulp.src(HTTP_PATH)
    .pipe(webserver({
      // directoryListing: true,
      host: '0.0.0.0',
      port: (gutil.env.port || PORT),
      fallback: FALLBACK,
    })
  );
});

gulp.task('jade', () => {
  gulp.src([GLOB_JADE, GLOB_UNBUILD])
    .pipe(plumber({ errorHandler: notify.onError('<%= error.message %>') }))
    .pipe(jade({
      locals: config.site,
      pretty: true
    }))
    .pipe(rename((path) => {
      // ex. hoge.jade -> hoge.html
      // ex. hoge__.jade -> hoge/index.html
      // ex. hoge__fuga.jade -> hoge/fuga.html
      // ex. hoge__fuga__.jade -> hoge/fuga/index.html
      if (!!path.basename.match(/__$/)) {
        path.dirname += '/' + path.basename.replace(/__/g, '/');
        path.basename = 'index';
      }
      else {
        let ary = path.basename.split('__');
        let base = ary.pop();
        let dir = ary.join('/');
        path.dirname += '/' + dir;
        path.basename = base;
      }
    }))
    .pipe(gulp.dest(DEST_HTML));
});

gulp.task('compass', () => {
  gulp.src([GLOB_SASS, GLOB_SCSS, GLOB_UNBUILD])
    .pipe(plumber({ errorHandler: notify.onError('<%= error.message %>') }))
    .pipe(compass({
      config_file: COMPASS_CONFIG_PATH,
      css: DEST_CSS,
      sass: SRC_SASS,
    }))
    .pipe(autoprefixer(config.autoprefixer))
    .pipe(gulpif(!gutil.env.develop, minifyCss({ advanced: false }))) // developモードではminifyしない
    .pipe(gulp.dest(DEST_CSS))
    .pipe(notify('compass build succeeded!!'));
});

gulp.task('js-copy', () => {
  gulp.src(config.jsCopy.files)
    .pipe(plumber({ errorHandler: notify.onError('<%= error.message %>') }))
    .pipe(gulpif(!gutil.env.develop, uglify({ preserveComments: 'some' }))) // developモードではminifyしない
    .pipe(gulp.dest(DEST_JS));
});

gulp.task('browserify', () => {
  browserify({
    entries: config.browserify.entries,
  })
  .transform(babelify)
  .bundle()
  .on('error', notify.onError('<%= error.message %>'))
  .pipe(source(config.browserify.dest))
  .pipe(buffer())
  .pipe(gulpif(!gutil.env.develop, uglify({ preserveComments: 'some' }))) // developモードではminifyしない
  .pipe(gulp.dest(DEST_JS));
});
