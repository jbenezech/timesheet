import gulp from 'gulp';
import merge from 'merge-stream';
import changedInPlace from 'gulp-changed-in-place';
import project from '../aurelia.json';

export default function copyThemes() {
  const source = 'semantic/dist/themes';

  const taskFonts = gulp.src(`${source}/**/*`)
    .pipe(changedInPlace({ firstPass: true }))
    .pipe(gulp.dest(`${project.platform.output}/../semantic/themes`));

  return taskFonts;
}