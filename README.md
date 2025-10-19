# Music Assistant Alexa API

This project provides a simple REST API bridge between [Music Assistant](https://github.com/music-assistant) and an Alexa skill. It allows Music Assistant to push a stream URL, which can then be fetched by an Alexa skill.

## Features

- **POST /ma/push-url**  
  Accepts a JSON payload with a `streamUrl` to store the latest stream URL.

- **GET /ma/latest-url**  
  Returns the most recently pushed `streamUrl` for Alexa to consume.

- **Basic Auth**  
  Basic authentication when USERNAME and PASSWORD environment variables are provided. This can also be accomplished with a reverse proxy instead.

## Environment Variables
- **PUBLIC_DOMAIN**: _OPTIONAL_ The domain to use if used with a reverse proxy. If not provided, the domain will use the provided streamURL from POST request.
- **PORT**: _OPTIONAL_ The port to listen on. Defaults to `3000`.
- **USERNAME**: _OPTIONAL_ The username to use for basic authentication.
- **PASSWORD**: _OPTIONAL_ The password to use for basic authentication. 

## Usage

### Running Locally

1. **Install dependencies:**

   ```sh
   npm install
   ```

2. **Start the server:**

   ```sh
   npm start
   ```

   By default, the server listens on port `3000`. You can override this with the `PORT` environment variable:

   ```sh
   PORT=8080 npm start
   ```

   By default, the server is available without authentication. As this is insecure because the api must be publicly available. You can add basic authentication with the `USERNAME` and `PASSWORD` environment variables:

   ```sh
   USERNAME=admin PASSWORD=test npm start
   ```

### Building and Running with Docker

1. **Build the image:**

   ```sh
   docker build -t music-assistant-alexa-api .
   ```

2. **Run the container:**

   ```sh
   docker run --rm -d -p 3000:3000 music-assistant-alexa-api
   ```

   You can provide the environment variables like this:

   ```sh
   docker run --rm -d -e PORT=8080 -e USERNAME=admin -e PASSWORD=test -p 8080:8080 music-assistant-alexa-api
   ```

### Using GitHub Container Registry (GHCR) and Docker Run

1. **Pull the image from GitHub Container Registry (GHCR):**

    ```sh
    docker pull ghcr.io/alams154/music-assistant-alexa-api:latest
    ```

2. **Run the container:**

    ```sh
    docker run --rm -d -p 3000:3000 -e USERNAME=admin -e PASSWORD=test ghcr.io/alams154/music-assistant-alexa-api:latest
    ```

### Using GitHub Container Registry (GHCR) and Docker Compose

```yaml
services:
  music-assistant-alexa-api:
    image: ghcr.io/alams154/music-assistant-alexa-api:latest
    ports:
      - "3000:3000"
    environment:
      - USERNAME=admin
      - PASSWORD=test
```

## API

Returns 401 Unauthorized when the authentication environment variables are provided and the requests does not provide  correct credentials.

### POST `/ma/push-url`

**Body:**

```json
{
  "streamUrl": "https://example.com/stream.mp3"
}
```

**Response:**

```json
{ "status": "ok" }
```

### GET `/ma/latest-url`

**Response:**

```json
{
  "streamUrl": "https://example.com/stream.mp3"
}
```

Returns `404` if no URL has been pushed yet.

## Files

- `server.js` — Express server with the API endpoints.
- `Dockerfile` — For containerizing the app.
- `package.json` — Project metadata and dependencies.

## License

MIT
