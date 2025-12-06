import { prisma } from "../config/prisma.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { comparePassword } from "../utils/hash.js";

dotenv.config();

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user)
      return res.status(404).json({ message: "User not found" });

    const isValid = await comparePassword(password, user.password);

    if (!isValid)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      success: true,
      token,
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

export const me = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, role: true, name: true }
    });

    return res.json({ success: true, user });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
