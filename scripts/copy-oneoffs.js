const fs = require('fs-extra');
const path = require('path');

const ONEOFFS_DIR = path.join(__dirname, '../oneoffs');
const OUT_DIR = path.join(__dirname, '../out');

// Directories and files to exclude from copying
const EXCLUDE_PATTERNS = [
  'node_modules',
  '.DS_Store',
  'package.json',
  'package-lock.json',
  '.git',
  '.next',
  'dist'
];

async function copyOneoffs() {
  console.log('📦 Copying oneoff microsites to build output...\n');

  try {
    // Check if oneoffs directory exists
    if (!fs.existsSync(ONEOFFS_DIR)) {
      console.log('⚠️  No oneoffs directory found. Skipping...');
      return;
    }

    // Check if out directory exists
    if (!fs.existsSync(OUT_DIR)) {
      console.error('❌ Build output directory (./out) not found. Run `npm run build` first.');
      process.exit(1);
    }

    // Get all subdirectories in oneoffs/
    const oneoffDirs = fs.readdirSync(ONEOFFS_DIR).filter(file => {
      const fullPath = path.join(ONEOFFS_DIR, file);
      return fs.statSync(fullPath).isDirectory() && !EXCLUDE_PATTERNS.includes(file);
    });

    if (oneoffDirs.length === 0) {
      console.log('⚠️  No oneoff microsites found in ./oneoffs/');
      return;
    }

    // Copy each oneoff directory to ./out/
    for (const dir of oneoffDirs) {
      const srcPath = path.join(ONEOFFS_DIR, dir);
      const destPath = path.join(OUT_DIR, dir);

      console.log(`  ├─ Copying ${dir}/ → out/${dir}/`);

      // Copy directory with filter to exclude certain files/folders
      await fs.copy(srcPath, destPath, {
        filter: (src) => {
          const baseName = path.basename(src);
          return !EXCLUDE_PATTERNS.includes(baseName);
        }
      });
    }

    console.log('\n✅ Oneoff microsites copied successfully!');
    console.log(`\n📍 Available at:`);
    oneoffDirs.forEach(dir => {
      console.log(`   https://mixpanel.github.io/fixpanel/${dir}/`);
    });

  } catch (error) {
    console.error('❌ Error copying oneoffs:', error.message);
    process.exit(1);
  }
}

copyOneoffs();
