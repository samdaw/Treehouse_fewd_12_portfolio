// Gulp.js configuration
var
  // modules
  gulp = require('gulp'),
  newer = require('gulp-newer'),
  imagemin = require('gulp-imagemin'),
  htmlclean = require('gulp-htmlclean'),
  htmlmin = require('gulp-htmlmin'),
  concat = require('gulp-concat'),
  deporder = require('gulp-deporder'),
  stripdebug = require('gulp-strip-debug'),
  uglify = require('gulp-uglify'),
  sass = require('gulp-sass'),
  cleanCSS = require('gulp-clean-css'),
  postcss = require('gulp-postcss'),
  assets = require('postcss-assets'),
  autoprefixer = require('autoprefixer'),
  mqpacker = require('css-mqpacker'),
  cssnano = require('cssnano'),

  // development mode?
  devBuild = (process.env.NODE_ENV !== 'production'),

  // folders
  folder = {
    src: '',
    build: 'dist/'
  }
;

// image processing
gulp.task('images', function() {
  var out = folder.build + 'img/';
  return gulp.src(folder.src + 'img/**/*')
    .pipe(newer(out))
    .pipe(imagemin({ optimizationLevel: 5 }))
    .pipe(gulp.dest(out));
});


gulp.task('html', ['images'], function() {
  var
    out = folder.build,
    page = gulp.src(folder.src + 'html/**/*')
      .pipe(newer(out));

  // minify production code
  if (!devBuild) {
    page = page.pipe(htmlclean());
  }
  return page.pipe(gulp.dest(out));
});


// JavaScript processing
gulp.task('js', function() {
  var jsbuild = gulp.src(folder.src + 'js/**/*')
    .pipe(deporder())
    .pipe(concat('app.js'));
  if (!devBuild) {
    jsbuild = jsbuild
      .pipe(stripdebug());
      // .pipe(uglify());
  }
  return jsbuild.pipe(gulp.dest(folder.build + 'js/'));
});


// CSS processing
gulp.task('css', ['images'], function() {
  var postCssOpts = [
  assets({ loadPaths: ['images/'] }),
  autoprefixer({ browsers: ['last 2 versions', '> 2%'] }),
  mqpacker
  ];
  if (!devBuild) {
    postCssOpts.push(cssnano);
  }
  return gulp.src(folder.src + 'scss/application.scss')
    .pipe(sass({
      outputStyle: 'nested',
      imagePath: 'img/',
      precision: 3,
      errLogToConsole: true
    }))
    .pipe(postcss(postCssOpts))
    .pipe(gulp.dest(folder.build + 'css/'));
});


// run all tasks
gulp.task('run', ['html', 'css', 'js']);


// watch for changes
gulp.task('watch', function() {
  gulp.watch(folder.src + 'img/**/*', ['images']);
  gulp.watch(folder.src + 'html/**/*', ['html']);
  gulp.watch(folder.src + 'js/**/*', ['js']);
  gulp.watch(folder.src + 'scss/**/*', ['css']);
});


// default task
gulp.task('default', ['run', 'watch']);