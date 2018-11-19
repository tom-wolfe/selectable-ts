const fs = require('fs');
const path = require('path');

const config = {
  dst: './dist',
  stylesSrc: './styles',
  stylesDst: 'css',
  package: 'package.json',
  otherFiles: [
    'README.md',
    'LICENSE'
  ]
}

const dstPackage = path.join(config.dst, config.package);
fs.copyFileSync(config.package, dstPackage);

const package = JSON.parse(fs.readFileSync(dstPackage));
package.scripts = {};
fs.writeFileSync(dstPackage, JSON.stringify(package, null, 2));

config.otherFiles.forEach(f => {
  fs.copyFileSync(f, path.join(config.dst, f));
});

const stylesDst = path.join(config.dst, config.stylesDst);
fs.mkdirSync(stylesDst);
fs.readdirSync(config.stylesSrc)
  .filter(f => fs.lstatSync(path.join(config.stylesSrc, f)).isFile())
  .forEach(f => {
    fs.copyFileSync(
      path.join(config.stylesSrc, f),
      path.join(stylesDst, f));
  });