import Joi from 'joi';

const create = Joi.object().keys({
  title: Joi.string().required().messages({
    'string.empty': 'Name is required',
  }),
  description: Joi.string().required().max(500).messages({
    'string.empty': 'Description is required',
    'string.max': 'Description must be less than 500 characters',
  }),
  price: Joi.number().required().messages({
    'number.base': 'Price must be a number',
    'number.empty': 'Price is required',
  }),
  quantity: Joi.number().required().messages({
    'number.base': 'Quantity must be a number',
    'number.empty': 'Quantity is required',
  }),
  category: Joi.string().required().messages({
    'string.empty': 'Category is required',
  }),
  images: Joi.array().items(Joi.string()).messages({
    'array.base': 'Images must be an array',
  }),
  tags: Joi.array().items(Joi.string()).messages({
    'array.base': 'Tags must be an array',
  }),
  type: Joi.string().required().messages({
    'string.empty': 'Type is required',
  }),
  discount: Joi.number().messages({
    'number.base': 'Discount must be a number',
  }),
  in_stock: Joi.boolean().messages({
    'boolean.base': 'In stock must be a boolean',
  }),
  short_description: Joi.string().max(150).messages({
    'string.max': 'Short description must be less than 150 characters',
  }),
  uploaded_by: Joi.string().required().messages({
    'string.empty': 'Uploaded by is required',
  }),
  brand: Joi.string(),
});

export default create;
