const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

const output = fs.createWriteStream('freegridpaper-netlify-deploy.zip');
const archive = archiver('zip', {
  zlib: { level: 9 }
});

output.on('close', () => {
  console.log(`\nZip file created successfully!`);
  console.log(`Total size: ${(archive.pointer() / 1024).toFixed(1)} KB`);
  process.exit(0);
});

archive.on('error', (err) => {
  console.error('Archive error:', err);
  process.exit(1);
});

archive.pipe(output);

console.log('Building zip file...\n');

// Directories to include
const dirs = ['client', 'server', 'shared'];
dirs.forEach(dir => {
  console.log(`Adding directory: ${dir}/`);
  archive.directory(dir, dir);
});

// Individual files
const files = [
  'package.json',
  'package-lock.json',
  'tsconfig.json',
  'vite.config.ts',
  'tailwind.config.ts',
  'postcss.config.js',
  'components.json',
  'drizzle.config.ts',
  'netlify.toml',
  '.netlifyignore',
  '.gitignore',
  'NETLIFY_DEPLOYMENT.md'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`Adding file:      ${file}`);
    archive.file(file, { name: file });
  }
});

// Add dist folder for pre-built assets
console.log(`Adding directory: dist/`);
archive.directory('dist', 'dist');

archive.finalize();
