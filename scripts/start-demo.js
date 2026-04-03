const { spawn } = require('child_process');
const path = require('path');
const waitOn = require('wait-on');
const open = require('open');

const processes = [];

function spawnProc(cwd, cmd, args, name) {
  const p = spawn(cmd, args, { cwd, shell: true, stdio: 'inherit' });
  processes.push(p);
  p.on('exit', (code) => {
    console.log(`${name} exited with ${code}`);
    // kill remaining
    processes.forEach((proc) => { try { proc.kill(); } catch (e) {} });
    process.exit(code);
  });
}

// Start backend and frontend
spawnProc(path.resolve(__dirname, '../backend'), 'npm', ['run', 'dev'], 'backend');
spawnProc(path.resolve(__dirname, '../frontend'), 'npm', ['run', 'dev'], 'frontend');

// Wait for both servers and open frontend
waitOn({ resources: ['http://localhost:5173', 'http://localhost:4000'], timeout: 60000 }, (err) => {
  if (err) {
    console.error('Servers did not become ready in time', err);
    return;
  }
  open('http://localhost:5173').catch(() => {});
});

process.on('SIGINT', () => {
  processes.forEach((p) => { try { p.kill(); } catch (e) {} });
  process.exit();
});
