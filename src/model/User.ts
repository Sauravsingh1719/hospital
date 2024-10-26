import mongoose from "mongoose";

export interface User extends Document {
  userId: string; 
  password: string; 
  role: string; 
  name: string;
  email: string;
}

const UserSchema = new mongoose.Schema<User>({
  userId: {
    type: String,
    required: true,
    unique: true, // Make sure no two users have the same userId
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["doctor", "patient", "admin"],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    match: [/.+\@.+\..+/, "Please use a valid email address"],
  },
});

const UserModel =
  mongoose.models.User || mongoose.model<User>("User", UserSchema);

export default UserModel;
