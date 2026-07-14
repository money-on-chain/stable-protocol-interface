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
  '@rsksmart/rlogin-walletconnect2-provider',
  '@rsksmart/rlogin',
  '@rsksmart/rlogin-ledger-provider',
  '@rsksmart/rlogin-trezor-provider',
  '@rsksmart/rlogin-dcent-provider',
];

const BABEL_OPTS = {
  babelrc: false,
  configFile: false,
  plugins: [
    require.resolve('@babel/plugin-transform-optional-chaining'),
    require.resolve('@babel/plugin-transform-nullish-coalescing-operator'),
    require.resolve('@babel/plugin-transform-logical-assignment-operators'),
    require.resolve('@babel/plugin-transform-class-properties'),
    require.resolve('@babel/plugin-transform-private-methods'),
    require.resolve('@babel/plugin-transform-private-property-in-object'),
  ],
  retainLines: true,
  sourceMaps: false,
};

function walkDir(dir, cb) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Descend into nested node_modules too: packages like @ethereumjs/util
      // ship their own pinned copy of @noble/curves under
      // node_modules/@ethereumjs/util/node_modules/@noble/curves, which is a
      // different file tree than the hoisted root-level @noble/curves.
      if (entry.name !== 'esm') walkDir(full, cb);
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      cb(full);
    }
  }
}

function hasModernSyntax(content) {
  return content.includes('?.') || content.includes('??') || content.includes('||=') || content.includes('&&=') || content.includes('??=') || /#[a-zA-Z_]/.test(content);
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
