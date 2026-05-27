// Transpiles optional chaining (?.) and nullish coalescing (??) out of
// packages that webpack 4 (react-scripts 4) cannot parse.
// Runs via `postinstall` so it re-applies after every `npm install`.
const babel = require('@babel/core');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const PACKAGES = [
  '@noble/curves',
  '@ethereumjs/util',
  'web3-core-method',
  'micro-ftch',
];

const BABEL_OPTS = {
  babelrc: false,
  configFile: false,
  plugins: [
    require.resolve('@babel/plugin-transform-optional-chaining'),
    require.resolve('@babel/plugin-transform-nullish-coalescing-operator'),
    require.resolve('@babel/plugin-transform-logical-assignment-operators'),
  ],
  retainLines: true,
  sourceMaps: false,
};

function walkDir(dir, cb) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'esm' && entry.name !== 'node_modules') walkDir(full, cb);
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      cb(full);
    }
  }
}

function hasModernSyntax(content) {
  return content.includes('?.') || content.includes('??') || content.includes('||=') || content.includes('&&=') || content.includes('??=');
}

let patched = 0;

for (const pkg of PACKAGES) {
  const pkgDir = path.join(ROOT, 'node_modules', pkg);
  if (!fs.existsSync(pkgDir)) {
    console.log(`[fix] ${pkg} not found, skipping`);
    continue;
  }

  walkDir(pkgDir, (file) => {
    const original = fs.readFileSync(file, 'utf8');
    if (!hasModernSyntax(original)) return;

    try {
      const result = babel.transformSync(original, { ...BABEL_OPTS, filename: file });
      if (result && result.code && result.code !== original) {
        fs.writeFileSync(file, result.code, 'utf8');
        console.log(`[fix] patched ${path.relative(ROOT, file)}`);
        patched++;
      }
    } catch (e) {
      console.warn(`[fix] failed to transform ${path.relative(ROOT, file)}: ${e.message}`);
    }
  });
}

console.log(`[fix] done — ${patched} file(s) patched`);
