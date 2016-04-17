'use strict';

// const
var PORT = '5353';
var FALLBACK = '404.html';

var HTTP_PATH = './public/';
var DEST_PATH = './public/';
var SRC_PATH = './src/';
var CONFIG_PATH = './config/';
var DEST_HTML = DEST_PATH;
var DEST_CSS = DEST_PATH + 'css/';
var DEST_JS = DEST_PATH + 'js/';
var SRC_JADE = SRC_PATH + 'jade/';
var SRC_SASS = SRC_PATH + 'sass/';
var SRC_JS = SRC_PATH + 'js/';
var GLOB_UNBUILD = '!' + SRC_PATH + '**/_**';
var GLOB_JADE = SRC_JADE + '**/*.jade';
var GLOB_SASS = SRC_SASS + '**/*.sass';
var GLOB_SCSS = SRC_SASS + '**/*.scss';
var GLOB_JS = SRC_JS + '**/*.js';
var GLOB_CONFIG = CONFIG_PATH + '**/*';
var COMPASS_CONFIG_PATH = CONFIG_PATH + 'compass.rb';

var config = {
  concat: require(CONFIG_PATH + 'concat.js'),
  site: require(CONFIG_PATH + 'site.js'),
  autoprefixer: require(CONFIG_PATH + 'autoprefixer.js'),
};


// import
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var compass = require('gulp-compass');
var jade = require('gulp-jade');
var watch = require('gulp-watch');
var webserver = require('gulp-webserver');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var gulpif = require('gulp-if');
var gulpIgnore = require('gulp-ignore');
var notify = require('gulp-notify');
var autoprefixer = require('gulp-autoprefixer');


// tasks
gulp.task('default',['watch', 'server', 'html', 'css', 'js']);
gulp.task('build', ['html', 'css', 'js']);
gulp.task('html', ['jade']);
gulp.task('css', ['compass']);
gulp.task('js', ['js-concat', 'js-copy']);

gulp.task('watch',function(){
  // gulp.watch(['./src/jade/*.jade','./src/jade/**/*.jade','./src/jade/**/_*.jade'],['jade']);
  watch(GLOB_JADE,function(){
    gulp.start('jade');
  });
  watch(GLOB_JS,function(){
    gulp.start('js');
  });
  watch([GLOB_SASS, GLOB_SCSS],function(){
    gulp.start('compass');
  });
});

gulp.task('server',function(){
  gulp.src(HTTP_PATH)
    .pipe(webserver({
      // directoryListing: true,
      host: '0.0.0.0',
      port: (gutil.env.port || PORT),
      fallback: FALLBACK,
    })
  );
});

gulp.task('jade',function(){
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

gulp.task('compass',function(){
  gulp.src([GLOB_SASS, GLOB_SCSS, GLOB_UNBUILD])
    .pipe(plumber({ errorHandler: notify.onError('<%= error.message %>') }))
    .pipe(compass({
      config_file: COMPASS_CONFIG_PATH,
      css: DEST_CSS,
      sass: SRC_SASS,
    }))
    .pipe(autoprefixer(config.autoprefixer))
    .pipe(gulpif(!gutil.env.develop, minifyCss({ advanced: false }))) // developモードではminifyしない
    .pipe(gulp.dest(DEST_CSS));
});

gulp.task('js-copy',function(){
  gulp.src([GLOB_JS, GLOB_UNBUILD])
    .pipe(plumber({ errorHandler: notify.onError('<%= error.message %>') }))
    .pipe(gulpIgnore.exclude(function(file){ // concatconfigにあるファイルは除く
      return config.concat.files.some(function(val){
        return (file.path.indexOf(val) >= 0);
      });
    }))
    .pipe(gulpif(!gutil.env.develop, uglify({preserveComments: 'some'}))) // developモードではminifyしない
    .pipe(gulp.dest(DEST_JS));
});

gulp.task('js-concat',function(){
  gulp.src(config.concat.files)
    .pipe(plumber({ errorHandler: notify.onError('<%= error.message %>') }))
    .pipe(concat(config.concat.dest))
    .pipe(gulpif(!gutil.env.develop, uglify({preserveComments: 'some'}))) // developモードではminifyしない
    .pipe(gulp.dest(DEST_JS));
});
