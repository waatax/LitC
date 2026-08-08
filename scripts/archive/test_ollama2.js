import http from 'http';
const req = http.request({
  hostname: '127.0.0.1',
  port: 11434,
  path: '/api/generate',
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
}, res => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => console.log('Response:', body));
});
req.on('error', console.error);
req.write(JSON.stringify({ model: 'gemma4-hermes-local:latest', prompt: 'Hi', stream: false }));
req.end();