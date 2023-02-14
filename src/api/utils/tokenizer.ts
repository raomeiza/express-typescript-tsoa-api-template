import jwt, { Secret } from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../../config';

  export const signToken = async (payload: any): Promise<string> => {
    // if the secret key is not defined throw an error
    if (!JWT_SECRET_KEY) {
      throw new Error('JWT_SECRET_KEY is not defined');
    }
    // sign the token using try catch to handle errors
    try {
      // sign the token using the secret key that expires in 1 hour
      return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '1h' });
    }
    // if there is an error throw it
    catch (err) {
      // throw the error
      throw err;
    }
  }

  // create a method that will verify a token using the constructor secret key
  export const verifyToken = async (token: string): Promise<any> => {
    // if the secret key is not defined throw an error
    if (!JWT_SECRET_KEY) {
      throw new Error('JWT_SECRET_KEY is not defined');
    }
    // verify the token using try catch to handle errors
    try {
      // verify the token using the secret key
      return jwt.verify(token, JWT_SECRET_KEY);
    }
    // if there is an error throw it
    catch (err) {
      // throw the error
      throw err;
    }
  }

  // create a method that will refresh a token using the constructor secret key
  export const refreshToken = async (token: any): Promise<string> => {
    // if the secret key is not defined throw an error
    if (!JWT_SECRET_KEY) {
      throw new Error('JWT_SECRET_KEY is not defined');
    }
    // refresh the token using try catch to handle errors
    try {
      // delete the token exp and iat
      delete token.exp;
      delete token.iat;
      return jwt.sign(token, JWT_SECRET_KEY, { expiresIn: '1h' });
    }
    // if there is an error throw it
    catch (err) {
      // throw the error
      throw err;
    }
  }
