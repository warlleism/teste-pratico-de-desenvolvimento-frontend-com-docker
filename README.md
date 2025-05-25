## Startar Projeto

```bash
npm install
# ou
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

## Docker

Docker build/run:

```bash
docker build -t dikma-platform .
# e
docker run -d -p 18649:18649 --name dikma-container dikma-platform
```

## Testes

```bash

$ npm run test

```

## Deploy

```bash

$ Em um cerário real trabalharia com a ideia de um fluxo de CI/CD com Github Actions + AWS S3

```
