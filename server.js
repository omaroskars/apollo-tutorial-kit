import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import bodyParser from 'body-parser';
import compression from 'compression';
import { Engine } from 'apollo-engine';

import schema from './data/schema';

const GRAPHQL_PORT = 3000;
const ENGINE_API_KEY = 'service:omaroskars-4602:MPAo06lsP_blbGjtcgxmPg'; // TODO

const graphQLServer = express();

const engine = new Engine({
  engineConfig: {
    apiKey: ENGINE_API_KEY
  },
  graphqlPort: GRAPHQL_PORT
});

engine.start();

// This must be the first middleware
graphQLServer.use(engine.expressMiddleware());
graphQLServer.use(compression());
graphQLServer.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress({
    schema,
    // This option turns on tracing
    tracing: true,
    cacheControl: true
  })
);

graphQLServer.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

graphQLServer.listen(GRAPHQL_PORT, () =>
  console.log(
    `GraphiQL is now running on http://localhost:${GRAPHQL_PORT}/graphiql`
  )
);
