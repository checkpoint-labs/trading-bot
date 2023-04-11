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

GM! Did you know that you can also build trading bots with Checkpoint?? Today we'll be making a take profit/stop loss bot on @JediSwap.

1. For this tutorial I'll be using this repository: https://github.com/checkpoint-labs/trading-bot. Every Checkpoint project is constitued of the same structure: "config.json" is the control tower, "writers.ts" is the main file where you will process the retrieved data, "index.ts" (no need to touch it) is the indexer server and "schema.gql" is the schema of the data you'll index.

2. Le prix du pool est definie par une simple division de ses reserves: reserve0/reserve1. Les reserves elles sont mise a jour via l'event sync. C'est donc l'event sync de la pair que nous allons tracker.

3. Dans notre fichier de config nous allons rentrer l'address de la pair ainsi que son block de deploiement comme block de depart pour etre sur de syncroniser tout l'historique de la pair. Nous allons aussi renseigner sync comme event et la fonction que nous allons utiliser pour traiter les donnees.

4. Cette pair nous allons aussi la definir dans notre .env ainsi que nos target de profit et d'arret de perte comme ceci:


5. Dans notre schema nous allons stocker les donnee suivante pour notre pair entity: 
<schema>

6. Voila nous avons mis en place notre structure il faut maintenant que nous traitons nos donnees recus a chaques event. Pour cela rien de plus simple, comme d'habitude nous recuperons la pair, si celle ci existe ou nous la creeons dans le cas contraire.

7. Puis nous mettons a jour les reserves via les donnee reserve0 et reserve1 de l'event. Maintenant il ne reste plus qu'a comparer le prix de la pair et des targets, realiser notre swap si une des conditions passe et voila!

8. Avec Checkpoint c'est tout simple. Pour plus d'infos n'hesitez pas a vous rendre sur la doc ici: https://docs.checkpoint.fyi et a nous follow pour plus de tutoriel. Happy indexing!