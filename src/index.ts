import Express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@as-integrations/express5");

async function init() {
  const app = Express();
  const PORT = 8001;

  app.use(Express.json());

  // create graphql server
  const gqlServer = new ApolloServer({
    typeDefs: `
    type Query{
        hello: String
        say(name: String): String
    }
    `, //schema as string
    resolvers: {
        Query: {
            hello: () => "Hello world!",
            say: ( _:{}, {name}:{name: string} ) => `Hello ${name}`,
        },
    },
  });

  // start the server
  await gqlServer.start();

  app.get("/", (req, res) => {
    res.json({ message: "server is running" });
  });

  app.use("/graphql", expressMiddleware(gqlServer));

  app.listen(PORT, () =>
    console.log(`server started http://localhost:${PORT}`)
  );
}
init();