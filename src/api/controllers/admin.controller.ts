import { handleErrorResponse, handleSuccessResponse } from '../utils/response-handler'
import adminService from '../services/admin.service'
import * as password from '../utils/password'
import * as validations from '../validations/user.validation'
import decodeTokenMiddleware from '../middlewares/auth'
import { Route, Res, TsoaResponse, Request, Body, Response, Tags, Example, Controller, Get, Post, Delete, Query, Path } from 'tsoa'
import { ISignup, IVerifyAccount, IGetUser, IForgotPassword, IPatchUser, ILogin, IResetPassword } from '../interfaces/user'
import { refreshToken, signToken } from '../utils/tokenizer'

@Route('admin')
@Tags('Admin')
export class AdminController extends Controller {
  /**
   * @description - first step to validating a pre registered account
   * */
  @Example({
    password: '123456qwerty',
    repeat_passwork: '123456qwerty',
    email: 'peddleCustomer@peddle.com'
  })
  @Post('signup')
  @Response(201, 'Registered successfully')
  // email already in use
  @Response(409, 'email already in use')
  public async signup(
    @Res() sendSuccess: TsoaResponse<201, { success: true, data: any }>,
    @Res() sendError: TsoaResponse<400, { success: false, status: number, message: object }>,
    @Body() payload: ISignup
  ): Promise<any> {
    try {
      if (payload.password !== payload.repeatPassword) {
        throw { message: 'passwords do not match', status: 409}
      }
      await validations.signup.validateAsync(payload)
      // hash the payload.password
      const hashedPassword = await password.hashPassword(payload.password)
      // create the user
      const user = await adminService.signup({ ...payload, password: hashedPassword })
      user.jwt = await signToken({ userId: user._id, email: user.email, is_admin: user.is_admin })
      // send the user a verification email
      sendSuccess(201, { success: true, data: user }, /* set the jwt */ { 'x-auth-token': user.jwt })
    } catch (err: any) {
      return await handleErrorResponse(sendError, err)
    }
  }

  /**
   * @description - second step to validating a pre registered account
   * */
  @Example({
    userId: '60a1c1c1c1c1c1c1c1c1c1c1',
    token: 123456,
    tokenRoute: 'email'
  })
  @Post('verify')
  @Response(201, 'Verified successfully')
  // token not valid
  @Response(409, 'token not valid')
  public async verifyToken(
    @Res() sendSuccess: TsoaResponse<200, { success: true, data: any }>,
    @Res() sendError: TsoaResponse<400 | 404 | 409, { success: false, status: number, message: object }>,
    @Body() payload: IVerifyAccount
  ): Promise<any> {
    try {
      await validations.verifyToken.validateAsync(payload)
      // verify the token
      const user = await adminService.verifyToken({...payload, tokenRoute: 'email'})
      user.jwt = await signToken({ userId: user._id, email: user.email, is_admin: user.is_admin || false })
      sendSuccess(200, { success: true, data: user }, /* set the jwt */ { 'x-auth-token': user.jwt })
    } catch (err: any) {
      return await handleErrorResponse(sendError, err)
    }
  }

  /**
   * @description - upload profile details
   **/
  @Example({
    email: 'customer@peddle.com',
    firstName: 'John',
    lastName: 'Doe',
    mobile: '08012345678',
    address: 'No 1, John Doe Street, Lagos, Nigeria',
    nationality: 'Nigeria',
    state: 'Lagos',
    city: 'Lagos',
    zipCode: '23401',
  })
  @Post('update-profile')
  @Response(201, 'Profile updated successfully')
  // token not valid
  @Response(409, 'token not valid')
  public async createProfile(
    @Res() sendSuccess: TsoaResponse<200, { success: true, data: any }>,
    @Res() sendError: TsoaResponse<400 | 404 | 409, { success: false, status: number, message: object }>,
    @Body() payload: IPatchUser
  ): Promise<any> {
    try {
      await validations.profile.validateAsync(payload)
      // verify the token
      const user = await adminService.createProfile(payload)
      user.jwt = await signToken({ userId: user._id, email: user.email, is_admin: user.is_admin || false })
      sendSuccess(200, { success: true, data: user }, /* set the jwt */ { 'x-auth-token': user.jwt })
    } catch (err: any) {
      return await handleErrorResponse(sendError, err)
    }
  }

  /**
   * @description - send a password reset link to the user's email
   **/
  @Example({
    email: 'customer@peddle.com',
  })
  @Post('forgot-password')
  @Response(201, 'Password reset link sent successfully')
  // token not valid
  @Response(409, 'token not valid')
  public async forgotPassword(
    @Res() sendSuccess: TsoaResponse<200, { success: true, data: any }>,
    @Res() sendError: TsoaResponse<400 | 404 | 409, { success: false, status: number, message: object }>,
    @Body() payload: IForgotPassword
  ): Promise<any> {
    try {
      await validations.forgotPassword.validateAsync(payload)
      // verify the token
      const user = await adminService.forgotPassword(payload)
      sendSuccess(200, { success: true, data: user }, /* set the jwt */ { 'x-auth-token': user.jwt })
    } catch (err: any) {
      return await handleErrorResponse(sendError, err)
    }
  }

