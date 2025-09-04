import Express = require("express");
const createApolloGraphqlServer = require("./graphql");
const { expressMiddleware } = require("@as-integrations/express5");
const UserService = require("./services/user");

async function init() {
  const app = Express();
  const PORT = 8001;

  app.use(Express.json());
  
  app.get("/", (req, res) => {
    res.json({ message: "server is running" });
  });


  const gqlServer = await createApolloGraphqlServer();
  app.use("/graphql", expressMiddleware(gqlServer, {context: async({req}:any)=>{
   const token = req.headers['token']
   try {
    const user = UserService.decodeJWTToken(token as String);
    return {user}
   } catch (error) {
    console.log(error)
   }
  }

  }));

  app.listen(PORT, () =>
    console.log(`server started http://localhost:${PORT}`)
  );
}
init();