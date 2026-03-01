const https = require('https');

https.get('https://api.rss2json.com/v1/api.json?rss_url=https://feeds.npr.org/1014/rss.xml', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const json = JSON.parse(data);
    console.log(JSON.stringify(json.items.slice(0, 2), null, 2));
  });
});
