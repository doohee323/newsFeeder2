var gulp        =  require('gulp'),
		clean       = require('gulp-clean'),
		connect     = require('gulp-connect'),
    gutil       =  require('gulp-util'),
    concat      =  require('gulp-concat'),
    jshint      = require('gulp-jshint'),
    stylish     = require('jshint-stylish'),
    bower       = require('gulp-bower'),
    minifyCss   =  require('gulp-minify-css'),
    htmlmin     =  require('gulp-minify-html'),
    uglify      =  require('gulp-uglify'),
    streamify   =  require('gulp-streamify'),
    browserify  =  require('gulp-browserify'),
    source      =  require('vinyl-source-stream'),
    transform   = require('vinyl-transform'),
    rename      =  require('gulp-rename'),
    minifyHTML  = require('gulp-minify-html');
 
var appdir =  './app/';
var distdir = './dist/';
var appstatic = appdir;
var bowerdir = './bower_components';
 
var cssfiles = [
		'./bower_components/bootstrap/dist/css/bootstrap.css',
		appdir + 'styles/*.css',
	];
 
var jsfiles = [
		appdir + 'scripts/**/*.js',
	];
 
var vendorfiles = [
		'./bower_components/**/*.js'
	];
 
var staticfiles = [
		appstatic + 'scripts/**/*.js',
		appstatic + 'favicon.ico',
	];
 
gulp.task('clean', function () {
    return gulp.src(distdir, {read: false})
        .pipe(clean({force: true}));
});
 
gulp.task('lint', function() {
  return gulp.src(jsfiles)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});
 
// Concatenate & Minify JS
gulp.task('browserify', function () {
  return gulp.src(jsfiles)
//	 .pipe(concat('main.js'))
   .pipe(browserify())
   .pipe(uglify())
   .pipe(gulp.dest(distdir + 'scripts'));
});

gulp.task('vendor', function(){
	return gulp.src(vendorfiles)
		.pipe(concat('vendor.js'))
		.pipe(uglify())
		.pipe(gulp.dest(distdir + 'scripts'));
});
 
gulp.task('html', function() {
  var opts = {
    conditionals: true,
    spare:true
  };
 
  return gulp.src('./app/dist.html')
    .pipe(minifyHTML(opts))
    .pipe(rename('index.html'))
    .pipe(gulp.dest(distdir));
});
 
gulp.task('minify-html', function() {
  var opts = {
    conditionals: true,
    spare:true
  };
 
  return gulp.src('./app/views/**/*.html')
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest(distdir + 'views'));
});
 
gulp.task('bower', function(){
	return bower()
		.pipe(gulp.dest(distdir));
});

gulp.task('copy', function(){
	return gulp.src(staticfiles, { base: appstatic })
		.pipe(gulp.dest(distdir));
});

gulp.task('minify-css', function() {
  return gulp.src(cssfiles)
  	.pipe(concat('main.css'))
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(gulp.dest(distdir + 'styles'));
});
 
gulp.task('connect', function() {
  connect.server({
    root: 'dist',
    livereload: true
  });
});

gulp.task('watch', function() {
    gulp.watch( cssfiles, ['./app/*.html'], ['html'] );
});

gulp.task('build', ['minify-css', 'html', 'minify-html', 'vendor', 'copy', 'browserify']);
gulp.task('default', ['minify-css', 'html', 'minify-html', 'vendor', 'copy', 'browserify', 'watch']);



