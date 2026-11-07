import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import User from "../models/User.js";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["admin", "teacher", "student"]).default("student"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const register = async (req, res) => {
  const { name, email, password, role } = req.validatedBody;
  const existing = await User.findOne({ email });
  if (existing) {
    return res
      .status(409)
      .json({ error: "User with this email already exists" });
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = await User.create({ name, email, passwordHash, role });
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "8h" },
  );

  res.status(201).json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
};

export const login = async (req, res) => {
  const { email, password } = req.validatedBody;
  const user = await User.findOne({ email });
  if (!user || !user.isActive) {
    return res
      .status(401)
      .json({ error: "Invalid credentials or inactive user" });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "8h" },
  );

  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
};

export const getMe = async (req, res) => {
  res.json({ user: req.user });
};
