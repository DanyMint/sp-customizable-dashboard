import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

// Define __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path configuration
const REPO_URL = 'https://github.com/super-productivity/super-productivity.git';
const BRANCH = 'v18.1.3';
const CACHE_DIR = path.join(os.homedir(), '.cache', 'super-productivity');
const PROJECT_ROOT = path.join(__dirname, '..');
const DEPS_DEST = path.join(PROJECT_ROOT, 'sp-deps');

/**
 * Executes a shell command with logging and error handling
 */
function runCommand(command, options = {}) {
  console.log(`\x1b[36m> Running: ${command}\x1b[0m`);
  try {
    execSync(command, { stdio: 'inherit', ...options });
  } catch (error) {
    console.error(`\x1b[31m[ERROR] Command failed: ${command}\x1b[0m`);
    process.exit(1);
  }
}

/**
 * Main setup process
 */
async function setup() {
  // 1. Repository check
  if (!fs.existsSync(CACHE_DIR)) {
    console.log('\x1b[33m[1/4] Cloning Super Productivity repository...\x1b[0m');
    runCommand(`git clone --branch ${BRANCH} --depth 1 ${REPO_URL} "${CACHE_DIR}"`);
  } else {
    console.log('\x1b[32m[SKIP] Repository already exists in .cache\x1b[0m');
  }

  // 2. Cache dependencies check and build
  const cacheNodeModules = path.join(CACHE_DIR, 'node_modules');
  if (!fs.existsSync(cacheNodeModules)) {
    console.log('\n\x1b[33m[2/4] Installing cache dependencies...\x1b[0m');
    runCommand('npm install', { cwd: CACHE_DIR });
  } else {
    console.log('\x1b[32m[SKIP] Cache dependencies already installed\x1b[0m');
  }

  // Build plugins check (verifying dist folder in one of the packages)
  const pluginApiDist = path.join(CACHE_DIR, 'packages/plugin-api/dist');
  if (!fs.existsSync(pluginApiDist)) {
    console.log('\x1b[33mBuilding plugins...\x1b[0m');
    runCommand('npm run plugins:build', { cwd: CACHE_DIR });
  } else {
    console.log('\x1b[32m[SKIP] Plugins already built\x1b[0m');
  }

  // 3. Copying artifacts
  const packagesToCopy = [
    { src: 'packages/plugin-api', dest: 'plugin-api' },
    { src: 'packages/vite-plugin', dest: 'vite-plugin' }
  ];

  let needsCopy = false;
  packagesToCopy.forEach(pkg => {
    if (!fs.existsSync(path.join(DEPS_DEST, pkg.dest))) {
      needsCopy = true;
    }
  });

  if (needsCopy) {
    console.log('\n\x1b[33m[3/4] Copying artifacts...\x1b[0m');
    packagesToCopy.forEach(pkg => {
      const srcPath = path.join(CACHE_DIR, pkg.src);
      const destPath = path.join(DEPS_DEST, pkg.dest);

      if (!fs.existsSync(srcPath)) {
        console.error(`\x1b[31mSource not found: ${srcPath}\x1b[0m`);
        process.exit(1);
      }

      console.log(`Copying ${pkg.src} -> ${destPath}`);
      if (fs.existsSync(destPath)) {
        fs.rmSync(destPath, { recursive: true, force: true });
      }
      fs.mkdirSync(destPath, { recursive: true });
      fs.cpSync(srcPath, destPath, { recursive: true, force: true });
    });
  } else {
    console.log('\x1b[32m[SKIP] Artifacts already present in sp-deps\x1b[0m');
  }

  // 4. Final project installation
  if (!fs.existsSync(path.join(PROJECT_ROOT, 'node_modules'))) {
    console.log('\n\x1b[33m[4/4] Final project installation...\x1b[0m');
    runCommand('npm install', { cwd: PROJECT_ROOT });
  } else {
    console.log('\x1b[32m[SKIP] Project dependencies already installed\x1b[0m');
  }

  console.log('\n\x1b[32m✅ Setup complete!\x1b[0m');
}

setup();
