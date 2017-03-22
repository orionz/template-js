
var gulp = require("gulp");
var babel = require("gulp-babel");
var nodemon = require('gulp-nodemon')
var watch = require("gulp-watch");
var webpack = require('gulp-webpack');
var plumber = require('gulp-plumber');
var named = require('vinyl-named');

var SRC = "src/**/*";

gulp.task("babel",function() {
  return gulp.src(SRC)
    .pipe(plumber())
    .pipe(babel())
    .pipe(gulp.dest("dist/"));
})

gulp.task("build",["babel"],function() {
  return gulp.src("dist/client.js")
    .pipe(named())
    .pipe(plumber())
    .pipe(webpack())
    .pipe(gulp.dest("public/js"));
})

gulp.task("watch", function() {
  return gulp.watch(SRC, ["build"])
})

gulp.task('start', ["build","watch"], function () {
  return nodemon({
    script: 'dist/server.js'
  , ext: 'js html'
  , env: { 'NODE_ENV': 'development' }
  })
})
