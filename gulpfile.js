var gulp = require('gulp');
var jshint = require('gulp-jshint');
var mocha  = require('gulp-mocha');

gulp.task('default', function(){
});

gulp.task('jshint', function(){
    gulp.src(['./lib/**/*.js', './test/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('test', function() {
  return gulp
    .src('test/*.js')
    .pipe(mocha());
});
