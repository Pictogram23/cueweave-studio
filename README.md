````md
# CueWeave Studio

CueWeave Studio is a browser-based audio behavior authoring application for CueWeave.

## Status

CueWeave Studio is in the early prototype stage and is not ready for production use.

## Overview

CueWeave Studio is intended to allow sound designers to define audio behavior in a web browser without directly editing Unity project code.

Planned features include:

- Defining audio events
- Assigning audio files
- Configuring playback behavior
- Adding conditions and parameters
- Previewing audio behavior in the browser
- Exporting CueWeave project data for use in Unity

## Planned Workflow

```text
Sound Designer
    ↓
CueWeave Studio
    ↓ CueWeave project data
CueWeave Runtime
    ↓
Unity AudioSource / AudioMixer
```

Audio files and project data should be processed locally in the browser whenever possible.

The initial version does not require:

- User accounts
- A backend server
- Cloud storage
- Uploading unpublished audio files to an external service

## Technology

- TypeScript
- React
- Vite
- Web Audio API

## Development

Use Node.js through `nvm`.

```sh
nvm use
npm install
npm run dev
```

The development server is normally available at:

```text
http://localhost:5173/
```

## Build

```sh
npm run build
```

The production build is generated in the following directory:

```text
dist/
```

## Lint

```sh
npm run lint
```

## Related Repository

The CueWeave runtime and format specification are maintained in the `cueweave` repository.

## License

CueWeave Studio is licensed under the Zero-Clause BSD License (`0BSD`).
````