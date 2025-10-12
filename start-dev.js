#!/usr/bin/env node

const { spawn } = require('child_process');
const net = require('net');

// Function to check if a port is available
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.listen(port, () => {
      server.once('close', () => {
        resolve(true);
      });
      server.close();
    });
    
    server.on('error', () => {
      resolve(false);
    });
  });
}

// Function to find the next available port starting from a given port
async function findAvailablePort(startPort = 3000) {
  let port = startPort;
  
  while (port < 65535) {
    const available = await isPortAvailable(port);
    if (available) {
      return port;
    }
    port++;
  }
  
  throw new Error('No available ports found');
}

// Main function
async function startDev() {
  try {
    console.log('🔍 Looking for available port...');
    const port = await findAvailablePort(3000);
    console.log(`✅ Found available port: ${port}`);
    console.log(`🚀 Starting dev server on http://localhost:${port}`);
    
    // Start the dev server with the found port
    const devProcess = spawn('npm', ['run', 'dev', '--', '--port', port.toString()], {
      stdio: 'inherit',
      shell: true
    });
    
    // Handle process termination
    process.on('SIGINT', () => {
      console.log('\n👋 Shutting down dev server...');
      devProcess.kill('SIGINT');
      process.exit(0);
    });
    
    devProcess.on('error', (error) => {
      console.error('❌ Error starting dev server:', error);
      process.exit(1);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
startDev();
