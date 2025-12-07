import { prisma } from "../config/prisma.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { comparePassword } from "../utils/hash.js";
import { hashPassword } from "../utils/hash.js";

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

export const resetPassword = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'currentPassword and newPassword are required' });
    }

    const checks = [
      { re: /[a-z]/, msg: 'at least one lowercase letter' },
      { re: /[A-Z]/, msg: 'at least one uppercase letter' },
      { re: /[0-9]/, msg: 'at least one number' },
      { re: /[^A-Za-z0-9]/, msg: 'at least one symbol' },
    ];

    if (newPassword.length < 12) {
      return res.status(400).json({ message: 'Password must be at least 12 characters long' });
    }

    const failed = checks.filter(c => !c.re.test(newPassword)).map(c => c.msg);
    if (failed.length) {
      return res.status(400).json({ message: `Password must contain ${failed.join(', ')}` });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const valid = await comparePassword(currentPassword, user.password);
    if (!valid) return res.status(401).json({ message: 'Current password is incorrect' });

    const hashed = await hashPassword(newPassword);
    await prisma.user.update({ where: { id: userId }, data: { password: hashed } });

    return res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};
