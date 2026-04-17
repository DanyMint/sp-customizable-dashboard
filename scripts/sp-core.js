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
 * Asserts that a path exists, otherwise throws a descriptive error
 */
function assertPathExists(filePath, context) {
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `Required artifact missing: ${filePath}\n` +
      `Context: ${context}\n` +
      `Hint: The build process might have failed or the cache is corrupted. ` +
      `Try deleting the cache directory (rm -rf ${CACHE_DIR}) and running the script again, or check the 'npm run plugins:build' output above.`
    );
  }
}

/**
 * Executes a shell command with logging and error handling
 */
function runCommand(command, options = {}) {
  console.log(`\x1b[36m> Running: ${command}\x1b[0m`);
  try {
    execSync(command, { stdio: 'inherit', ...options });
  } catch (error) {
    // Throwing error to be caught by the global setup().catch()
    throw new Error(`Command execution failed: ${command}`);
  }
}

/**
 * Main setup process
 */
async function setup() {
  const args = process.argv.slice(2);
  if (args.includes('--clean')) {
    console.log('\x1b[33m[CLEAN] Removing local and cached artifacts...\x1b[0m');
    const toRemove = [
      DEPS_DEST,
      CACHE_DIR,
      path.join(PROJECT_ROOT, 'node_modules')
    ];

    toRemove.forEach(dir => {
      if (fs.existsSync(dir)) {
        console.log(`- Removing: ${dir}`);
        fs.rmSync(dir, { recursive: true, force: true });

        // Restore .gitkeep if sp-deps was removed
        if (dir === DEPS_DEST) {
          fs.mkdirSync(dir, { recursive: true });
          fs.writeFileSync(path.join(dir, '.gitkeep'), '');
        }
      }
    });
    console.log('\x1b[32m[CLEAN] Done.\x1b[0m');

    if (args.length === 1 && args[0] === '--clean') {
      return;
    }
  }

  const packagesToCopy = [
    { src: 'packages/plugin-api', dest: 'plugin-api' },
    { src: 'packages/vite-plugin', dest: 'vite-plugin' }
  ];

  // BOTTOM-UP CHECK: Check if local sp-deps are already populated
  const allArtifactsPresent = packagesToCopy.every(pkg => 
    fs.existsSync(path.join(DEPS_DEST, pkg.dest, 'package.json')) &&
    fs.existsSync(path.join(DEPS_DEST, pkg.dest, 'dist'))
  );

  if (allArtifactsPresent) {
    console.log('\x1b[32m[SKIP] All artifacts already present in sp-deps. Skipping repository sync and build.\x1b[0m');
  } else {
    console.log('\x1b[34mArtifacts missing or incomplete. Starting sync process...\x1b[0m');

    // 1. Repository check
    if (!fs.existsSync(CACHE_DIR)) {
      console.log('\x1b[33m[1/3] Cloning Super Productivity repository...\x1b[0m');
      runCommand(`git clone --branch ${BRANCH} --depth 1 ${REPO_URL} "${CACHE_DIR}"`);
    } else {
      console.log('\x1b[32m[SKIP] Repository already exists in .cache\x1b[0m');
    }

    // 2. Cache dependencies check and build
    const cacheNodeModules = path.join(CACHE_DIR, 'node_modules');
    if (!fs.existsSync(cacheNodeModules)) {
      console.log('\n\x1b[33m[2/3] Installing cache dependencies...\x1b[0m');
      runCommand('npm install', { cwd: CACHE_DIR });
    } else {
      console.log('\x1b[32m[SKIP] Cache dependencies already installed\x1b[0m');
    }

    // Build plugins check (verifying dist folder for each package)
    packagesToCopy.forEach(pkg => {
      const pkgPath = path.join(CACHE_DIR, pkg.src);
      const distPath = path.join(pkgPath, 'dist');

      if (!fs.existsSync(distPath)) {
        console.log(`\x1b[33mBuilding package: ${pkg.src}...\x1b[0m`);
        runCommand('npm run build', { cwd: pkgPath });
      } else {
        console.log(`\x1b[32m[SKIP] Package ${pkg.src} already built\x1b[0m`);
      }
    });

    // 3. Copying artifacts
    console.log('\n\x1b[33m[3/3] Copying artifacts to sp-deps...\x1b[0m');
    
    // Explicitly verify all sources before starting destructive operations (like rmSync)
    packagesToCopy.forEach(pkg => {
      const srcPath = path.join(CACHE_DIR, pkg.src);
      assertPathExists(srcPath, `Source artifact for "${pkg.dest}" not found in cache after build step.`);
    });

    packagesToCopy.forEach(pkg => {
      const srcPath = path.join(CACHE_DIR, pkg.src);
      const destPath = path.join(DEPS_DEST, pkg.dest);

      console.log(`Copying ${pkg.src} -> ${destPath}`);
      if (fs.existsSync(destPath)) {
        fs.rmSync(destPath, { recursive: true, force: true });
      }
      fs.mkdirSync(destPath, { recursive: true });
      fs.cpSync(srcPath, destPath, { recursive: true, force: true });
    });
  }

  // 4. Final project installation
  if (!fs.existsSync(path.join(PROJECT_ROOT, 'node_modules'))) {
    console.log('\n\x1b[33mFinal project installation...\x1b[0m');
    runCommand('npm install', { cwd: PROJECT_ROOT });
  } else {
    console.log('\x1b[32m[SKIP] Project dependencies already installed\x1b[0m');
  }

  console.log('\n\x1b[32m✅ Setup complete!\x1b[0m');
}

/**
 * Execution and Fatal Error Handling
 */
setup().catch(error => {
  console.error('\n\x1b[31m[FATAL ERROR] The setup process failed unexpectedly!\x1b[0m');
  console.error(`\x1b[31mReason: ${error.message}\x1b[0m`);
  
  if (error.stack) {
    console.error('\n\x1b[2m--- Technical Details ---\x1b[0m');
    console.error(error.stack);
  }

  process.exit(1);
});
