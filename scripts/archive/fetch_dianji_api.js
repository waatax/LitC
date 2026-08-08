import https from 'https';

const agent = new https.Agent({ rejectUnauthorized: false });

const apiUrl = 'https://www.dianji.fun/api/jp6WI6aO0fKxDoEd28sg6J93MB0WKTDF4cWk6o_HPSJHxO5Ew-VffO5hlv1vIEki-RaKdzrxINqLsQ==';

https.get(apiUrl, { agent, headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Data len: ${data.length}`);
    import('fs').then(fs => {
      fs.default.writeFileSync('scratch/dianji_api_response.json', data, 'utf8');
      console.log('Saved scratch/dianji_api_response.json');
    });
  });
}).on('error', console.error);
