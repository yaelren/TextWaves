#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Colors for terminal output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkPortInUse(port) {
  return new Promise((resolve) => {
    const command = process.platform === 'win32' 
      ? `netstat -an | findstr :${port}`
      : `lsof -i :${port}`;
    
    exec(command, (error, stdout) => {
      if (error || !stdout.trim()) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

function getProcessOnPort(port) {
  return new Promise((resolve) => {
    if (process.platform === 'win32') {
      // Windows command to get process info
      exec(`netstat -ano | findstr :${port}`, (error, stdout) => {
        if (error || !stdout.trim()) {
          resolve(null);
          return;
        }
        const lines = stdout.trim().split('\n');
        const pid = lines[0].split(/\s+/).pop();
        exec(`tasklist /FI "PID eq ${pid}" /FO CSV`, (err, out) => {
          if (!err && out) {
            const processInfo = out.split('\n')[1];
            if (processInfo) {
              const processName = processInfo.split('","')[0].replace('"', '');
              resolve({ pid, name: processName });
            } else {
              resolve({ pid, name: 'Unknown' });
            }
          } else {
            resolve({ pid, name: 'Unknown' });
          }
        });
      });
    } else {
      // Unix-like systems
      exec(`lsof -i :${port} -t`, (error, stdout) => {
        if (error || !stdout.trim()) {
          resolve(null);
          return;
        }
        const pid = stdout.trim().split('\n')[0];
        exec(`ps -p ${pid} -o comm=`, (err, out) => {
          const processName = err ? 'Unknown' : out.trim();
          resolve({ pid, name: processName });
        });
      });
    }
  });
}

function killProcess(pid) {
  return new Promise((resolve) => {
    const killCommand = process.platform === 'win32' 
      ? `taskkill /PID ${pid} /F`
      : `kill -9 ${pid}`;
    
    exec(killCommand, (error) => {
      resolve(!error);
    });
  });
}

function findAvailablePort(startPort = 8001, endPort = 8010) {
  return new Promise(async (resolve) => {
    for (let port = startPort; port <= endPort; port++) {
      const inUse = await checkPortInUse(port);
      if (!inUse) {
        resolve(port);
        return;
      }
    }
    resolve(null);
  });
}

function askUser(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.toLowerCase().trim());
    });
  });
}

function startServer(port) {
  console.log('');
  console.log('='.repeat(60));
  log('bold', '🚀 CHATOOLY DEV SERVER IS RUNNING!');
  console.log('='.repeat(60));
  console.log('');
  
  // Main URL display - very prominent
  log('bold', '🌐 YOUR TOOL IS LIVE AT:');
  console.log('');
  log('green', '┌─────────────────────────────────────────────────────────┐');
  log('green', '│                                                         │');
  log('green', `│    🔗 http://localhost:${port}    │`);
  log('green', '│                                                         │');
  log('green', '└─────────────────────────────────────────────────────────┘');
  console.log('');
  
  log('yellow', '📱 Quick Access:');
  log('blue', `   • Local: http://localhost:${port}`);
  log('blue', `   • Network: http://[your-ip]:${port}`);
  console.log('');
  
  log('bold', '🎨 Ready to build your tool!');
  log('green', '   • Open the link above in your browser');
  log('green', '   • Refresh browser to see changes');
  log('green', '   • Check browser console for errors'); 
  log('green', '   • Press Ctrl+C to stop server');
  console.log('');
  console.log('='.repeat(60));
  console.log('');
  
  // Try Python 3 first, then Python 2
  const pythonCommand = process.platform === 'win32' ? 'python' : 'python3';
  const server = spawn(pythonCommand, ['-m', 'http.server', port.toString()], {
    stdio: 'inherit'
  });

  server.on('error', (err) => {
    if (err.code === 'ENOENT') {
      log('yellow', 'Python 3 not found, trying python...');
      const fallbackServer = spawn('python', ['-m', 'http.server', port.toString()], {
        stdio: 'inherit'
      });
      
      fallbackServer.on('error', (fallbackErr) => {
        log('red', '❌ Error: Python is required to run the dev server');
        log('yellow', '💡 Please install Python from https://python.org');
        log('yellow', '💡 Or use: npm install -g http-server && http-server');
        process.exit(1);
      });
    }
  });

  // Handle Ctrl+C gracefully
  process.on('SIGINT', () => {
    console.log('');
    log('yellow', '🛑 Shutting down dev server...');
    log('green', '✅ Server stopped. Happy building! 🎨');
    console.log('');
    server.kill();
    rl.close();
    process.exit(0);
  });
}

async function main() {
  const preferredPort = 8000;
  
  console.log('');
  log('bold', '🛠️  CHATOOLY DEV SERVER');
  log('blue', '   Starting your development environment...');
  console.log('');

  // Check if preferred port is available
  const portInUse = await checkPortInUse(preferredPort);
  
  if (!portInUse) {
    // Port is free, start server
    startServer(preferredPort);
    return;
  }

  // Port is in use, get process info
  log('yellow', `⚠️  Port ${preferredPort} is already in use`);
  
  const processInfo = await getProcessOnPort(preferredPort);
  if (processInfo) {
    log('red', `   Process: ${processInfo.name} (PID: ${processInfo.pid})`);
  }

  console.log('');
  log('blue', 'What would you like to do?');
  console.log('  1. Kill the process and use port 8000');
  console.log('  2. Use a different port automatically');
  console.log('  3. Cancel');
  console.log('');

  const choice = await askUser('Enter your choice (1/2/3): ');

  if (choice === '1') {
    if (processInfo) {
      log('yellow', `Attempting to kill process ${processInfo.name} (${processInfo.pid})...`);
      const killed = await killProcess(processInfo.pid);
      
      if (killed) {
        log('green', '✅ Process killed successfully');
        // Wait a moment for the port to be released
        await new Promise(resolve => setTimeout(resolve, 1000));
        startServer(preferredPort);
      } else {
        log('red', '❌ Failed to kill process. You may need to stop it manually.');
        log('yellow', 'Falling back to alternative port...');
        const altPort = await findAvailablePort();
        if (altPort) {
          startServer(altPort);
        } else {
          log('red', '❌ No available ports found');
          process.exit(1);
        }
      }
    } else {
      log('red', '❌ Could not identify the process using port 8000');
      process.exit(1);
    }
  } else if (choice === '2') {
    const altPort = await findAvailablePort();
    if (altPort) {
      log('green', `✅ Found available port: ${altPort}`);
      startServer(altPort);
    } else {
      log('red', '❌ No available ports found in range 8001-8010');
      process.exit(1);
    }
  } else {
    log('yellow', '👋 Cancelled');
    rl.close();
    process.exit(0);
  }
}

// Handle errors
process.on('uncaughtException', (error) => {
  log('red', `❌ Unexpected error: ${error.message}`);
  rl.close();
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  log('red', `❌ Unhandled promise rejection: ${error.message}`);
  rl.close();
  process.exit(1);
});

main();