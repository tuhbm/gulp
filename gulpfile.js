var gulp = require('gulp'),
    spritesmith = require('gulp.spritesmith'),
    csso = require('gulp-csso'),
    sourcemaps = require('gulp-sourcemaps'),
    buffer = require('vinyl-buffer'),
    imagemin = require('gulp-imagemin'),
    merge = require('merge-stream'),
    sass = require('gulp-sass'),
    sassGlob = require('gulp-sass-glob'),
    include = require('gulp-html-tag-include'),
    autoprefixer= require('gulp-autoprefixer'),
    csslint = require('gulp-csslint'),
    uglifycss = require('gulp-uglifycss'),
    rename = require('gulp-rename'),
    // jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    importCss = require('gulp-import-css');

var source = 'src/';
var develop = 'dist/';
var config = {
  lint    : true,
  concat  : true,
  uglify  : true,
  rename  : true,
  path : {
    img : {
      src : source + 'img/**/*.png',
      dist : develop + 'img',
      cssSend: develop + 'css'
    },
    html : {
      src : source + 'html/**/*.html',
      dist : develop + 'html/'
    },
    // sass : {
    //   baseSrc : source + 'scss/',
    //   sassOut : source + 'css',
    //   finalDist: develop + 'css/',
    //   user:{
    //     src:source +'scss/user.scss',
    //     filename:'user.css'
    //   },
    //   system:{
    //     src:source +'scss/system.scss',
    //     filename:'system.css'
    //   },
    //   stats:{
    //     src:source +'scss/stats.scss',
    //     filename:'stats.css'
    //   },
    //   manage:{
    //     src:source +'scss/user.scss',
    //     filename:'manage.css'
    //   },
    //   common:{}
    // },
    sass : {
      src : source + 'scss/**/*.{scss,sass,css}',
      out : source + 'css/',
      cssFile : source + 'css/*.css',
      dist : develop + 'css/'
    },
    js : {
      src : source + 'js/*.js',
      dist : develop + 'js/'
    }
  }
};
/* js */
gulp.task('scripts',function(){});
/* 사스 */
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

// gulp.task('sass', function(){
//   return gulp.src(config.path.sass.src)
//     .pipe(sourcemaps.init())
//     .pipe(sassGlob())
//     .pipe(sass(scssOptions).on('error', sass.logError))
//     .pipe(sourcemaps.write('./maps'))
//     .pipe(gulp.dest(config.path.sass.out));
// });
/* css */
gulp.task('styles', function(){
  return gulp.src(config.path.sass.src)
  .pipe(sassGlob())
   // .pipe(SourceMapSupport())
   .pipe(sourcemaps.init())
  .pipe(sass(scssOptions).on('error', sass.logError))
   .pipe(sourcemaps.write('.'))
  .pipe(importCss())
  .pipe(autoprefixer())
  .pipe(gulp.dest(config.path.sass.dist))
  .pipe(csslint())
  .pipe(uglifycss())
  .pipe(rename({suffix:'.min'}))
  .pipe(gulp.dest(config.path.sass.dist))
});

/* html-include */
gulp.task('html-include', function(){
  return gulp.src(config.path.html.src)
    .pipe(include())
    .pipe(gulp.dest(config.path.html.dist));
});

/* 스프라이트 이미지 */
gulp.task('sprite', function(){
  var spriteData = gulp.src(config.path.img.src)
    .pipe(spritesmith({
        imgName: 'ico-sprite.png',
        imgPath: '../img/ico-sprite.png',
        padding:10,
        cssFormat: 'scss',
        cssName: 'ico-sprite.scss'
      }));

  // Pipe image stream through image optimizer and onto disk
  var imgStream = spriteData.img
  // DEV: We must buffer our stream into a Buffer for `imagemin`
    .pipe(buffer())
    .pipe(imagemin())
    .pipe(gulp.dest(config.path.img.dist));

  // Pipe CSS stream through CSS optimizer and onto disk
  var cssStream = spriteData.css
    // .pipe(sourcemaps.init())
    .pipe(csso())
    // .pipe(sourcemaps.write('.'))
      .pipe(uglifycss())
      .pipe(rename({suffix:'.min'}))
    .pipe(gulp.dest(config.path.img.cssSend));

  // Return a merged stream to handle both `end` events
  return merge(imgStream, cssStream);
});

gulp.task('scripts',['js:concat','js:uglify']);

// gulp.task('js:hint',function(){
//     gulp.src(path.js.src)
//         .pipe(jshint())             //javascript 파일을 검사
//         .pipe(jshint.reporter('jshint-stylish'))
// });
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

/* watch */
gulp.task('watch',function(){
  gulp.watch(config.path.html.src, ['html-include']);
  gulp.watch(config.path.sass.src, ['styles']);
});


gulp.task('default',['watch','styles','html-include']);//,'html-include'