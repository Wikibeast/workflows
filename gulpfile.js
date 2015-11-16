var gulp = require('gulp'),
	gutil = require('gulp-util'),
	coffee = require('gulp-coffee'),
	browserify = require('gulp-browserify'),
	compass = require('gulp-compass'),
	connect = require('gulp-connect'),
	concat = require('gulp-concat');

var coffeeSources = ['components/coffee/tagline.coffee'];			//use an array variable just 
																	//in case you want to add more later
var jsSources = [
	'components/scripts/rclick.js',
	'components/scripts/pixgrid.js',
	'components/scripts/tagline.js',
	'components/scripts/template.js'
];
var sassSources = ['components/sass/style.scss'];			//note that this is the 
														//only necessary sass file because the 
														//partials are imported here

gulp.task('coffee', function() {
	gulp.src(coffeeSources)
		.pipe(coffee({ bare: true })
			.on('error', gutil.log))
		.pipe(gulp.dest('components/scripts'))
});

gulp.task('js', function() {
	gulp.src(jsSources)
		.pipe(concat('script.js'))
		.pipe(browserify())
		.pipe(gulp.dest('builds/development/js'))
		.pipe(connect.reload())							//reload the gulp-connect server
});

gulp.task('compass', function() {
	gulp.src(sassSources)
		.pipe(compass({									//put all your Sass config here instead of in a file
			sass: 'components/sass',
			image: 'builds/development/images',
			style: 'expanded'							//add 'require' setting for imports like Bourbon or Susy
		}))
		.on('error', gutil.log)
		.pipe(gulp.dest('builds/development/css'))
		.pipe(connect.reload())							//reload the gulp-connect server
});

gulp.task('watch', function() {
	gulp.watch(coffeeSources, ['coffee'])
	gulp.watch(jsSources, ['js'])
	gulp.watch('components/sass/*.scss', ['compass'])
});

gulp.task('connect', function() {
	connect.server({
		root: 'builds/development/',
		livereload: true
	});
});

gulp.task('default', ['coffee', 'js', 'compass', 'connect', 'watch']);