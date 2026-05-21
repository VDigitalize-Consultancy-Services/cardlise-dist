const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DIST_DIR = path.resolve(__dirname, '..', 'dist');
const ROOT_DIR = path.resolve(__dirname, '..');

const FILES_TO_INCLUDE = [
  'theme.json',
  'styles/',
  'layouts/',
  'components/',
  'assets/',
  'preview/',
];

function build() {
  console.log('📦 Building theme package...\n');

  // Run validation first
  try {
    execSync('node scripts/validate.js', { cwd: ROOT_DIR, stdio: 'inherit' });
  } catch (e) {
    console.error('\n❌ Validation failed. Fix errors before building.\n');
    process.exit(1);
  }

  // Create dist directory
  if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR, { recursive: true });
  }

  // Read theme.json for naming
  const theme = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'theme.json'), 'utf-8'));
  const safeName = theme.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const zipName = `${safeName}-v${theme.version}.zip`;

  // Collect files
  const filesToZip = [];
  for (const item of FILES_TO_INCLUDE) {
    const fullPath = path.join(ROOT_DIR, item);
    if (fs.existsSync(fullPath)) {
      filesToZip.push(item);
    }
  }

  // Create zip using system zip command
  const zipPath = path.join(DIST_DIR, zipName);
  if (fs.existsSync(zipPath)) {
    fs.unlinkSync(zipPath);
  }

  try {
    const fileArgs = filesToZip.join(' ');
    execSync(`zip -r "${zipPath}" ${fileArgs}`, { cwd: ROOT_DIR, stdio: 'pipe' });
    
    const stats = fs.statSync(zipPath);
    const sizeKB = (stats.size / 1024).toFixed(1);
    
    console.log(`\n✅ Theme built successfully!`);
    console.log(`   📦 ${zipName} (${sizeKB}KB)`);
    console.log(`   📁 Output: dist/${zipName}\n`);
    console.log('Next steps:');
    console.log('  1. Upload via Developer Dashboard at cardlise.com');
    console.log('  2. Or use the API: POST /api/developer/themes\n');
  } catch (e) {
    console.error('❌ Failed to create zip file. Make sure "zip" is available on your system.');
    console.error(e.message);
    process.exit(1);
  }
}

build();
