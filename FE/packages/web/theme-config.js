#!/usr/bin/env node

/**
 * Theme Configuration Script
 * 
 * This script allows you to build the application with different themes.
 * Usage:
 *   node theme-config.js build [theme]
 *   node theme-config.js start [theme]
 * 
 * Available themes: plant, tech
 * Default theme: plant
 */

const { spawn } = require('child_process');
const path = require('path');

const availableThemes = ['plant', 'tech'];
const defaultTheme = 'plant';

function runCommand(command, args, env = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, ...env },
      cwd: __dirname
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
  });
}

async function main() {
  const [,, action, themeArg] = process.argv;
  
  if (!action || !['build', 'start'].includes(action)) {
    console.log('Usage: node theme-config.js [build|start] [theme]');
    console.log(`Available themes: ${availableThemes.join(', ')}`);
    console.log(`Default theme: ${defaultTheme}`);
    process.exit(1);
  }

  const theme = themeArg || defaultTheme;
  
  if (!availableThemes.includes(theme)) {
    console.error(`Invalid theme: ${theme}`);
    console.log(`Available themes: ${availableThemes.join(', ')}`);
    process.exit(1);
  }

  console.log(`🎨 Building with ${theme} theme...`);
  
  const env = {
    REACT_APP_THEME: theme
  };

  try {
    if (action === 'build') {
      await runCommand('npm', ['run', 'build'], env);
      console.log(`✅ Build completed with ${theme} theme`);
    } else if (action === 'start') {
      await runCommand('npm', ['start'], env);
    }
  } catch (error) {
    console.error(`❌ Command failed: ${error.message}`);
    process.exit(1);
  }
}

main().catch(console.error);
