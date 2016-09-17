import gulp from 'gulp';
import bower from 'gulp-bower';
import browserify from 'gulp-browserify';
import uglify from 'gulp-uglify';
import cleanCSS from 'gulp-clean-css';
import exec from 'gulp-exec';


gulp.task('install', ['install_bower', 'copy_statics', 'build_js', 'minify_css']);

gulp.task('install_bower', cb => {
  exec('bower-installer', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('copy_statics', () => {
  return gulp.src('src/static/**/*')
      .pipe(gulp.dest('dist/'));
});

gulp.task('build_js', function() {
 return gulp.src('src/js/main.js')
    .pipe(browserify({debug:true}))
    //.pipe(production(uglify()))
    .pipe(gulp.dest('dist/js/'));
});

gulp.task('minify_css', function() {
  return gulp.src('src/css/main.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('watch', () => {
  gulp.watch(['src/static/**/*'], ['copy_statics']);
  gulp.watch(['src/js/**/*'], ['build_js']);
  gulp.watch(['src/css/**/*'], ['minify_css']);
});

gulp.task('default', ['install', 'watch']);
