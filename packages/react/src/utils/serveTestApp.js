#!/bin/node

const { spawn } = require('child_process');

const serve = spawn('npx serve -s', { shell: true });

serve.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
  serve.kill();
});

serve.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
  serve.kill();
});

serve.on('error', (error) => {
  console.log(`error: ${error.message}`);
});

serve.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
