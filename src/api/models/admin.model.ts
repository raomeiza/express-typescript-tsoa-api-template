import mongoose, { Types, Schema, model } from 'mongoose';
import userBasics from './common.model';

const Admin = mongoose.model('Admin', new Schema({
  password: {
    type: String,
    max: 150,
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
  password_reset_token: {
    type: String,
    length: 5,
  },
  blocked: {
    type: Boolean,
    default: false,
  },
  blocked_by: {
    type: mongoose.Types.ObjectId,
    ref: 'Worker',
    default: null,
  },
  blocked_at: {
    type: Date,
    default: null,
  },
  blocke_reason: {
    type: String,
    default: null,
  },
  is_admin: {
    type: Boolean,
    default: true,
  },
}).add(userBasics), 'admin');
export default Admin;
