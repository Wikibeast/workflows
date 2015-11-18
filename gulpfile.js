var gulp = require('gulp'),
	gutil = require('gulp-util'),
	coffee = require('gulp-coffee'),
	browserify = require('gulp-browserify'),
	compass = require('gulp-compass'),
	connect = require('gulp-connect'),
	replace = require('gulp-replace'),
	gulpif = require('gulp-if'),
	uglify = require('gulp-uglify'),
	minifyHTML = require('gulp-minify-html'),
	concat = require('gulp-concat');

var env,
	sassSources,
	coffeeSources,
	jsSources,
	jsonSources,
	htmlSources,
	sassSources,
	outputDir,
	sassStyle;

env = process.env.NODE_ENV || 'development';

if (env==='development') {
	outputDir = 'builds/development/'
	sassStyle = 'expanded';
} else {
	outputDir = 'builds/production/'
	sassStyle = 'compressed';
}

coffeeSources = ['components/coffee/tagline.coffee'];//use an array variable in case you want to add		
jsSources = [
	'components/scripts/rclick.js',
	'components/scripts/pixgrid.js',
	'components/scripts/tagline.js',
	'components/scripts/template.js'
];
jsonSources = [outputDir + 'js/*.json'];
htmlSources = [outputDir + '*.html'];
sassSources = ['components/sass/style.scss'];			
//note that this is the only necessary sass file because the partials are imported here

/* This replace task is a hack to get the config file to update. For some reason unless this config file was updated, my compass settings would not be applied */
gulp.task('replace', function() {
	gulp.src('config.rb')
		.pipe(replace(/#/g, '#'))
		.pipe(gulp.dest('./'))
});

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
		.pipe(gulpif(env === 'production', uglify()))
		.pipe(gulp.dest(outputDir + 'js'))
		.pipe(connect.reload())							//reload the gulp-connect server
});

gulp.task('compass', function() {
	gulp.src(sassSources)
		.pipe(compass({
			config_file: 'config.rb',
			sass: 'components/sass',
			image: outputDir + 'images',
			comments: true,
			style: sassStyle
		}))
		.on('error', gutil.log)
		.pipe(gulp.dest(outputDir + 'css'))
		.pipe(connect.reload())							//reload the gulp-connect server
});

gulp.task('watch', function() {
	gulp.watch(coffeeSources, ['coffee']);
	gulp.watch(jsSources, ['js']);
	gulp.watch('components/sass/*.scss', ['compass']);
	gulp.watch('builds/development/*.html', ['html']);
	gulp.watch(jsonSources, ['json']);
});

gulp.task('connect', function() {
	connect.server({
		root: outputDir,
		livereload: true
	});
});

gulp.task('html', function() {
	gulp.src('builds/development/*.html')
		.pipe(gulpif(env === 'production', minifyHTML()))
		.pipe(gulpif(env === 'production', gulp.dest(outputDir)))
		.pipe(connect.reload())
});

gulp.task('json', function() {
	gulp.src(jsonSources)
		.pipe(connect.reload())
});

gulp.task('default', ['replace', 'coffee', 'js', 'compass', 'json', 'html', 'connect', 'watch']);