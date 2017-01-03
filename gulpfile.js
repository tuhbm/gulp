var gulp        = require('gulp'), //gulp 모듈
    csslint     = require('gulp-csslint'),
    concatcss   = require('gulp-concat-css'),
    uglifycss   = require('gulp-uglifycss'),
    jshint      = require('gulp-jshint'),
    uglify      = require('gulp-uglify'),
    concat      = require('gulp-concat'),
    rename      = require('gulp-rename'),
    gulpif      = require('gulp-if'),
    del         = require('del'),
    config      = require('./config.json');



gulp.task('clean',function(){
    del(['src/*'])
});



gulp.task('styles',function(){
   gulp.src(config.path.css.src) 
       .pipe(gulpif(config.lint, csslint({'import':false})))                       //css 문법검사
       .pipe(gulpif(config.concat, concatcss(path.css.filename)))    //css 파일병함
       .pipe(gulpif(config.rename, gulp.dest(path.css.dest)))
       .pipe(gulpif(config.uglify, uglifycss()))                     //css 압축
       .pipe(gulpif(config.rename, rename({suffix:'.min'})))
       .pipe(gulp.dest(path.css.dest));
});
gulp.task('scripts',function(){
    gulp.src(config.path.js.src)
        .pipe(gulpif(config.lint,jshint()))
        .pipe(gulpif(config.lint,jshint.reporter('jshint-stylish')))
        .pipe(gulpif(config.concat,concat(config.path.js.filename)))
        .pipe(gulpif(config.rename,gulp.dest(config.path.js.dest)))
        .pipe(gulpif(config.uglify, uglify({mangle : false, preserveComments : 'all'})))
        .pipe(gulpif(config.rename, rename({suffix:'.min'})))
        .pipe(gulp.dest(config.path.js.dest));
})


//gulp.task('scripts',['js:hint','js:concat','js:uglify']);

// JS 문법검사
gulp.task('js:hint',function(){
    gulp.src(config.path.js.src)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});
// JS 병합
gulp.task('js:concat',function(){
    gulp.src(config.path.js.src)
        .pipe(concat(config.path.js.filename))
        .pipe(gulp.dest(config.path.js.dest));
});
// JS 압축
gulp.task('js:uglify',function(){
    gulp.src(config.path.js.dest+'/' + path.js.filename)
        .pipe(gulpif(config.concat, uglify({mangle : false, preserveComments : 'all'})))
        .pipe(gulpif(config.uglify, rename({suffix:'.min'})))
        .pipe(gulp.dest(path.js.dest));
});

gulp.task('watch',function(){
    gulp.watch(config.path.css.src,['styles']);
    gulp.watch(config.path.js.src,['scripts']);
})
gulp.task('default',function(){
   console.log('gulp default 일이 수행되었습니다');
});
