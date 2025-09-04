const { prismaClient } = require("../lib/db");
const {createHmac, randomBytes} = require('node:crypto');
const JWT = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

export interface CreateUserPayload {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}

export interface GetUserTokenPayload {
  email: string;
  password: string;
}



class UserService {

  private static generateHash(salt: string, password: string) {
    const hashedPassword = createHmac('sha256', salt).update(password).digest('hex');
    return hashedPassword;
  }

  public static getUserById(id: string) {
    return prismaClient.user.findUnique({where: {id}})
  }


  public static createUser(payload: CreateUserPayload) {
    const { firstName, lastName, email, password } = payload;
    const salt = randomBytes(32).toString('hex');
    const hashedPassword = UserService.generateHash(salt, password);
    return prismaClient.user.create({
      data: {
        firstName,
        lastName,
        email,
        salt,
        password: hashedPassword,
      },
    });
  }

  private static getUserByEmail(email: string) {
    return prismaClient.user.findUnique({
      where: {email},
    });
  }

  public static async getUserToken(payload: GetUserTokenPayload) {
    const { email, password } = payload;
    const user = await UserService.getUserByEmail(email);
    if(!user) throw new Error('User not found');

    const userSalt = user.salt;
    const userhashedPassword = UserService.generateHash(userSalt, password);
    if(userhashedPassword !== user.password) throw new Error('Invalid password');

    //generate token

    const token = JWT.sign({id: user.id, email: user.email}, process.env.JWT_SECRET)
    return token;
  }

  public static decodeJWTToken(token: string) {
    return JWT.verify(token, process.env.JWT_SECRET);
  }
}

module.exports =  UserService ;
