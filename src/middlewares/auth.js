import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { prisma } from "../config/prisma.js";

dotenv.config();

export const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: "Server JWT secret not configured" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded?.id;
    if (!userId) {
      return res.status(401).json({ message: "Invalid token: missing user id" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(401).json({ message: "Invalid token: user not found" });
    }

    req.user = { id: user.id, email: user.email, role: user.role };
    return next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};
