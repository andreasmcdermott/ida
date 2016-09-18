import gulp from 'gulp'
import babel from 'gulp-babel'
import cache from 'gulp-cached'
import chmod from 'gulp-chmod'
import del from 'del'

gulp.task('compile-bin', () => gulp.src('./bin/*.js')
  .pipe(cache('bin'))
  .pipe(babel())
  .pipe(chmod(755))
  .pipe(gulp.dest('./dist/bin')))

gulp.task('compile-lib', () => gulp.src('./lib/**/*.js')
  .pipe(cache('lib'))
  .pipe(babel())
  .pipe(gulp.dest('./dist/lib')))

gulp.task('compile', ['compile-lib', 'compile-bin'])

gulp.task('watch-bin', () => gulp.watch('./bin/*.js', ['compile-bin']))
gulp.task('watch-lib', () => gulp.watch('./lib/**/*.js', ['compile-lib']))
gulp.task('watch', ['watch-bin', 'watch-lib'])

gulp.task('clean', () => del(['dist']))

gulp.task('default', ['compile', 'watch'])
