// // // import bcrypt from "bcryptjs";
// // // import jwt from "jsonwebtoken";
// // // import { z } from "zod";
// // // import User from "../models/User.js";

// // // export const registerSchema = z.object({
// // //   name: z.string().min(2),
// // //   email: z.string().email(),
// // //   password: z.string().min(6),
// // //   role: z.enum(["admin", "teacher", "student"]).default("student"),
// // // });

// // // export const loginSchema = z.object({
// // //   email: z.string().email(),
// // //   password: z.string().min(1),
// // // });

// // // export const register = async (req, res) => {
// // //   const { name, email, password, role } = req.validatedBody;
// // //   const existing = await User.findOne({ email });
// // //   if (existing) {
// // //     return res
// // //       .status(409)
// // //       .json({ error: "User with this email already exists" });
// // //   }

// // //   const salt = await bcrypt.genSalt(10);
// // //   const passwordHash = await bcrypt.hash(password, salt);

// // //   const user = await User.create({ name, email, passwordHash, role });
// // //   const token = jwt.sign(
// // //     { id: user._id, role: user.role },
// // //     process.env.JWT_SECRET,
// // //     { expiresIn: "8h" },
// // //   );

// // //   res.status(201).json({
// // //     token,
// // //     user: { id: user._id, name: user.name, email: user.email, role: user.role },
// // //   });
// // // };

// // // export const login = async (req, res) => {
// // //   const { email, password } = req.validatedBody;
// // //   const user = await User.findOne({ email });
// // //   if (!user || !user.isActive) {
// // //     return res
// // //       .status(401)
// // //       .json({ error: "Invalid credentials or inactive user" });
// // //   }

// // //   const isMatch = await bcrypt.compare(password, user.passwordHash);
// // //   if (!isMatch) {
// // //     return res.status(401).json({ error: "Invalid credentials" });
// // //   }

// // //   const token = jwt.sign(
// // //     { id: user._id, role: user.role },
// // //     process.env.JWT_SECRET,
// // //     { expiresIn: "8h" },
// // //   );

// // //   res.json({
// // //     token,
// // //     user: { id: user._id, name: user.name, email: user.email, role: user.role },
// // //   });
// // // };

// // // export const getMe = async (req, res) => {
// // //   res.json({ user: req.user });
// // // };

// // import bcrypt from 'bcryptjs';
// // import jwt from 'jsonwebtoken';
// // import User from '../models/User.js';

// // const generateToken = (id) => {
// //   return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
// // };

// // export const register = async (req, res) => {
// //   try {
// //     const { name, email, password, role, prn } = req.body;

// //     if (!name || !email || !password) {
// //       return res.status(400).json({ message: 'Please provide all required fields' });
// //     }

// //     const existingUser = await User.findOne({ email });
// //     if (existingUser) {
// //       return res.status(400).json({ message: 'User already exists with this email' });
// //     }

// //     if (role === 'student' && !prn) {
// //       return res.status(400).json({ message: 'PRN / Roll Number is required for students' });
// //     }

// //     const salt = await bcrypt.genSalt(10);
// //     const hashedPassword = await bcrypt.hash(password, salt);

// //     const user = await User.create({
// //       name,
// //       email,
// //       password: hashedPassword,
// //       role: role || 'student',
// //       prn: role === 'teacher' ? '' : (prn || '').trim().toUpperCase(),
// //     });

// //     const token = generateToken(user._id);

// //     return res.status(201).json({
// //       _id: user._id,
// //       name: user.name,
// //       email: user.email,
// //       role: user.role,
// //       prn: user.prn,
// //       token,
// //     });
// //   } catch (error) {
// //     return res.status(500).json({ message: error.message || 'Server error during registration' });
// //   }
// // };

// // export const login = async (req, res) => {
// //   try {
// //     const { email, password } = req.body;

// //     const user = await User.findOne({ email });
// //     if (!user) {
// //       return res.status(401).json({ message: 'Invalid email or password' });
// //     }

// //     const isMatch = await bcrypt.compare(password, user.password);
// //     if (!isMatch) {
// //       return res.status(401).json({ message: 'Invalid email or password' });
// //     }

// //     const token = generateToken(user._id);

// //     return res.json({
// //       _id: user._id,
// //       name: user.name,
// //       email: user.email,
// //       role: user.role,
// //       prn: user.prn,
// //       token,
// //     });
// //   } catch (error) {
// //     return res.status(500).json({ message: error.message || 'Server error during login' });
// //   }
// // };

// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import { z } from 'zod';
// import User from '../models/User.js';

// // --- Zod Validation Schemas ---
// export const registerSchema = z.object({
//   name: z.string().min(2, 'Name must be at least 2 characters'),
//   email: z.string().email('Invalid email address'),
//   password: z.string().min(6, 'Password must be at least 6 characters'),
//   role: z.enum(['student', 'teacher']).default('student'),
//   prn: z.string().optional(),
// });

// export const loginSchema = z.object({
//   email: z.string().email('Invalid email address'),
//   password: z.string().min(1, 'Password is required'),
// });

// // --- JWT Token Helper ---
// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '7d' });
// };

// // --- Controllers ---

// // 1. Register
// export const register = async (req, res) => {
//   try {
//     const { name, email, password, role, prn } = req.body;

//     if (!name || !email || !password) {
//       return res.status(400).json({ message: 'Please provide all required fields' });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'User already exists with this email' });
//     }

//     if (role === 'student' && !prn) {
//       return res.status(400).json({ message: 'PRN / Roll Number is required for students' });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       role: role || 'student',
//       prn: role === 'teacher' ? '' : (prn || '').trim().toUpperCase(),
//     });

//     const token = generateToken(user._id);

//     return res.status(201).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       prn: user.prn,
//       token,
//     });
//   } catch (error) {
//     return res.status(500).json({ message: error.message || 'Server error during registration' });
//   }
// };

// // 2. Login
// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }

//     const token = generateToken(user._id);

//     return res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       prn: user.prn,
//       token,
//     });
//   } catch (error) {
//     return res.status(500).json({ message: error.message || 'Server error during login' });
//   }
// };

// // 3. Get Current Logged-in User Profile (getMe)
// export const getMe = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id || req.user._id).select('-password');
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     return res.json(user);
//   } catch (error) {
//     return res.status(500).json({ message: error.message || 'Failed to fetch user profile' });
//   }
// };

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import User from '../models/User.js';

// --- Zod Validation Schemas (Required by authRoutes.js) ---
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['student', 'teacher']).default('student'),
  prn: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// --- JWT Token Helper ---
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '7d' });
};

// --- Controllers ---

// 1. Register Controller (with PRN handling)
export const register = async (req, res) => {
  try {
    const { name, email, password, role, prn } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    if (role === 'student' && !prn) {
      return res.status(400).json({ message: 'PRN / Roll Number is required for students' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'student',
      prn: role === 'teacher' ? '' : (prn || '').trim().toUpperCase(),
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      prn: user.prn,
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error during registration' });
  }
};

// 2. Login Controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      prn: user.prn,
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error during login' });
  }
};

// 3. Get Current User Profile Controller (Required by authRoutes.js)
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id || req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to fetch user profile' });
  }
};