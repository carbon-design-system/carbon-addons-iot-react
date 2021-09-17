////////////////////////////////////
// Gulp all the things
////////////////////////////////////
'use strict';

//
// Requires
// =================================
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const tap = require('gulp-tap');
const path = require('path');

//
// Variables
// =================================
const dirs = {
  DIST: 'dist',
  SRC: 'src',
};

const globs = {
  scss: `${dirs.SRC}/**/*.scss`,
};

const licenseTemplate = `/**
 *
 * @ai-apps/angular v@PACKAGE_VERSION@ | @FILE_NAME@
 *
 * Copyright 2014, @THIS_YEAR@ IBM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
\n
`;

//
// Build tasks
// =================================
const moveLicense = () => gulp.src('LICENSE.md').pipe(gulp.dest(dirs.DIST));

const buildLicense = () =>
  gulp
    .src([
      `${dirs.DIST}/**/*.scss`,
      `${dirs.DIST}/**/*.css`,
      `${dirs.DIST}/**/*.ts`,
      `${dirs.DIST}/**/*.js`,
    ])
    .pipe(licenseHeaders())
    .pipe(gulp.dest(dirs.DIST));

const buildReadme = () => gulp.src('README.md').pipe(gulp.dest(dirs.DIST));

const copyStyles = () => gulp.src(globs.scss).pipe(gulp.dest(`${dirs.DIST}/esm2015`));

//
// Running tasks
// =================================
const buildMeta = gulp.parallel(moveLicense, buildLicense, buildReadme);

module.exports = {
  buildLicense,
  buildReadme,
  moveLicense,
  buildMeta,
  copyStyles,
  default: buildMeta,
};

//
// Functions
// =================================
function licenseHeaders() {
  return tap(function (file) {
    const packageJSON = require('./package.json');
    const updatedTemplate = licenseTemplate
      .replace('@PACKAGE_VERSION@', packageJSON.version)
      .replace('@FILE_NAME@', path.basename(file.path))
      .replace('@THIS_YEAR@', new Date().getFullYear());
    file.contents = Buffer.concat([new Buffer(updatedTemplate), file.contents]);
  });
}
