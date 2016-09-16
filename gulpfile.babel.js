import gulp from 'gulp';
import bower from 'gulp-bower';
import browserify from 'gulp-browserify';
import uglify from 'gulp-uglify';


gulp.task('install', ['install_bower', 'copy_statics', 'build_js']);

gulp.task('install_bower', () => {
  return bower();
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

gulp.task('watch', () => {
  gulp.watch(['src/static/**/*'], ['copy_statics']);
  gulp.watch(['src/js/**/*'], ['build_js']);
});

gulp.task('default', ['install', 'watch']);
