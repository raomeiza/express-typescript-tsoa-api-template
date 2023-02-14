import validator from 'validator'
import { handleCastErrorExceptionForInvalidObjectId, isCastError, throwError } from '../utils/handle-error'
import User from '../models/users.model'
import { Types } from 'mongoose'
import { checkPassword } from '../utils/password'
import { signToken } from '../utils/tokenizer'
import { IForgotPassword, ILogin, IPatchUser, IResetPassword, ISignup, IUserService, IVerifyAccount } from '../interfaces/user'
import logger from '../utils/logger'

interface IVerifyEmail2 extends IVerifyAccount {
  tokenRoute: 'email' | 'mobile'
}

export class UserService implements IUserService {
  constructor() {
    this.model = User
  }
  model: any
  // register a new user
  async signup(resource: ISignup): Promise<any> {
    try {
      const token = await generateToken();
      
      const user = await this.model.create({...resource, emailToken: token});
      return await getResponse(user);
    } catch (err: any) {
      throw ({ message: err.message || 'User not created', error: err, status: err.status || err.errorStatus || 404 })
    }
  }

  // verify the token sent to the user's email or mobile. this will also be used for reset password
  async verifyToken(resource: { userId: string, token: number; tokenRoute: 'email' | 'mobile' }): Promise<any> {
    try {
      const { userId, token, tokenRoute } = resource;
      const worker = await this.model.findOneAndUpdate({ _id: userId, [`${tokenRoute}Token`]: token, [`${tokenRoute}Token`]: null }, {$set: {[tokenRoute]: null}} ).orFail(() => <any>'Token not valid');
      return await getResponse(worker);
    } catch (err: any) {
      throw ({ message: err.message || 'Token not sent', error: err, status: err.status || err.errorStatus || 404 })
    }
  }

  // create profile
  async createProfile(resource: IPatchUser): Promise<any> {
    try {
      const { email, password, firstName, lastName, mobile } = resource;
      const user = await this.model.findByIdAndUpdate({ email }, { $set: { firstName, lastName, mobile, password } }).orFail(() => <any>'User not found');
      return await getResponse(user);
    } catch (err: any) {
      throw ({ message: err.message || 'User not created', error: err, status: err.status || err.errorStatus || 404 })
    }
  }

  /**
   * 
   * @param user - email, mobile or _id of the user
   * @param tokenRoute - where to send the token? either email or mobile
   * @returns Promimisified json
   */
  async sendToken(resource: IForgotPassword): Promise<any> {
    try {
      const token = await generateToken();
      const { email } = resource;
      //find worker by id and update the token
      const worker = await this.model.findOneAndUpdate({ email }, { $set: { emailToken: token } }).orFail(() => <any>'User not found');
      return true;
    } catch (err: any) {
      throw({ message: err.message || 'User not found', error: err, status: err.status || err.errorStatus || 404 })
    }
  }

  async login(resource: ILogin): Promise<any> {
    try {
      const { email, password } = resource;
      const thisUser = await this.model.findOne({ email }).orFail(() => <any>'User not found');
      const isPasswordValid = await checkPassword(password,thisUser.password);
      if (!isPasswordValid) {
        throw ({ message: 'Email or password incorrect', status: 404 })
      }
      return await getResponse(thisUser);
    } catch (err: any) {
      throw ({ message: err.message || 'Email or password incorrect', error: err, status: err.status || err.errorStatus || 404 })
    }
  }

  // update the user's profile
  async updateProfile( id:Types.ObjectId, resource: IPatchUser): Promise<any> {
    try {
      return await this.model.findByIdAndUpdate(id, resource, { new: true }).orFail(() => <any>'User not found');
    } catch (err: any) {
      throw ({ message: err.message || 'Profile update failed', error: err, status: err.status || err.errorStatus || 404 })
    }
  }

  //get worker

  async getUser(resource: { userId: string }): Promise<any> {
    try {
      return await this.model.findById(resource.userId).orFail(():any => 'User not found');
    } catch (ex:any) {
      logger.log({
        level: 'error',
        message: ex.message,
      });
      isCastError(ex) ? handleCastErrorExceptionForInvalidObjectId() : throwError(ex);
    }
  }

