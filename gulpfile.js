var gulp        = require('gulp'), // gulp 모듈
    spritesmith = require('gulp.spritesmith'),
    sass        = require('gulp-sass'),
    csslint     = require('gulp-csslint'),
    concatcss   = require('gulp-concat-css'),
    uglifycss   = require('gulp-uglifycss'),
    rename      = require('gulp-rename'),
    jshint      = require('gulp-jshint'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglify'),
    gulpif      = require('gulp-if'),
    del         = require('del');
var buffer = require('vinyl-buffer');
var csso = require('gulp-csso');
var imagemin = require('gulp-imagemin');
var merge = require('merge-stream');

var config = {
    lint    : true,
    concat  : true,
    uglify  : true,
    rename  : true
};

var path ={
    js:{
        src: 'src/**/*.js',
        dest:'dist/js',
        filename:'common.js'
    },
    css:{
        src:'src/css/*.css',
        dest:'dist/css',
        filename:'default.css'
        src:'src/**/*.css',
        dest:'dist/css',
        filename:'common.css'
    },
    sass:{
        src:'src/**/*.scss'
    }
};


// gulp.task()를 사용해 기본 디폴트 데스크 정의
gulp.task('default',['sprite','sass','styles','scripts']);

gulp.task('watch',function(){
    gulp.watch(path.sass.src, ['sass']);
    gulp.watch(path.css.src, ['styles']);
    gulp.watch(path.js.src, ['scripts']);
});

gulp.task('clean',function(){
   del(['dist/*']) 
});

var scssOptions = { 
        /** 
        * outputStyle (Type : String , Default : nested) 
        * CSS의 컴파일 결과 코드스타일 지정 
        * Values : nested, expanded, compact, compressed 
        */ 
        outputStyle : "expanded", 
        /** 
        * indentType (>= v3.0.0 , Type : String , Default : space) 
        * 컴파일 된 CSS의 "들여쓰기" 의 타입 * Values : space , tab 
        */ 
        indentType : "tab", 
        /** 
        * indentWidth (>= v3.0.0, Type : Integer , Default : 2) 
        * 컴파일 된 CSS의 "들여쓰기" 의 갯수 
        */ 
        indentWidth : 1, // outputStyle 이 nested, expanded 인 경우에 사용 
        /** 
        * precision (Type : Integer , Default : 5) 
        * 컴파일 된 CSS 의 소수점 자리수. 
        */ 
        precision: 6, 
        /** 
        * sourceComments (Type : Boolean , Default : false) 
        * 컴파일 된 CSS 에 원본소스의 위치와 줄수 주석표시. 
        */ 
        sourceComments: true 
}; 
// image sprite
gulp.task('sprite', function(){
    var spriteData = gulp.src('images/*.png')
    .pipe(spritesmith({
        imgName: 'sprite.png',
<<<<<<< HEAD
        padding: 20,
        algorithm: 'binary-tree',//top-down , binary-tree , left-right
        cssName: 'sprite.css'
    }));
    // Pipe image stream through image optimizer and onto disk
    var imgStream = spriteData.img
    // DEV: We must buffer our stream into a Buffer for `imagemin`
        .pipe(buffer())
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'));

    // Pipe CSS stream through CSS optimizer and onto disk
    var cssStream = spriteData.css
        .pipe(csso())
        .pipe(gulp.dest('dist/css'));

    // Return a merged stream to handle both `end` events
    return merge(imgStream, cssStream);
    // spriteData.img.pipe(gulp.dest('dist/img'));
    // spriteData.css.pipe(gulp.dest('dist/css'));
});

// image spritesmith


// gulp.task('sprites', function () {
//     return  gulp.src('./images/*.png')
//         .pipe(spritesmith({
//             imgName: 'sprite.png',
//             styleName: 'sprite.css',
//             imgPath: '../img/sprite.png'
//         }))
//         .pipe(gulpif('*.png', gulp.dest('./dist/img/')))
//         .pipe(gulpif('*.css', gulp.dest('./dist/css/')));
// });

=======
        padding: 10,
        algorithm: 'top-down',
        cssName: 'sprite.css'
    }));
    spriteData.img.pipe(gulp.dest('images'));
    spriteData.css.pipe(gulp.dest('dist/css'));
});

>>>>>>> bc69c7f072cadec2053ff3b35f83bdbceb2104e2
// sass
gulp.task('sass', function (){ 
    return gulp.src('src/scss/**/*.scss') 
        .pipe(sass(scssOptions).on('error', sass.logError)) 
        .pipe(gulp.dest('src/css/modules')); 
});

// style
gulp.task('styles',function(){
    gulp.src(path.css.src)
        .pipe(gulpif(config.lint, csslint({'import':false})) )             //css 파일을 검사
        .pipe(gulpif(config.concat, concatcss(path.css.filename)) )  //css 파일을 병합
        .pipe(gulpif(config.rename, gulp.dest(path.css.dest)) )
        .pipe(gulpif(config.uglify ,uglifycss()) )
        .pipe(gulpif(config.rename, rename({suffix:'.min'})) )
        .pipe(gulp.dest( path.css.dest ));      //css 파일을 저장
    
});

// script
gulp.task('scripts',['js:hint','js:concat','js:uglify']);

gulp.task('js:hint',function(){
    gulp.src(path.js.src)
        .pipe(jshint())             //javascript 파일을 검사
        .pipe(jshint.reporter('jshint-stylish'))
});
gulp.task('js:concat',function(){
    gulp.src(path.js.src)
        .pipe(concat(path.js.filename))  //javascript 파일을 병합
        .pipe(gulp.dest(path.js.dest))
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
