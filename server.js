const express = require('express');
const auth = require('basic-auth');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;
const REWRITE_STREAM_URL_SCHEME = process.env.REWRITE_STREAM_URL_SCHEME;

process.on('SIGINT', () => {
  console.log('Received SIGINT. Exiting...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Exiting...');
  process.exit(0);
});

app.use(bodyParser.json());

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

  let streamUrl = obj.streamUrl;
  if (REWRITE_STREAM_URL_SCHEME && streamUrl) {
    try {
      const url = new URL(streamUrl);
      url.protocol = REWRITE_STREAM_URL_SCHEME;
      streamUrl = url.toString();
    } catch (e) {
      console.error('Failed to rewrite stream URL scheme', e);
    }
  }

  res.json({
    streamUrl: streamUrl,
    title: obj.title,
    artist: obj.artist,
    album: obj.album,
    imageUrl: obj.imageUrl,
  });
});

app.listen(PORT, () => {
  console.log(`MA-Alexa API running on port ${PORT}`);
});
