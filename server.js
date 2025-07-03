const express = require('express');
const auth = require('basic-auth');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT | 3000;
const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;
const PUBLIC_URL = process.env.PUBLIC_URL;

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

// POST endpoint for Music Assistant to push URL
app.post('/ma/push-url', (req, res) => {
  const { streamUrl } = req.body;

  if (!streamUrl) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  console.log('Received URL:', streamUrl);
  if (PUBLIC_URL !== undefined) {
    const publicUrl = streamUrl.replace(/^[^:]+:\/\/[^/]+/, PUBLIC_URL);
    console.log('Replaced with Public URL:', publicUrl);
    obj = { publicUrl };
  } else {
    obj = { streamUrl };
  }
  res.json({ status: 'ok' });
});

// GET endpoint for Alexa skill to fetch latest URL
app.get('/ma/latest-url', (req, res) => {
  if (!obj) {
    return res.status(404).json({ error: 'No URL available' });
  }

  res.json({
    streamUrl: obj.streamUrl,
  });
});

app.listen(PORT, () => {
  console.log(`MA-Alexa API running on port ${PORT}`);
});
