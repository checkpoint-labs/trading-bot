# Starknet Trading bot

This repo is a [Checkpoint](https://checkpoint.fyi) template that tracks a price from a pair address and allows you to defines actions on it (stop loss, take profit...)

## Getting started

Create a copy of this repository by clicking **'Use this template'** button or clicking [this
link](https://github.com/snapshot-labs/token-api-checkpoint/generate).

**Requirements**

- Node.js (>= 16.x.x)
- Docker with `docker-compose`
- Yarn

> You can also use npm, just make sure to replace the subsequent 'yarn' commands with their npm equivalent.

After cloning this project, run the following command to install dependencies:

```bash
yarn # or 'npm install'
```

Next, you'll need a MySQL server running and a connection string available as environment variable `DATABASE_URL`.
You can use `docker-compose` to set up default MySQL server in container:

```bash
docker-compose up -d
```

> For local development, you can create a .env file from the .env.example file and the application will read the values on startup.

## Test it

To test it you need to setup 2 environment variables:

```bash
PAIR=<PAIR_ADDRESS>
TARGET=<TARGET_PRICE>
```

> You can use `0x04d0390b777b424e43839cd1e744799f3de6c176c7e32c1812a41dbd9c19db6a` ETH/USDC pair from JediSwap. And set the starting block to 10796 and the target to 10.

Next, start up the server:

```bash
yarn dev # for local development or else `yarn start` for production build.
```

This will expose a GraphQL API endpoint locally at http://localhost:3000. You can easily interact with this endpoint using the graphiql interface by visiting http://localhost:3000 in your browser.

To learn more about the different ways you can query the GraphQL API, visit the Checkpoint documentation [here](https://docs.checkpoint.fyi/).

## License

MIT
