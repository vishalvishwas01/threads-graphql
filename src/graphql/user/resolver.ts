import { type CreateUserPayload } from "../../services/user";
const UserService = require("../../services/user");

const queries = {
  getUserToken: async (
    _: any,
    payload: { email: string; password: string }
  ) => {
    const token = await UserService.getUserToken({
        email: payload.email,
        password: payload.password,
    });
    return token
  },

  getCurrentLoggedInUser: async (_:any, parameters:any, context:any)=>{
    if(context && context.user){
      const id = context.user.id
      const user = await UserService.getUserById(id);
      return user
    }
    throw new Error( 'i dont know how to do this yet');
  }
};

const mutation = {
  createUser: async (_: any, payload: CreateUserPayload) => {
    const res = await UserService.createUser(payload);
    return res.id;
  },
};

module.exports = { queries, mutation };
