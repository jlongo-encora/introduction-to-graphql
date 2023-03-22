const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');

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

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ]),
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground(),
  ],
});

server.listen({ port: 4001 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
