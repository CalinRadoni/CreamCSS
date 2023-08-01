const srcDir = 'src/';
const dstDir = 'dist/';
const docsDir = 'docs/';

import gulp from 'gulp';
import less from 'gulp-less';
import cleanCSS from 'gulp-clean-css';
import concat from 'gulp-concat';
import rename from 'gulp-rename';
import replace from 'gulp-replace';
import { deleteAsync } from 'del';

const { src, dest, series } = gulp;

import fs from 'fs';
var app_version = "0.0.0";

async function get_version() {
  const { version } = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  app_version = version;
  console.log('CreamCSS v' + app_version);
  await Promise.resolve('');
}

function process_cream() {
  return src(srcDir + 'cream.css')
    .pipe(replace("{{ version }}", app_version))
    .pipe(less())
    .pipe(rename({ extname: '.min.css' }))
    .pipe(cleanCSS())
    .pipe(dest(dstDir));
}

function process_cream_mn() {
  return src([srcDir + 'modern-normalize.css', srcDir + 'cream.css'])
    .pipe(concat('cream-mn.css'))
    .pipe(replace("{{ version }}", app_version))
    .pipe(less())
    .pipe(cleanCSS())
    .pipe(dest(dstDir));
}

function process_cream_all() {
  return src([srcDir + 'cream.css', srcDir + 'cream-extra.css'])
    .pipe(concat('cream-all.min.css'))
    .pipe(replace("{{ version }}", app_version))
    .pipe(less())
    .pipe(cleanCSS())
    .pipe(dest(dstDir));
}

function process_cream_all_mn() {
  return src([srcDir + 'modern-normalize.css', srcDir + 'cream.css', srcDir + 'cream-extra.css'])
    .pipe(concat('cream-all-mn.css'))
    .pipe(replace("{{ version }}", app_version))
    .pipe(less())
    .pipe(cleanCSS())
    .pipe(dest(dstDir))
    .pipe(dest(docsDir));
}

async function clean() {
  await deleteAsync(dstDir + '*.css');
}

const build_all = series(get_version, process_cream, process_cream_all, process_cream_mn, process_cream_all_mn);

export {
  clean,
  build_all as build,
  get_version as default
}
