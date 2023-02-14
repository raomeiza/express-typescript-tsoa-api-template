import mongoose from "mongoose";

const userBasics:object = new mongoose.Schema({
  firstname: {
    type: String,
    max: 50,
  },
  lastname: {
    type: String,
    max: 50,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  address: {
    type: String,
    max: 150,
  },
  country: {
    type: String,
    max: 50,
  },
  state_province: {
    type: String,
    max: 50,
  },
  city: {
    type: String,
    max: 50,
  },
  zip: {
    type: String,
    max: 10,
  },
  email: {
    type: String,
    max: 50,
    unique: true,
    index: true,
    sparse: true,
    trim: true,
    lowercase: true,
  },
  mobile: {
    type: String,
    index: true,
    unique: true,
    sparse: true,
    trim: true,
    max: 15,
  },
  profile_pic: {
    type: String,
    max: 150
  }
});
export default userBasics;
