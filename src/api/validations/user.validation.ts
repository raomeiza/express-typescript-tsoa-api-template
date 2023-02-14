import Joi from 'joi';

import * as validationUtils from './utils';

export const { isMongoIdValid } = validationUtils;

export const login = Joi.object().keys({
  email: Joi.string().required().custom(validationUtils.isEmailValid),
  password: Joi.string().required(),
});

export const signup = Joi.object().keys({
  password: Joi.string().regex(validationUtils.passwordRegexWithoutSpecialChar)
    .error(validationUtils.passwordRegexWithoutSpecialCharError).required(),

  repeatPassword: Joi.required().valid(Joi.ref('password'))
    .error(new Error('Passwords do not match')),
  email: Joi.string().lowercase().custom(validationUtils.isEmailValid, 'Please enter a valid Email').required(),
});

export const profile = Joi.object().keys({
  firstname: Joi.string().max(50).min(2).required()
    .messages({
      'string.empty': 'First name is required',
      'string.min': 'First name must be at least 2 characters',
      'string.max': 'First name must be less than 50 characters',
    }),
  lastname: Joi.string().max(50).min(2).required()
    .messages({
      'string.empty': 'Last name is required',
      'string.min': 'Last name must be at least 2 characters',
      'string.max': 'Last name must be less than 50 characters',
    }),
  gender: Joi.string().lowercase().equal('male', 'female', 'other').required(),
  email: Joi.string().lowercase()
    .custom(validationUtils.isEmailValid, 'Please enter a valid Email').required(),
  address: Joi.string().max(100).min(2).required()
    .messages({
      'string.empty': 'Address is required',
      'string.min': 'Address must be at least 2 characters',
      'string.max': 'Address must be less than 100 characters',
    }),
  city: Joi.string().max(50).min(2),
  state: Joi.string().max(50).min(2),
  country: Joi.string().max(50).min(2),
  mobile: Joi.string().max(20).min(2),
  zip: Joi.string().max(50).min(2),
  registered_by: Joi.string().length(24),
  registered_on: Joi.date(),
  registered_at: Joi.string().max(50).min(2),
});

export const verifyToken = Joi.object().keys({
  mobileToken: Joi.string().required().length(4),
});

export const resetPassword = Joi.object().keys({
  userId: Joi.string().custom(validationUtils.isMongoIdValid).required(),
  token: Joi.string().length(4),
  password: Joi.string().regex(validationUtils.passwordRegexWithoutSpecialChar).error(validationUtils.passwordRegexWithoutSpecialCharError).required(),
});

export const forgotPassword = Joi.object().keys({
  email: Joi.string().required().custom(validationUtils.isEmailValid),
});
