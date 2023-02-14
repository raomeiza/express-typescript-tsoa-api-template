import { Types, Schema, model } from 'mongoose';
import userBasics from './common.model';

const User = model('User', new Schema({
  password: {
    type: String,
    max: 150,
    required: true,
  },
  is_active: {
    type: Boolean,
    default: false,
  },
  last_seen: {
    Date,
  },
  email_verified: {
    type: Boolean,
    default: false,
  },
  email_token: {
    type: String,
    length: 5,
    default: null,
  },
  password_resetToken: {
    type: String,
    length: 5,
  },
  blocked: {
    type: Boolean,
    default: false,
  },
  blocked_by: {
    type: Types.ObjectId,
    ref: 'Worker',
    default: null,
  },
  blocked_at: {
    type: Date,
    default: null,
  },
  block_reason: {
    type: String,
    default: null,
  },
}).add(userBasics), 'user');
export default User;
