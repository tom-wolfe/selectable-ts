const fs = require('fs');
const path = require('path');

const config = {
  dist: './dist',
  package: 'package.json',
  otherFiles: [
    'README.md',
    'LICENSE'
  ]
}

const dstPackage = path.join(config.dist, config.package);
fs.copyFileSync(config.package, dstPackage);

const package = JSON.parse(fs.readFileSync(dstPackage));
package.scripts = {};
fs.writeFileSync(dstPackage, JSON.stringify(package, null, 2));

config.otherFiles.forEach(f => {
  fs.copyFileSync(f, path.join(config.dist, f));
});