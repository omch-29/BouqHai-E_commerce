const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

// POST /api/auth/admin/login
const adminLogin = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }
  if (
    email.toLowerCase() !== process.env.ADMIN_EMAIL.toLowerCase() ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ message: "Incorrect email or password." });
  }
  const token = signToken({ id: "admin", role: "admin", email });
  res.json({ token, role: "admin", name: "Admin" });
};

// POST /api/auth/signup
const signup = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email: email.toLowerCase(), phone, password: hashed });
    const token = signToken({ id: user._id, role: "user", email: user.email });
    res.status(201).json({ token, role: "user", name: user.name, userId: user._id });
  } catch (err) {
    res.status(500).json({ message: "Could not create account.", error: err.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });
    if (!user) return res.status(401).json({ message: "Incorrect email or password." });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Incorrect email or password." });
    const token = signToken({ id: user._id, role: "user", email: user.email });
    res.json({ token, role: "user", name: user.name, userId: user._id });
  } catch (err) {
    res.status(500).json({ message: "Login failed.", error: err.message });
  }
};

module.exports = { adminLogin, signup, login };