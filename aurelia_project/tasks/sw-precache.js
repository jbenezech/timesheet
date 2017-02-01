import gulp from 'gulp';
import merge from 'merge-stream';
import changedInPlace from 'gulp-changed-in-place';
import project from '../aurelia.json';

export default function generateServiceWorker() {

  return gulp.task('generate-service-worker', function(callback) {
      swPrecache.write(`service-worker.js`, {
        staticFileGlobs: ['index.html, scripts/**, semantic/dist/themes/**/*.{js,html,css,png,jpg,gif,svg,eot,ttf,woff}']
      }, callback);
  });
  
}