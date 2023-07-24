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
import { promisify } from 'util';
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
    .pipe(dest(dstDir))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(cleanCSS())
    .pipe(dest(dstDir))
    .pipe(dest(docsDir));
}

function process_cream_all() {
  return src([srcDir + 'modern-normalize.css', srcDir + 'cream.css', srcDir + 'cream-extra.css'])
    .pipe(concat('cream_full.css'))
    .pipe(replace("{{ version }}", app_version))
    .pipe(less())
    .pipe(dest(dstDir))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(cleanCSS())
    .pipe(dest(dstDir))
    .pipe(dest(docsDir));
}

async function clean() {
  await deleteAsync(dstDir + '*.css');
}

const build_cream = series(get_version, process_cream);
const build_all = series(get_version, process_cream, process_cream_all);

export {
    clean,
    build_cream as build,
    build_all,
    get_version as default
}


