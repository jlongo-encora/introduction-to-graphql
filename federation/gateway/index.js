const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('@apollo/server-plugin-landing-page-graphql-playground');
const { ApolloGateway, IntrospectAndCompose } = require("@apollo/gateway");

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
    csrfPrevention: false,
    introspection: true,
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
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
