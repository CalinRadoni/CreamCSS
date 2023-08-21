#!/usr/bin/env node

// this script can be run directly if you have node installed
// but it can also be run as `node build_CreamCSS.js`

const srcDir = 'src/';
const dstDir = 'dist/';
const docsDir = 'docs/';

const srcFiles = [
  srcDir + 'modern-normalize.css',
  srcDir + 'cream.css',
  srcDir + 'cream-extra.css'
];

// Note: if you modify the order of these elements you must modify the writeResult function !
const outFiles = [
  'cream.min.css',
  'cream-mn.css',
  'cream-all.min.css',
  'cream-all-mn.css'
];

const fs = require('node:fs/promises');
const CleanCSS = require('clean-css');

async function getVersion() {
  try {
    const jsonString = await fs.readFile('./package.json', { encoding: 'utf8' });
    const jsonData = JSON.parse(jsonString);
    return Promise.resolve(jsonData.version);
  }
  catch (err) {
    console.error("Failed to parse version file");
    console.error(err);
    return Promise.reject();
  }
}

function minifyCSS() {
  return new CleanCSS(
    {
      returnPromise: true,
      batch: true
    }
  ).minify(srcFiles);
}

function displayMinimizeInfo(mFiles) {
  srcFiles.forEach((sourceFile) => {
    console.log(sourceFile);
    console.log(mFiles[sourceFile].stats);
    if (mFiles[sourceFile].errors.length > 0) {
      console.error(mFiles[sourceFile].errors);
    }
    if (mFiles[sourceFile].warnings.length > 0) {
      console.warn(mFiles[sourceFile].warnings);
    }
  });
}

function addCurrentVersionNumber(mFiles, currentVersion) {
  srcFiles.forEach((sourceFile) => {
    mFiles[sourceFile].styles = mFiles[sourceFile].styles.replace(
      '{{ version }}',
      currentVersion
    );
  });
}

async function writeResult(minimizedFiles, idx) {
  if (idx < 0 || idx > outFiles.length) {
    console.error('writeResult: idx value is wrong');
    return;
  }

  const fd = await fs.open(dstDir + outFiles[idx], 'w');
  switch (idx) {
    case 0:
      await fd.write(minimizedFiles[srcFiles[1]].styles);
      break;
    case 1:
      await fd.write(minimizedFiles[srcFiles[0]].styles);
      await fd.write('\n');
      await fd.write(minimizedFiles[srcFiles[1]].styles);
      break;
    case 2:
      await fd.write(minimizedFiles[srcFiles[1]].styles);
      await fd.write('\n');
      await fd.write(minimizedFiles[srcFiles[2]].styles);
      break;
    case 3:
      await fd.write(minimizedFiles[srcFiles[0]].styles);
      await fd.write('\n');
      await fd.write(minimizedFiles[srcFiles[1]].styles);
      await fd.write('\n');
      await fd.write(minimizedFiles[srcFiles[2]].styles);
      break;
  }
  await fd.close();
}

async function build() {
  try {
    let appVersion = await getVersion();
    console.log(`App version: ${appVersion}`);

    let minimizedFiles = await minifyCSS();
    displayMinimizeInfo(minimizedFiles);

    // replace version in file
    addCurrentVersionNumber(minimizedFiles, appVersion);

    // write destination files
    for (let i = 0; i < outFiles.length; ++i) {
      await writeResult(minimizedFiles, i);
    }

    await fs.copyFile(dstDir + 'cream-all-mn.css', docsDir + 'cream-all-mn.css');
  }
  catch (err) {
    console.log('\nBuild error !');
    if (err) {
      console.log(err);
    }
  }
}

build();
