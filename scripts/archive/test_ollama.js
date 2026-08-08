
const url = 'http://127.0.0.1:11434/api/generate';
const data = {
  model: 'qwen3.6:latest',
  prompt: 'Translate ²ø¤l into traditional Chinese',
  stream: false
};
fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
  .then(r => r.json())
  .then(j => console.log(j.response))
  .catch(console.error);

