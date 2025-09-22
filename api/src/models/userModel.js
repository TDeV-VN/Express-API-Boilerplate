import mongoose from "mongoose";
import { ROLE } from "../utils/constants.js";
import { validate } from "~/validations/validator.js";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: validate.email,
    },
    password: { type: String, required: true, match: validate.password },
    fullName: { type: String, required: true, match: validate.fullName },
    role: { type: String, enum: ROLE, default: ROLE[0] },
  },
  { timestamps: true, versionKey: false }
);

const User = mongoose.model("User", userSchema);

const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

const getUserByEmail = async (email) => await User.findOne({ email }).exec();

const getUserById = async (id) => await User.findById(id).exec();

export const userModel = {
  getUserByEmail,
  getUserById,
  createUser,
};
