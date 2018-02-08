var gulp = require('gulp'),
    sass = require('gulp-sass'),
    spritesmith = require('gulp.spritesmith'),
    csso = require('gulp-csso'),
    buffer = require('vinyl-buffer'),
    imagemin = require('gulp-imagemin'),
    merge = require('merge-stream'),
    uglifycss = require('gulp-uglifycss'),
    autoprefixer= require('gulp-autoprefixer'),
    include = require('gulp-html-tag-include'),
    postcss = require('gulp-postcss'),
    sourcemaps = require('gulp-sourcemaps'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    minify = require('gulp-minify'),
    sassLint = require('gulp-sass-lint');

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
    sourceComments: false
};

gulp.task('sass', function(){
    var AUTOPREFIXER_BROWSERS = [
        'ie >= 10',
        'ie_mob >= 10',
        'ff >= 30',
        'chrome >= 34',
        'safari >= 7',
        'opera >= 23',
        'ios >= 7',
        'android >= 4.4',
        'bb >= 10'
    ];

   return gulp.src('./src/scss/*.scss')
       .pipe(sassLint({
           options: {
               formatter: 'scss',
               'merge-default-rules': 0,
               'no-misspelled-properties': 0,
               'severity': 0
           },
           files: {ignore: '**/*.scss'},
           rules: {
               'no-ids': 1,
               'no-mergeable-selectors': 0
           },
           configFile: 'config/other/.sass-lint.yml'
       }))
       .pipe(sourcemaps.init())
       .pipe(sass(scssOptions).on('error', sass.logError))
       .pipe(postcss(autoprefixer))
       .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
       .pipe(rename({suffix:'.min'}))
       .pipe(sourcemaps.write())
       .pipe(gulp.dest('./dist/css'))
});

gulp.task('html-include', function(){
    return gulp.src('./src/html/**/*.html')
        .pipe(include())
        .pipe(gulp.dest('./dist/html'));
});

gulp.task('sprite', function(){
    var spriteData = gulp.src('./src/img/*.png')
        .pipe(spritesmith({
            imgName: 'ico-sprite.png',
            imgPath: '../img/ico-sprite.png',
            padding:10,
            algorithm: 'binary-tree',
            cssFormat: 'css',
            cssName: 'ico-sprite.css'
        }));

    // Pipe image stream through image optimizer and onto disk
    var imgStream = spriteData.img
    // DEV: We must buffer our stream into a Buffer for `imagemin`
        .pipe(buffer())
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/img'));

    // Pipe CSS stream through CSS optimizer and onto disk
    var cssStream = spriteData.css
        .pipe(sourcemaps.init())
        .pipe(csso())
        .pipe(uglifycss())
        .pipe(sourcemaps.write())
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest('./dist/css'));

    // Return a merged stream to handle both `end` events
    return merge(imgStream, cssStream);
});


// gulp.task('js:hint',function(){
//     gulp.src(path.js.src)
//         .pipe(jshint())             //javascript 파일을 검사
//         .pipe(jshint.reporter('jshint-stylish'))
// });
gulp.task('scripts',function(){
    gulp.src('./src/js/**/*.js')
        .pipe(concat('bundle.js'))  //javascript 파일을 병합
        .pipe(minify({
            ext:{
                src:'-debug.js',
                min:'.js'
            },
            exclude: ['tasks'],
            ignoreFiles: ['.combo.js', '-min.js']
        }))
        // .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest('./dist/js'));      //javascript 파일을 저장
});

gulp.task('watch',function(){
    gulp.watch('./src/js/**/*.js', ['scripts']);
    gulp.watch('./src/scss/**/*.scss', ['sass']);
    gulp.watch('./src/html/**/*.html', ['html-include']);
    gulp.watch('./src/img/*.png', ['sprite']);
});
gulp.task('default',['watch','sprite','scripts', 'sass', 'html-include']);