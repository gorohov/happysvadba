var gulp = require('gulp'),
    watch = require('gulp-watch'),
    browserSync = require("browser-sync"),
    prefixer = require('gulp-autoprefixer'),
    stylus = require('gulp-stylus'),
    pug = require('gulp-pug'),
    cleancss = require('gulp-clean-css'),
    notify = require("gulp-notify"),
    cache = require('gulp-cached'),
    reload = browserSync.reload,
    del = require('del'),
    sourcemaps = require('gulp-sourcemaps');

  var path = {
    build: {
      html: 'dist/',
      css: 'dist/css/'
    },
    src: {
      html: 'src/*.pug',
      style: 'src/main.styl'
    },
    watch: {
      html: 'src/**/*.pug',
      style: 'src/**/*.styl'
    }
  };

  var config = {
    server: {
      baseDir: "./dist"
    },
    tunnel: false,
    host: 'localhost',
    port: 9000,
    logPrefix: "Building::"
  };

  gulp.task('html:build', function () {
    var YOUR_LOCALS = {};
    gulp.src(path.src.html)
      .pipe(cache('jading...'))
      .pipe(pug({locals: YOUR_LOCALS, pretty: true}))
      .on('error', notify.onError(function (err) {
        return {
          title: 'pug',
          message: err.message
        };
      }))
      .pipe(gulp.dest(path.build.html))
      .pipe(reload({stream: true}));
  });

  gulp.task('style:build', function () {
    gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(stylus({'include css': true}))
        .on('error', notify.onError(function (err) {
            return {
                title: 'Stylus',
                message: err.message
            };
        }))
        .pipe(prefixer({
            browsers: ['last 4 versions','> 1%','Android 4.4','ios_saf >=7']
        }))
        .pipe(cleancss())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
  });

  gulp.task('clean:dist', function () {
  return del([
    'dist/css/**/*',
    'dist/js/**/*',
    'dist/*.html'
  ]);
});

  gulp.task('build', [
    'clean:dist',
    'html:build',
    'style:build'
  ]);

  gulp.task('watch', function () {
    watch([path.watch.html], function (event, cb) {
      gulp.start('html:build');
    });
    watch([path.watch.style], function (event, cb) {
      gulp.start('style:build');
    });
  });

  gulp.task('webserver', function () {
    browserSync(config);
  });

  gulp.task('default', ['build', 'webserver', 'watch']);