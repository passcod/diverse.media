'use strict'

let gulp = require('gulp')
let merge = require('merge-stream')
let newer = require('gulp-newer')
let notifier = require('node-notifier')
let path = require('path')
let size = require('gulp-size')
let source = require('vinyl-source-stream')
let sourcemaps = require('gulp-sourcemaps')
let util = require('gulp-util')

const imageminOpts = {
  interlaced: true,
  multipass: true,
  progressive: true
}

const icons = (function () {
  const gulpIconDir = path.join(__dirname, 'node_modules', 'gulp-notify', 'assets')
  return {
    success: path.join(gulpIconDir, 'gulp.png'),
    error: path.join(gulpIconDir, 'gulp-error.png')
  }
}())

function debug (title) {
  return process.env.DEBUG ? require('gulp-debug')({title: title}) : util.noop()
}

function errorHandler (err) {
  let strip = require('strip-ansi')
  notifier.notify({
    title: `Gulp error in plugin ${strip(err.plugin)}!`,
    message: strip(err.message),
    icon: icons.error
  })
}

function plumber () {
  return require('gulp-plumber')({errorHandler: errorHandler})
}

function copy (from, to) {
  return gulp.src(from)
    .pipe(plumber())
    .pipe(require('gulp-clean-dest')(to))
    .pipe(size({title: to}))
    .pipe(size({title: to, gzip: true}))
    .pipe(gulp.dest(to))
}

function assetsCopy () {
  return merge.apply(merge, [
    copy('build/css/*', 'public/css/'),
    copy('build/js/*', 'public/js/'),
    copy('build/maps/*', 'public/maps/'),
    copy('build/images/**', 'public/images/')
  ])
}

gulp.task('default', ['css', 'images', 'js'], assetsCopy)
gulp.task('assets.copy', assetsCopy)

let watchedTask = function (task) {
  gulp.task(`watch.${task}`, [task], function () {
    return assetsCopy()
      .pipe(util.buffer(function () {
        notifier.notify({
          title: 'Gulp done!',
          message: `Task "${task}" finished`,
          icon: icons.success
        })
      }))
  })
}

watchedTask('css')
watchedTask('default')
watchedTask('images')
watchedTask('js')

gulp.task('watch', ['default'], function () {
  gulp.watch('src/images/**', ['watch.images'])
  gulp.watch('src/css/**', ['watch.css'])
  gulp.watch('src/js/**', ['watch.js'])
  notifier.notify({
    title: 'Gulp ready!',
    message: 'Ready and watching',
    icon: icons.success
  })
})

gulp.task('watch-all', ['default'], function () {
  gulp.watch('src/**', ['watch.default'])
  notifier.notify({
    title: 'Gulp ready!',
    message: 'Ready and watching everything',
    icon: icons.success
  })
})

gulp.task('images', function () {
  return gulp.src('src/images/**')
    .pipe(plumber())
    .pipe(debug('images'))
    .pipe(newer('build/images/'))
    .pipe(require('gulp-imagemin')(imageminOpts))
    .pipe(gulp.dest('build/images/'))
})

gulp.task('css', function () {
  let postcss = require('gulp-postcss')

  return gulp.src('src/css/*')
    .pipe(plumber())
    .pipe(debug('css'))
    .pipe(sourcemaps.init())
    .pipe(postcss([
      require('postcss-import'),
      require('postcss-mixins'),
      require('postcss-for'),
      require('postcss-nested'),
      require('postcss-simple-vars'),
      require('postcss-conditionals'),
      require('postcss-quantity-queries'),
      require('lost'),
      require('cssnext')({
        browsers: ['> 1% in NZ', 'Last 2 versions'],
        compress: true
      })
    ]))
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('build/css'))
})

function makeJs (name, list, deps) {
  deps = deps || []
  let task = `js.${name}`

  gulp.task(task, deps, function () {
    return require('browserify')({
      entries: list,
      debug: true,
      transform: [
        require('envify'),
        require('babelify'),
        require('uglifyify')
      ]
    }).bundle()
      .pipe(source(`${name}.js`))
      .pipe(plumber())
      .pipe(debug(task))
      .pipe(require('vinyl-buffer')())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(sourcemaps.write('../maps'))
      .pipe(gulp.dest('build/js/'))
  })
}

makeJs('index', ['src/js/diverse.media.js'])

gulp.task('js', [
  'js.index'
])
