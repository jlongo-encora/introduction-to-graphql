const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('@apollo/server-plugin-landing-page-graphql-playground');
const { buildSubgraphSchema } = require('@apollo/federation');
const gql = require('graphql-tag');

const users = [
  {
    uid: 1,
    firstName: 'João',
    lastName: 'Longo',
    age: 34,
  },
  {
    uid: 2,
    firstName: 'Test',
    lastName: 'User',
    age: 18,
  }
];

const typeDefs = gql`
  type User @key(fields: "uid") {
    uid: Int!
    firstName: String
    lastName: String
    age: Int
  }

  extend type Query {
    user(uid: Int!): User
  }
`;

const resolvers = {
  Query: {
    user(_, args) {
      console.log('[USER] Getting user', args.uid);
      return users.find(user => user.uid === args.uid);
    }
  },
};

const startServer = async () => {
  const server = new ApolloServer({
    schema: buildSubgraphSchema({ typeDefs, resolvers }),
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
