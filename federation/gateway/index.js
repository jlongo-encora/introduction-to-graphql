const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('@apollo/server-plugin-landing-page-graphql-playground');
const { ApolloGateway, IntrospectAndCompose } = require("@apollo/gateway");

/*
const gateway = new ApolloGateway({
  // This entire `serviceList` is optional when running in managed federation
  // mode, using Apollo Graph Manager as the source of truth.  In production,
  // using a single source of truth to compose a schema is recommended and
  // prevents composition failures at runtime using schema validation using
  // real usage-based metrics.
  serviceList: [
    { name: "user", url: "http://localhost:4001/graphql" },
    { name: "product", url: "http://localhost:4002/graphql" },
  ],

  // Experimental: Enabling this enables the query plan view in Playground.
  __exposeQueryPlanExperimental: false,
});*/

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { name: "user", url: "http://localhost:4001/graphql" },
      { name: "product", url: "http://localhost:4002/graphql" },
    ],
  }),
});

const startServer = async () => {
  const server = new ApolloServer({
    gateway,
    // Apollo Graph Manager (previously known as Apollo Engine)
    // When enabled and an `ENGINE_API_KEY` is set in the environment,
    // provides metrics, schema management and trace reporting.
    engine: false,
    csrfPrevention: false,
    introspection: true,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });

  const { url } = await startStandaloneServer(server, {
    listen: {
      port: process.env.PORT || 4000,
    },
  });
  return url;
};

startServer()
  .then((url) => {
    console.log(`🚀 Server ready at ${url}`);
  })
  .catch((err) => {
    console.error(`Failed to start server, error=${err}`);
  });
