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
var SRC_STYLUS = SRC_PATH + 'stylus/';
var SRC_JS = SRC_PATH + 'js/';
var GLOB_UNBUILD = '!' + SRC_PATH + '**/_**';
var GLOB_JADE = SRC_JADE + '**/*.jade';
var GLOB_STYLUS = SRC_STYLUS + '**/*.styl';
var GLOB_CSS = SRC_STYLUS + '**/*.css';
var GLOB_JS = SRC_JS + '**/*.js';
var GLOB_CONFIG = CONFIG_PATH + '**/*';

var gulp = require('gulp');
var plumber = require('gulp-plumber');
var jade = require('gulp-jade');
var watch = require('gulp-watch');
var webserver = require('gulp-webserver');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var babelify = require('babelify');
var gulpif = require('gulp-if');
var gulpIgnore = require('gulp-ignore');
var stylus = require('gulp-stylus');

var config = {
  site: require(CONFIG_PATH + 'site.js'),
  jsCopy: require(CONFIG_PATH + 'js-copy.js'),
  browserify: require(CONFIG_PATH + 'browserify.js'),
};

if (gutil.env.port) PORT = gutil.env.port;


// $ gulp --develop でjs,cssをminifyしない
// $ gulp --port 0000 でport指定


// tasks
gulp.task('default',['build', 'server', 'watch']);
gulp.task('build', ['html', 'css', 'js']);
gulp.task('html', ['jade']);
gulp.task('css', ['stylus']);
gulp.task('js', ['browserify', 'js-copy']);

gulp.task('watch',function(){
  // gulp.watch(['./src/jade/*.jade','./src/jade/**/*.jade','./src/jade/**/_*.jade'],['jade']);
  watch(GLOB_JADE,function(){
    gulp.start('jade');
  });
  watch(GLOB_JS,function(){
    gulp.start('js');
  });
  watch([GLOB_STYLUS, GLOB_CSS],function(){
    gulp.start('stylus');
  });
});

gulp.task('server',function(){
  gulp.src(HTTP_PATH)
    .pipe(webserver({
      // directoryListing: true,
      host: '0.0.0.0',
      port: PORT,
      fallback: FALLBACK,
    })
  );
});

gulp.task('jade',function(){
  gulp.src([GLOB_JADE, GLOB_UNBUILD])
    .pipe(plumber())
    .pipe(jade({
      locals: config.site,
      pretty: true
    }))
    .pipe(rename(function(path){
      if (!!path.basename.match(/^_/)) { // ex. _hoge.jade -> hoge.html
        path.basename = path.basename.replace(/^_/, '');
        return;
      }
      if (path.basename != 'index') { // ex. hoge.jade -> hoge/index.html
        path.dirname += '/' + path.basename.replace(/__/, '/'); // ex. hoge__fuga -> hoge/fuga
        path.basename = 'index';
      }
    }))
    .pipe(gulp.dest(DEST_HTML));
});

gulp.task('stylus', function () {
  gulp.src([GLOB_STYLUS, GLOB_CSS, GLOB_UNBUILD])
    .pipe(plumber())
    .pipe(stylus({
      compress: true
    }))
    .pipe(gulp.dest(DEST_CSS));
});

gulp.task('js-copy',function(){
  gulp.src(config.jsCopy.files)
    .pipe(plumber())
    .pipe(gulpif(!gutil.env.develop, uglify({preserveComments: 'some'}))) // developモードではminifyしない
    .pipe(gulp.dest(DEST_JS));
});

gulp.task('browserify',function(){
  browserify({
    entries: config.browserify.entries,
  })
  .transform(babelify, { presets: ['es2015'] })
  .bundle()
  .pipe(source(config.browserify.dest))
  .pipe(gulp.dest(DEST_JS));
});
