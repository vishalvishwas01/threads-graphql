const { ApolloServer } = require("@apollo/server");
const user = require("./user/index");

async function createApolloGraphqlServer() {
  const gqlServer = new ApolloServer({
    typeDefs: `
    ${user.typeDefs}
    type Query{
        ${user.queries}
        getContext: String
    }
    type Mutation{
       ${user.mutations}
    }
    `, //schema as string
    resolvers: {
      Query: {
        ...user.resolver.queries,
        getContext: (_: any, parameter: any, context: any) => {
          console.log("context", context)
          return 'okay'
        }
      },
      Mutation: {
        ...user.resolver.mutation,
      },
    },
  });

  // start the server
  await gqlServer.start();
  return gqlServer;
}

module.exports = createApolloGraphqlServer;
