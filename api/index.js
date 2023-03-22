const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('@apollo/server-plugin-landing-page-graphql-playground');
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

const products = [
  {
    pid: 1,
    name: 'Table',
    price: 899.99,
  },
  {
    pid: 2,
    name: 'Couch',
    price: 1299.0,
  },
];

const purchases = {
  1: [1],
};

const getPurchases = async (uid) => {
  const pids = purchases[uid];
  if (!pids) {
    return [];
  }

  return pids.map(pid => products.find(product => product.pid === pid));
};

// Schema-first
const typeDefs = gql`
  type User {
    uid: Int!
    firstName: String
    lastName: String
    age: Int
    purchases: [Product!]!
  }

  type Product {
    pid: Int!
    name: String
    price: Float
  }

  type Query {
    user(uid: Int!): User
  }

  type Mutation {
    buyProduct(uid: Int!, pid: Int!): Product!
  }
`;

const resolvers = {
  Query: {
    async user(_, args) {
      console.log('[USER] Getting user', args.uid);
      return users.find(user => user.uid === args.uid);
    },
  },
  Mutation: {
    async buyProduct(_, args) {
      console.log('[PRODUCT] Buying product', args);
      const { uid, pid } = args;
      const product = products.find(product => product.pid === pid);
      if (!product) {
        throw new Error('Product not found');
      }

      if (!purchases[uid]) {
        purchases[uid] = [];
      }

      purchases[uid].push(pid);
      return product;
    }
  },
  User: {
    async purchases(user) {
      console.log('[PRODUCT] Getting purchases', user);
      return await getPurchases(user.uid);
    },
  },
  Product: {

  },
};

const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
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
