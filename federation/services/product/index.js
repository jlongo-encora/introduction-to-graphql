const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');

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

const typeDefs = gql`
  type Product @key(fields: "pid") {
    pid: Int!
    name: String
    price: Float
  }

  extend type User @key(fields: "uid") {
    uid: Int! @external
    firstName: String @external
    lastName: String @external
    purchases: [Product!]! @requires(fields: "firstName lastName")
  }

  extend type Mutation {
    buyProduct(uid: Int!, pid: Int!): Product!
  }
`;

const getPurchases = async (uid) => {
  const pids = purchases[uid];
  if (!pids) {
    return [];
  }

  return pids.map(pid => products.find(product => product.pid === pid));
};

const resolvers = {
  Product: {

  },
  User: {
    async purchases(user) {
      console.log('[PRODUCT] Getting purchases', user);
      return await getPurchases(user.uid);
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

server.listen({ port: 4002 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
