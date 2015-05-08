var BatchStream = require('batch-stream2')
var gulp = require('gulp')
var uglify = require('gulp-uglify')
var cssmin = require('gulp-minify-css')
var mainBowerFiles = require('main-bower-files')
var livereload = require('gulp-livereload')
var include = require('gulp-include')
var concat = require('gulp-concat')
var browserify = require('gulp-browserify')
var gulpFilter = require('gulp-filter')
var watch = require('gulp-watch')
var rename = require('gulp-rename')
var minifyCss   =  require('gulp-minify-css');
var clean       = require('gulp-clean');
var minifyHTML  =  require('gulp-minify-html');
var connect     = require('gulp-connect');
 
var src = {
  css: ['./app/styles/*.css'],
  scripts: ['./app/scripts/**/*.js'],
  bower: ['bower.json', '.bowerrc']
}
 
var distdir = 'dist'

var dist = {
  all: [distdir + '/**/*'],
  css: distdir + '/styles/',
  js: distdir + '/scripts/',
  vendor: distdir + '/vendor/'
}
 
gulp.task('bower', function() {
    return gulp.src(mainBowerFiles())
      .pipe(gulp.dest(dist.vendor))
});

gulp.task('css', function() {
  return gulp.src(src.css)
    .pipe(cssmin())
    .pipe(concat('app.css'))
    .pipe(gulp.dest(dist.css))
})
gulp.task('js', function() {
  return gulp.src(src.scripts)
    .pipe(include())
    .pipe(browserify({
      insertGlobals: true,
      debug: true
    }))
    .pipe(uglify())
    .pipe(concat('app.js'))
    .pipe(gulp.dest(dist.js))
})

gulp.task('html', function() {
  var opts = {
    conditionals: true,
    spare:true
  };
  return gulp.src('./app/dist.html')
    .pipe(minifyHTML(opts))
    .pipe(rename('index.html'))
    .pipe(gulp.dest('./' + distdir));
});
 
gulp.task('minify-html', function() {
  var opts = {
    conditionals: true,
    spare:true
  };
  return gulp.src('./app/views/**/*.html')
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest('./' + distdir + '/views'));
});

gulp.task('watch', function() {
  gulp.watch(src.bower, ['bower'])
  watch({ glob: src.styles, name: 'app.css' }, buildCSS)
  watch({ glob: src.scripts, name: 'app.js' }, buildJS)
})

// live reload can emit changes only when at lease one build is done
gulp.task('livereload', ['bower', 'css', 'js', 'watch'], function() {
  var server = livereload()
  var batch = new BatchStream({ timeout: 100 })
  gulp.watch(dist.all).on('change', function change(file) {
    // clear directories
    var urlpath = file.path.replace(__dirname + '/' + distdir, '')
    // also clear the tailing index.html
    urlpath = urlpath.replace('/index.html', '/')
    batch.write(urlpath)
  })
  batch.on('data', function(files) {
    server.changed(files.join(','))
  })
})

gulp.task('clean', function () {
    return gulp.src(distdir, {read: false})
        .pipe(clean({force: true}));
});
 
gulp.task('connect', function() {
  connect.server({
    root: 'dist',
    livereload: true
  });
});

gulp.task('compress', ['css', 'js'])
 
gulp.task('default', ['bower', 'css', 'js', 'livereload']) // development
gulp.task('build', ['bower', 'compress', 'html', 'minify-html']) // build for production

