var gulp = require('gulp'),
    jscs = require('gulp-jscs'),
    gulpif = require('gulp-if'),
    gutil = require('gulp-util'),
    autoprefixer = require('gulp-autoprefixer'),
    htmlmin = require('gulp-htmlmin'),
    seed = require('./seed/seed.js');

gulp.task('seed', function () {
    var mongoose = require('mongoose');
    mongoose.connect('mongodb://localhost/lenka');
    //FIXME: Clear DB
    return seed();
    //FIXME: Сделать так чтобы задача завершалась без CTRL+C
});