const localPackage = require('./package.json');
const log = require('console-emoji');
log(`:sparkles: Starting Biotope Build (v${localPackage.version}) with :sparkling_heart:for Frontend Developers around the world :sparkles:\n`, 'green');

// gulp.task('serve', function(done) {
//   console.log('Hello world!');
//   done();
// });

var Undertaker = require('undertaker');
var BiotopeRegistry = require('./lib/biotope-registry');

var gulp = new Undertaker(BiotopeRegistry);


const runSequence = require('./lib/run-sequence');
const requireDir = require('require-dir');
requireDir('./tasks', {recurse: true});


// Prevent errors caused by too many listeners in gulp-watch
require('events').EventEmitter.defaultMaxListeners = 0;

// build templates for development
gulp.task('build:dev', function (callback) {
  runSequence(gulp,
    'checkDependencies',
    [
      'clean:dev',
      'clean:iconfont'
    ],
    [
      'lint:resources:sass',
      'lint:components:sass',
      'lint:json',
      'eslint:resources',
      'eslint:components',
      'iconfont',
      'copy:dev:npm:js',
      'copy:dev:npm:css',
      'copy:dev:npm:bower',
      'init:hb2'
    ],
    [
      'handlebars'
    ],
    [
      'static:hb2'
    ],
    [
      'resources:sass',
      'components:sass',
      'webpack:ts',
      'copy:dev:components:js'
    ],
    [
      'modernizr',
      'htmlhint'
    ],
    callback
  );
});


// build templates for production
gulp.task('build', function (callback) {
  runSequence(gulp
    [
      'clean:dist',
      'build:dev'
    ],
  [
    'copy:dev:js'
  ],
  [
    'copy:dist:js',
    'copy:dist:react',
    'copy:dist:ts',
    'copy:dist:flash',
    'copy:dist:json',
    'copy:dist:fonts',
    'copy:dist:resources:img',
    'copy:dist:components:img',
    'copy:dist:assets',
    'copy:dist:css',
    'copy:dist:mock',
    'copy:dist:component:mock',
    'copy:dist:config',
    'copy:dist:hbs',
    'copy:dist:bower',
    'copy:dist:components'
  ],
  [
    'useref'
  ],
  [
    'useref:assets',
    'image:resources:dist',
    'image:component:dist',
    'favicons'
  ],
  [
    'uglify:resources:dist',
    'uglify:components:dist',
    'cleanCss:resources:dist',
    'cleanCss:components:dist'
  ],
  [
    'inject',
    'clean:useref',
    'cssstats',
    'version'
  ],
  callback
  );
});


// serve development templates
gulp.task('serve', function (callback) {
  runSequence(gulp,
    'build:dev',
    [
      'watch:templates:hb2',
      'watch:partials:hb2',
      'watch:jsons:hb2',
      'watch:icons:hb2',
      'watch:components:js',
      'watch:components:sass',
      'watch:resources:sass',
      'watch:eslint:components',
      'watch:eslint:resources',
      'watch:handlebars',
      'watch:json',
      'watch:html',
      'watch:webpack:ts',
      'watch:icons'
    ],
    'connect',
    'connect:open',
    callback
  );
});


// serve production templates
gulp.task('serve:dist', function (callback) {
  runSequence(gulp,
    'build',
    callback
  );
});

// configure default task
gulp.task('default', gulp.series('serve'));




module.exports = BiotopeRegistry;




// module.exports = gulp.tasks;
