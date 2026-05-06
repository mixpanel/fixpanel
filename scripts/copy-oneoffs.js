const fs = require('fs-extra');
const path = require('path');
const generateOneoffsIndex = require('./generate-oneoffs-index');

const ONEOFFS_DIR = path.join(__dirname, '../oneoffs');
const DELIVERABLES_DIR = path.join(__dirname, '../deliverables');
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
  console.log('📦 Preparing oneoff microsites for build output...\n');

  // Generate the index page first
  try {
    await generateOneoffsIndex();
    console.log(''); // Add spacing after index generation
  } catch (error) {
    console.error('⚠️  Failed to generate oneoffs index, continuing with copy...');
  }

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

    // Copy the generated index.html if it exists
    const indexSrc = path.join(ONEOFFS_DIR, 'index.html');
    if (fs.existsSync(indexSrc)) {
      // Create oneoffs directory in out and copy index there
      const oneoffsOutDir = path.join(OUT_DIR, 'oneoffs');
      await fs.ensureDir(oneoffsOutDir);
      const indexDest = path.join(oneoffsOutDir, 'index.html');
      await fs.copy(indexSrc, indexDest);
      console.log(`  └─ Copying oneoffs index → out/oneoffs/index.html`);
    }

    console.log('\n✅ Oneoff microsites copied successfully!');
    console.log(`\n📍 Available at:`);
    console.log(`   https://mixpanel.github.io/fixpanel/oneoffs/ (index)`);
    oneoffDirs.forEach(dir => {
      console.log(`   https://mixpanel.github.io/fixpanel/${dir}/`);
    });

  } catch (error) {
    console.error('❌ Error copying oneoffs:', error.message);
    process.exit(1);
  }
}

async function copyDeliverables() {
  console.log('\n📦 Copying deliverables to build output...\n');

  if (!fs.existsSync(DELIVERABLES_DIR)) {
    console.log('⚠️  No deliverables directory found. Skipping...');
    return;
  }

  if (!fs.existsSync(OUT_DIR)) {
    console.error('❌ Build output directory (./out) not found. Run `npm run build` first.');
    process.exit(1);
  }

  const destDir = path.join(OUT_DIR, 'deliverables');
  await fs.ensureDir(destDir);

  const files = fs.readdirSync(DELIVERABLES_DIR).filter(file => {
    return !EXCLUDE_PATTERNS.includes(file) && file !== '.DS_Store';
  });

  if (files.length === 0) {
    console.log('⚠️  No deliverables found in ./deliverables/');
    return;
  }

  for (const file of files) {
    const srcPath = path.join(DELIVERABLES_DIR, file);
    const destPath = path.join(destDir, file);
    const stat = fs.statSync(srcPath);

    if (stat.isFile()) {
      console.log(`  ├─ Copying ${file} → out/deliverables/${file}`);
      await fs.copy(srcPath, destPath);
    }
  }

  console.log('\n✅ Deliverables copied successfully! (no index — direct links only)');
  console.log(`\n📍 Available at:`);
  files.filter(f => fs.statSync(path.join(DELIVERABLES_DIR, f)).isFile()).forEach(file => {
    console.log(`   https://mixpanel.github.io/fixpanel/deliverables/${file}`);
  });
}

async function main() {
  await copyOneoffs();
  await copyDeliverables();
}

main();
