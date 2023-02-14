import { Types, Schema, model } from 'mongoose';
import userBasics from './common.model';

const Product = model('Product', new Schema({
  title: {
    type: String,
    max: 150,
  },
  uploaded_by: {
    type: Types.ObjectId,
    ref: 'User',
  },
  in_stock: {
    type: Boolean,
    default: false,
  },
  quantity: {
    Number,
  },
  price: {
    Number,
    default: 0.00,
  },
  discount: {
    Number,
    default: 0.00,
  },
  tags: {
    type: [String],
    default: [],
  },
  type: {
    type: String,
    enum: ['product', 'service'],
  },
  category: {
    type: String,

  },
  description: {
    type: String,
    max: 500,
  },
  short_description: {
    type: String,
    max: 150,
  },
  images: {
    type: [String],
    default: [],
  },
  quantity_sold: {
    type: Number,
    default: 0,
  },
  quantity_viewed: {
    type: Number,
    default: 0,
  },
  quantity_in_cart: {
    type: Number,
    default: 0,
  },
  quantity_in_wishlist: {
    type: Number,
    default: 0,
  },
  quantity_in_compare: {
    type: Number,
    default: 0,
  },
  quantity_in_order: {
    type: Number,
    default: 0,
  },
  quantity_in_review: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
  },
  brand: {
    type: Types.ObjectId,
    ref: 'Brand',
  },
}), 'product');
export default Product;
