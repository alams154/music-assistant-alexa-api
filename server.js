const express = require('express');
const auth = require('basic-auth');
const bodyParser = require('body-parser');

const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;

process.on('SIGINT', () => {
  console.log('Received SIGINT. Exiting...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Exiting...');
  process.exit(0);
});

app.use(bodyParser.json());

// Serve workspace favicon at /favicon.ico
app.get('/favicon.ico', (req, res) => {
  return res.sendFile(path.join(__dirname, 'favicon.ico'));
});

let obj = null;

if (USERNAME !== undefined && PASSWORD !== undefined) {
  console.log(`auth activated`);
  app.use((req, res, next) => {
    const credentials = auth(req);

    if (
      !credentials ||
      credentials.name !== USERNAME ||
      credentials.pass !== PASSWORD
    ) {
      res.set('WWW-Authenticate', 'Basic realm="music-assistant-alexa-api"');
      return res.status(401).send('Access denied');
    }

    next();
  });
}

// POST endpoint for Music Assistant to push URL and metadata
app.post('/ma/push-url', (req, res) => {
  const { streamUrl, title, artist, album, imageUrl } = req.body;

  if (!streamUrl) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  obj = { streamUrl, title, artist, album, imageUrl };
  console.log('Received:', obj);
  res.json({ status: 'ok' });
});

// GET endpoint for Alexa skill to fetch latest URL and metadata
app.get('/ma/latest-url', (req, res) => {
  if (!obj) {
    return res.status(404).json({ error: 'No URL available, please check if Music Assistant has pushed a URL to the API' });
  }

  const payload = {
    streamUrl: obj.streamUrl,
    title: obj.title,
    artist: obj.artist,
    album: obj.album,
    imageUrl: obj.imageUrl,
  };

  // If the client prefers HTML (a browser), return a small HTML page
  // that includes a favicon so the tab shows an icon. API clients
  // requesting JSON will continue to receive the unchanged JSON payload.
  if (req.accepts && req.accepts('html')) {
    res.set('Content-Type', 'text/html; charset=utf-8');
    return res.send(`<!doctype html><html><head><meta charset="utf-8"><title>MA Latest URL</title><link rel="icon" href="/favicon.ico"></head><body><pre>${JSON.stringify(payload, null, 2)}</pre></body></html>`);
  }

  // Default: return JSON for API consumers
  res.json(payload);
});

app.listen(PORT, () => {
  console.log(`MA-Alexa API running on port ${PORT}`);
});
