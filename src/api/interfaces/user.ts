import mongoose, { Types } from "mongoose";

export interface ISignup {
  email: string;
  password: string;
  repeatPassword: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IGetUser {
  userId: string;
}

export interface IForgotPassword {
  email: string;
}

export interface IResetPassword {
  email: string;
  password: string;
  token: string;
}

export interface IVerifyAccount {
  userId: string;
  token: number;
}

export interface IPatchUser {
  email: string;
  password: string;
  repeatPassword: string;
  token: string;
  firstName: string;
  lastName: string;
  mobile: string;
  blocked: boolean;
}


export interface IUserService {
  signup(resource: ISignup): Promise<any>;
  verifyToken(resource: { userId: string, token: number; tokenRoute: 'email' | 'mobile' }): Promise<any>;
  createProfile(resource: IPatchUser): Promise<any>;
  sendToken(resource: IForgotPassword): Promise<any>;
  login(resource: ILogin): Promise<any>;
  updateProfile(id:Types.ObjectId, resource: IPatchUser): Promise<any>;
  resetPassword(resource: IResetPassword): Promise<any>;
  getUser(resource: { userId: string }): Promise<any>;
  getUsers(): Promise<any>;
  delete(resource: { userId: string }): Promise<any>;
}