  /**
   * @description - login a user
   * */
  @Example({
    email: 'customer@peddle.com',
    password: '123456qwerty'
  })
  @Post('login')
  @Response(201, 'Logged in successfully')
  // email not found
  @Response(404, 'email not found')
  // password incorrect
  @Response(409, 'password incorrect')
  public async login(
    @Res() sendSuccess: TsoaResponse<200, { success: true, data: any }>,
    @Res() sendError: TsoaResponse<400 | 404 | 409, { success: false, status: number, message: object }>,
    @Body() payload: ILogin
  ): Promise<any> {
    try {
      await validations.login.validateAsync(payload)
      // verify the token
      const user = await adminService.login(payload)
      const { userId, email, is_admin } = user.user
      user.jwt = await signToken({ userId, email, is_admin })
      sendSuccess(200, { success: true, data: user }, /* set the jwt */ { 'x-auth-token': user.jwt })
    } catch (err: any) {
      return await handleErrorResponse(sendError, err)
    }
  }

  /**
   * @description - login a user
   * */
  @Example({
    userId: '60a1c1c1c1c1c1c1c1c1c1c1',
  })
  @Get('user/{userId}')
  @Response(201, 'Profile fetched successfully')
  // email not found
  @Response(404, 'User not found')
  public async getUser(
    @Res() sendSuccess: TsoaResponse<200, { success: true, data: any }>,
    @Res() sendError: TsoaResponse<400 | 404 | 409, { success: false, status: number, message: object }>,
    @Path() userId: string,
    @Request() request: any
  ): Promise<any> {
    try {

      // authenticate the user
      await decodeTokenMiddleware(request)
      const thisUser = request.decodedUser
      if(!thisUser.is_admin) {
        throw { status: 401, message: 'Unauthorized' }
      }
      await validations.isMongoIdValid(userId)
      // verify the token
      const user = await adminService.getUser({userId})
      user.jwt = await refreshToken(thisUser)
      sendSuccess(200, { success: true, data: user }, /* set the jwt */ { 'x-auth-token': user.jwt })
    } catch (err: any) {
      return await handleErrorResponse(sendError, err)
    }
  }

  /**
   * @description - get all users
   * */
  @Example({})
  @Get('users')
  @Response(201, 'Users fetched successfully')
  // email not found
  @Response(404, 'Users not found')
  public async getAllUsers(
    @Res() sendSuccess: TsoaResponse<200, { success: true, data: any }>,
    @Res() sendError: TsoaResponse<400 | 404 | 409, { success: false, status: number, message: object }>,
    @Request() request: any,
  ): Promise<any> {
    try {
      // authenticate the user
      await decodeTokenMiddleware(request)
      const thisUser = request.decodedUser
      if(!thisUser.is_admin) {
        throw { status: 401, message: 'Unauthorized' }
      }
      const users = await adminService.getUsers()
      users.jwt = await refreshToken(thisUser)
      sendSuccess(200, { success: true, data: users }, /* set the jwt */ { 'x-auth-token': users.jwt })
    } catch (err: any) {
      return await handleErrorResponse(sendError, err)
    }
    return {status: 200, message: 'hello'}
  }


  /**
   * @description - delete a user
   * */
  @Example({
    userId: '60a1c1c1c1c1c1c1c1c1c1c1',
  })
  @Delete('delete')
  @Response(201, 'User deleted successfully')
  // email not found
  @Response(404, 'User not found')
  public async deleteUser(
    @Res() sendSuccess: TsoaResponse<200, { success: true, data: any }>,
    @Res() sendError: TsoaResponse<400 | 404 | 409, { success: false, status: number, message: object }>,
    @Request() request: any,
    @Body() payload: IGetUser
  ): Promise<any> {
    try {
      // authenticate the user
      await decodeTokenMiddleware(request)
      const thisUser = request.decodedUser
      if(!thisUser.is_admin) {
        throw { status: 401, message: 'Unauthorized' }
      }
      await validations.isMongoIdValid(payload.userId)
      // verify the token
      const user = await adminService.delete(payload)
      user.jwt = await refreshToken(thisUser)
      sendSuccess(200, { success: true, data: user }, /* set the jwt */ { 'x-auth-token': user.jwt })
    } catch (err: any) {
      return await handleErrorResponse(sendError, err)
    }
  }

}

//export the controller
export default new AdminController();