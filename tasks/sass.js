const gulp = require('gulp');
const config = require('./../config');

gulp.task('resources:sass', function () {
  if (config.global.tasks.sass) {
    const sass = require('gulp-sass');
    const path = require('path');
    const postcss = require('gulp-postcss');
    const autoprefixer = require('autoprefixer');
    const sourcemaps = require('gulp-sourcemaps');

    return gulp
      .src(path.join(
        config.global.cwd,
        config.global.src,
        config.global.resources,
        'scss',
        '**',
        '+(index|index.*).scss'
      ))
      .pipe(sourcemaps.init())
      .pipe(sass(config.sass).on('error', sass.logError))
      .pipe(postcss([autoprefixer(config.autoprefixer)]))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(
        path.join(
          config.global.cwd,
          config.global.dev,
          config.global.resources,
          'css'
        )
      ));
  } else {
    const colors = require('colors/safe');
    console.log(colors.yellow('sass resources disabled'));
  }
});

gulp.task('components:sass', function () {
  if (config.global.tasks.sass) {
    const sass = require('gulp-sass');
    const path = require('path');
    const postcss = require('gulp-postcss');
    const autoprefixer = require('autoprefixer');
    const sourcemaps = require('gulp-sourcemaps');

    return gulp
      .src(path.join(
        config.global.cwd,
        config.global.src,
        config.global.components,
        '**',
        '+(index|index.*).scss'
      ))
      .pipe(sourcemaps.init())
      .pipe(sass(config.sass).on('error', sass.logError))
      .pipe(postcss([
        autoprefixer(config.autoprefixer)
      ]))
      .pipe(sourcemaps.write('.'))
      .pipe(
        gulp.dest(
          path.join(
            config.global.cwd,
            config.global.dev,
            config.global.resources,
            config.global.components,
            'css'
          )
        )
      );
  } else {
    const colors = require('colors/safe');
    console.log(colors.yellow('sass components disabled'));
  }
});

gulp.task('lint:sass', function () {
  if (config.global.tasks.sass && config.global.tasks.linting && false) {
    const sassLint = require('gulp-sass-lint');
    const cached = require('gulp-cached');
    const path = require('path');

    return gulp
      .src([
        path.join(config.global.cwd, config.global.src, config.global.resources, 'scss', '**', '*.s+(a|c)ss'),
        path.join(config.global.cwd, config.global.src, config.global.components, '**', '*.s+(a|c)ss')
      ])
      .pipe(cached('sass', {optimizeMemory: true}))
      .pipe(sassLint(config.global.sassLint))
      .pipe(sassLint.format())
      .pipe(sassLint.failOnError());
  }
});

gulp.task('watch:sass', function () {
  if (config.global.tasks.sass) {
    const watch = require('gulp-watch');
    const runSequence = require('run-sequence');
    const path = require('path');

    watch(
      [
        path.join(config.global.cwd, config.global.src, config.global.resources, 'scss', '**', '*.scss'),
        path.join(config.global.cwd, config.global.src, config.global.components, '**', '*.scss'),
        path.join(config.global.cwd, '.iconfont', '*.scss')
      ],
      config.watch,
      () => {
        runSequence(
          [
            'lint:components:sass',
            'lint:resources:sass'
          ],
          [
            'resources:sass',
            'components:sass'
          ],
          'livereload'
        );
      }
    );
  }
});
