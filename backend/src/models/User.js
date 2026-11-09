// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true, trim: true },
//   email: { type: String, required: true, unique: true, lowercase: true, trim: true },
//   passwordHash: { type: String, required: true },
//   role: { type: String, enum: ['admin', 'teacher', 'student'], default: 'student' },
//   isActive: { type: Boolean, default: true }
// }, { timestamps: true });

// export default mongoose.model('User', userSchema);

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['student', 'teacher'],
      default: 'student',
    },
    prn: {
      type: String,
      trim: true,
      uppercase: true,
      default: '',
    },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);