  async getUsers(): Promise<any> {
      try {
        let userQuery =  this.model.find()
        // omit password, token, _iv, _v, _id, email_token, mobile_token, password_reset_token
        userQuery.select('-password -token -_iv -_v -_id -email_token -mobile_token -password_resetToken');

        return await userQuery.exec();
      } catch (ex:any) {
        logger.log({
          level: 'error',
          message: ex.message,
        });
        isCastError(ex) ? handleCastErrorExceptionForInvalidObjectId() : throwError(ex);
      }
  }

  async findUsers(payload = <any>{search_by: '', search_value: '', page: 1, limit: 10, skip: '', user:null}): Promise<any> {
    try {
      // if no by or value is provided, return all converts
      const users = this.model.find()
      if (payload.search_by && payload.search_value) {
        users.where(payload.search_by).equals(payload.search_value)
      }
      if (payload.skip) {
        users.skip(payload.skip)
      }
      if (payload.page && payload.limit) {
        users.limit(payload.limit).skip(payload.page * payload.limit)
      }
      // omit the password, _id, _iv, passwordResetToken, passwordResetExpires, and invitationID fields
      users.select('-password -_id -_iv -passwordResetToken -passwordResetExpires -invitationID -logins')
      const users_:any = await users.exec()
      // if there is error, throw it
      if (users_ instanceof Error) {
        throw users_
      }
      return await customResponse(users_)
    } catch (err: any) {
      throw ({ message: err.message || 'Error fetching workers', error: err, status: err.status || err.errorStatus || 404 })
    }
  }


  async forgotPassword(payload: IForgotPassword): Promise<any> {
    try {
      const token = await generateToken();
      const worker = await this.model.findOneAndUpdate({ email: payload.email }, { passwordResetToken: token }).orFail(() => <any>'User not found');
      // @ts-ignore
      //validator.isMobilePhone(payload.email, 'en-NG') ? await sendSms(emailorMobile, worker.passwordResetToken) : await sendMail(worker.email, 'Password Reset Token', `${worker.passwordResetToken}`);
      return true;
    } catch (err: any) {
      throw ({ message: err.message || 'User not found', error: err, status: err.status || err.errorStatus || 404 })
    }
  }

  async resetPassword(resource: IResetPassword): Promise<any> {
    try {
      return await this.model.findOneAndUpdate({email: resource.email},
        { $set: { password: resource.password, passwordResetToken: null } })
        .orFail(() => <any>'User not found');

    } catch (err: any) {
      throw ({ message: err.message || 'User not found', error: err, status: err.status || err.errorStatus || 404 })
    }
  }

  async verifyEmail(resource: IVerifyEmail2): Promise<any> {
    try {
      return await this.model.findOneAndUpdate({id: resource.userId, emailToken: resource.token},
        { $set: { emailToken: null } })
        .orFail(() => <any>'User not found');

    } catch (err: any) {
      throw ({ message: err.message || 'User not found', error: err, status: err.status || err.errorStatus || 404 })
    }

  }

  async delete(resource: { userId: string; }): Promise<any> {
    try {
      return await this.model.findByIdAndDelete(resource.userId).orFail(() => <any>'User not found');
    } catch (err: any) {
      throw ({ message: err.message || 'User not found', error: err, status: err.status || err.errorStatus || 404 })
    }
  }
};

async function getResponse(user: { toObject: () => any }, isLogin?: boolean) {
  const userObj = user.toObject();
  userObj.userId = userObj._id
  delete userObj.mobileToken;
  delete userObj.emailToken;
  delete userObj.password;
  delete userObj.passwordResetToken;
  delete userObj.passwordResetExpiry;
  delete userObj.__v;
  delete userObj._id

  // if the user is logging in, create a token using tokenizer.generateToken and using this.model.userId and unit as argument
  return {
    user: userObj,
  };
}

const generateJWT = (user: { userId: string, email: string, is_admin: Boolean }) => {
  return signToken(user);
};


const customResponse = async  (userObj:any)=> {
  delete userObj.password;
  delete userObj.mobileToken;
  delete userObj.emailToken;
  delete userObj.passwordResetToken;
  delete userObj.passwordResetExpiry;
  delete userObj.__v;
  return userObj;
}

async function generateToken() {
  return (Math.floor(Math.random() * 9000) + 1000);
}
export default new UserService();