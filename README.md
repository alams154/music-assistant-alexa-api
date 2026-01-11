<h2 style="color: white; margin: 0;">🚨 PROJECT HAS MOVED 🚨</h2>
<h3 style="color: white; margin: 10px 0;">⚠️ THIS REPOSITORY IS NO LONGER ACTIVELY DEVELOPED ⚠️</h3>
<h3 style="color: white; margin: 10px 0;">⚠️ PLEASE MIGRATE TO THE <a href="https://github.com/alams154/music-assistant-alexa-skill-prototype">PROTOTYPE SKILL</a> ⚠️</h3>

# Music Assistant Alexa API

![Supports aarch64 Architecture][aarch64-shield]
![Supports amd64 Architecture][amd64-shield]
![Supports armhf Architecture][armhf-shield]
![Supports armv7 Architecture][armv7-shield]
![Supports i386 Architecture][i386-shield]

This project provides a simple REST API bridge between [Music Assistant](https://github.com/music-assistant) and an Alexa skill. It allows Music Assistant to push a stream URL, which can then be fetched by an Alexa skill.

## Features

- **POST /ma/push-url**  
  Accepts a JSON payload with a `streamUrl` to store the latest stream URL.

- **GET /ma/latest-url**  
  Returns the most recently pushed `streamUrl` for Alexa to consume.

- **Basic Auth**  
  Basic authentication when USERNAME and PASSWORD environment variables are provided. This can also be accomplished with a reverse proxy instead.

## Installation Options

### Option 1: Home Assistant Addon (Recommended)

This project is available as a **Home Assistant addon** for easy integration:

1. Add this repository to your Home Assistant addon store: `https://github.com/mcinnes01/music-assistant-alexa-api`
2. Install the "Music Assistant Alexa API Addon" addon
3. Configure the addon with your credentials:
   ```yaml
   username: your_username
   password: your_password
   port: 3000
   ```
4. Start the addon

The addon provides the same API functionality with automatic integration into your Home Assistant environment.

### Option 2: Standalone Docker Container

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
   docker build -f Dockerfile.api -t music-assistant-alexa-api .
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
- `Dockerfile` — Home Assistant addon Dockerfile.
- `Dockerfile.api` — Standalone Docker container Dockerfile.
- `package.json` — Project metadata and dependencies.
- `config.yaml` — Home Assistant addon configuration.
- `repository.yaml` — Home Assistant addon repository configuration.

## License

MIT

[aarch64-shield]: https://img.shields.io/badge/aarch64-yes-green.svg
[amd64-shield]: https://img.shields.io/badge/amd64-yes-green.svg
[armhf-shield]: https://img.shields.io/badge/armhf-yes-green.svg
[armv7-shield]: https://img.shields.io/badge/armv7-yes-green.svg
[i386-shield]: https://img.shields.io/badge/i386-yes-green.svg
