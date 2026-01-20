const fs = require('fs-extra');
const path = require('path');

const ONEOFFS_DIR = path.join(__dirname, '../oneoffs');
const INDEX_FILE = path.join(ONEOFFS_DIR, 'index.html');

// Directories and files to exclude from listing
const EXCLUDE_PATTERNS = [
  'node_modules',
  '.DS_Store',
  'package.json',
  'package-lock.json',
  '.git',
  '.next',
  'dist'
];

/**
 * Scan the oneoffs directory and build a structure of folders and HTML files
 */
function scanOneoffsDirectory() {
  const structure = {};

  try {
    // Get all subdirectories in oneoffs/
    const items = fs.readdirSync(ONEOFFS_DIR);

    for (const item of items) {
      // Skip excluded patterns and the generated index.html at root
      if (EXCLUDE_PATTERNS.includes(item) || item === 'index.html') continue;

      const itemPath = path.join(ONEOFFS_DIR, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        // Scan for HTML files in this directory
        const files = fs.readdirSync(itemPath);
        const htmlFiles = files
          .filter(file => file.endsWith('.html') && !EXCLUDE_PATTERNS.includes(file))
          .sort(); // Sort alphabetically

        if (htmlFiles.length > 0) {
          structure[item] = htmlFiles;
        }
      }
    }
  } catch (error) {
    console.error('Error scanning oneoffs directory:', error);
    throw error;
  }

  // Sort folders alphabetically
  const sortedStructure = {};
  Object.keys(structure).sort().forEach(key => {
    sortedStructure[key] = structure[key];
  });

  return sortedStructure;
}

/**
 * Generate the HTML content for the index page
 */
function generateHTMLContent(structure) {
  const folderCount = Object.keys(structure).length;
  const fileCount = Object.values(structure).reduce((sum, files) => sum + files.length, 0);

  let foldersHtml = '';

  for (const [folder, files] of Object.entries(structure)) {
    // Create folder section
    foldersHtml += `
    <div class="folder">
      <div class="folder-header">
        <input type="checkbox" checked disabled>
        <span class="folder-icon">📁</span>
        <a href="./${folder}/" class="folder-name">${folder}/</a>
      </div>
      <div class="file-list">`;

    // Add HTML files for this folder
    for (const file of files) {
      const displayName = file === 'index.html' ? file : file;
      const className = file === 'index.html' ? 'file-item main-file' : 'file-item';
      foldersHtml += `
        <div class="${className}">
          <input type="checkbox" disabled>
          <span class="file-icon">📄</span>
          <a href="./${folder}/${file}">${displayName}</a>
        </div>`;
    }

    foldersHtml += `
      </div>
    </div>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Index of oneoffs/</title>
  <style>
    :root {
      --bg-primary: #0d0d0d;
      --bg-secondary: #1a1a1a;
      --text-primary: #e5e5e5;
      --text-secondary: #999;
      --link-color: #60a5fa;
      --link-hover: #93bbfc;
      --border-color: #333;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      background: var(--bg-primary);
      color: var(--text-primary);
      font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
      line-height: 1.6;
      min-height: 100vh;
    }

    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem;
    }

    h1 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border-color);
      font-weight: normal;
    }

    .stats {
      color: var(--text-secondary);
      font-size: 0.875rem;
      margin-bottom: 2rem;
    }

    .folder {
      margin-bottom: 1.5rem;
      background: var(--bg-secondary);
      border-radius: 0.5rem;
      padding: 1rem;
      border: 1px solid var(--border-color);
    }

    .folder-header {
      display: flex;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .folder-icon, .file-icon {
      margin: 0 0.5rem;
      font-size: 1.1rem;
    }

    .folder-name {
      font-weight: bold;
      color: var(--link-color);
      text-decoration: none;
      font-size: 1.05rem;
    }

    .folder-name:hover {
      color: var(--link-hover);
      text-decoration: underline;
    }

    .file-list {
      margin-left: 2.5rem;
    }

    .file-item {
      display: flex;
      align-items: center;
      padding: 0.25rem 0;
    }

    .file-item.main-file {
      font-weight: 600;
    }

    .file-item a {
      color: var(--link-color);
      text-decoration: none;
    }

    .file-item a:hover {
      color: var(--link-hover);
      text-decoration: underline;
    }

    input[type="checkbox"] {
      cursor: not-allowed;
      margin-right: 0.5rem;
      width: 14px;
      height: 14px;
      accent-color: var(--link-color);
    }

    .footer {
      margin-top: 3rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border-color);
      color: var(--text-secondary);
      font-size: 0.875rem;
      text-align: center;
    }

    @media (max-width: 640px) {
      .container {
        padding: 1rem;
      }

      .folder {
        padding: 0.75rem;
      }

      .file-list {
        margin-left: 2rem;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Index of oneoffs/</h1>
    <div class="stats">${folderCount} folders, ${fileCount} HTML files</div>
    ${foldersHtml}
    <div class="footer">
      Generated on ${new Date().toISOString().split('T')[0]} • <a href="https://github.com/mixpanel/fixpanel" style="color: var(--link-color);">View on GitHub</a>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Main function to generate the oneoffs index
 */
async function generateOneoffsIndex() {
  console.log('🎨 Generating oneoffs index page...\n');

  try {
    // Check if oneoffs directory exists
    if (!fs.existsSync(ONEOFFS_DIR)) {
      console.log('⚠️  No oneoffs directory found. Skipping index generation...');
      return;
    }

    // Scan the directory structure
    console.log('  📂 Scanning oneoffs directory...');
    const structure = scanOneoffsDirectory();

    const folderCount = Object.keys(structure).length;
    const fileCount = Object.values(structure).reduce((sum, files) => sum + files.length, 0);

    if (folderCount === 0) {
      console.log('⚠️  No oneoff microsites found. Skipping index generation...');
      return;
    }

    console.log(`  📊 Found ${folderCount} folders with ${fileCount} HTML files`);

    // Generate HTML content
    console.log('  ✏️  Generating HTML content...');
    const htmlContent = generateHTMLContent(structure);

    // Write the index file
    console.log('  💾 Writing index.html...');
    await fs.writeFile(INDEX_FILE, htmlContent, 'utf8');

    console.log('\n✅ Oneoffs index generated successfully!');
    console.log(`📍 Index location: ${INDEX_FILE}`);

    // Log the discovered structure
    console.log('\n📋 Indexed microsites:');
    for (const [folder, files] of Object.entries(structure)) {
      console.log(`   ├─ ${folder}/ (${files.length} files)`);
      files.forEach((file, index) => {
        const isLast = index === files.length - 1;
        console.log(`   │  ${isLast ? '└─' : '├─'} ${file}`);
      });
    }

  } catch (error) {
    console.error('❌ Error generating oneoffs index:', error.message);
    throw error;
  }
}

// Export for use in other scripts
module.exports = generateOneoffsIndex;

// Run if called directly
if (require.main === module) {
  generateOneoffsIndex().catch(err => {
    console.error(err);
    process.exit(1);
  });
}