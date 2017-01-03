var gulp        = require('gulp'), // gulp 모듈
    csslint     = require('gulp-csslint'),
    concatcss   = require('gulp-concat-css'),
    uglifycss   = require('gulp-uglifycss'),
    rename      = require('gulp-rename'),
    jshint      = require('gulp-jshint'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglify'),
    gulpif      = require('gulp-if'),
    del         = require('del'),
    config      = require('./config.json');


// gulp.task()를 사용해 기본 디폴트 데스크 정의
gulp.task('default',['clean','styles','scripts']);

gulp.task('watch',['clean'],function(){
   gulp.watch(config.path.css.src, ['styles']);
   gulp.watch(config.path.js.src, ['scripts']);
});

gulp.task('clean',function(){
   del(['dist/*']) 
});

// style
gulp.task('styles',function(){
    gulp.src(config.path.css.src)
        .pipe(gulpif(config.lint, csslint({'import':false})) )             //css 파일을 검사
        .pipe(gulpif(config.concat, concatcss(config.path.css.filename)) )  //css 파일을 병합
        .pipe(gulpif(config.rename, gulp.dest(config.path.css.dest)) )
        .pipe(gulpif(config.uglify ,uglifycss({              //css 파일을 한줄정리
            mangle: false,
            preserveComments : 'all'
        })) )
        .pipe(gulpif(config.rename, rename({suffix:'.min'})) )
        .pipe(gulp.dest( config.path.css.dest ));      //css 파일을 저장
    
});

gulp.task('scripts',function(){
    gulp.src(config.path.js.src)
        .pipe(gulpif(config.lint, jshint()) )             //javascript 파일을 검사
        .pipe(gulpif(config.lint, jshint.reporter('jshint-stylish')) )
        .pipe(gulpif(config.concat, concat(config.path.js.filename)) )  //javascript 파일을 병합
        .pipe(gulpif(config.rename, gulp.dest(config.path.js.dest)) )
        .pipe(gulpif(config.uglify, uglify({              //javascript 파일을 한줄정리
            mangle: false,
            preserveComments : 'all'
        })) )
        .pipe(gulpif(config.rename, rename({suffix:'.min'})) )
        .pipe(gulp.dest(config.path.js.dest));      //javascript 파일을 저장
});
/*
// script
gulp.task('scripts',['js:hint','js:concat','js:uglify']);

gulp.task('js:hint',function(){
    gulp.src(config.path.js.src)
        .pipe(jshint())             //javascript 파일을 검사
        .pipe(jshint.reporter('jshint-stylish'))
});
gulp.task('js:concat',function(){
    gulp.src(config.path.js.src)
        .pipe(concat(path.js.filename))  //javascript 파일을 병합
        .pipe(gulp.dest(config.path.js.dest))
});
gulp.task('js:uglify',function(){
    gulp.src(path.js.dest +'/'+ path.js.filename)
        .pipe(gulpif(config.concat, uglify({              //javascript 파일을 한줄정리
            mangle: false,
            preserveComments : 'all'
        })) )
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest(path.js.dest));      //javascript 파일을 저장
});

*/
/*
gulp.task('css:lint',function(){
    gulp.src(path.css.src)
        .pipe(csslint({'import':false}))             //css 파일을 검사
        //.pipe(csslint.reporter())
});
gulp.task('css:concat',function(){
    gulp.src(path.css.src)
        .pipe(concatcss(path.css.filename))  //css 파일을 병합
        .pipe(gulp.dest(path.css.dest))
});
gulp.task('css:uglify',function(){
    gulp.src(path.css.dest +'/'+ path.css.filename)
        .pipe(uglifycss({              //css 파일을 한줄정리
            mangle: false,
            preserveComments : 'all'
        }))
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest(path.css.dest));      //css 파일을 저장
});
*/
/*
gulp.task('scripts',function(){
   gulp
        //.src('./src/*.js')
        .pipe(jshint())             //javascript 파일을 검사
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(concat('common.js'))  //javascript 파일을 한줄정리
        .pipe(gulp.dest('./dist/js'))
        .pipe(uglify({              //javascript 파일을 병합
            mangle: false,
            preserveComments : 'all'
        }))
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest('./dist/js'));      //javascript 파일을 저장
});
*/
