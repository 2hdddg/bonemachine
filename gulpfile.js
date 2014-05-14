var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    spawn = require('child_process').spawn,
    mocha  = require('gulp-mocha');

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

gulp.task('server', function(){
    var params = [
        './lib/bonemachine.js',
        'server',
        '--agent',   // start agent
        '--agentregistry', './sample_agent',
        '--central'
    ];
    var instance = spawn('node', params, {stdio: 'inherit'});
})