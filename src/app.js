import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import articleRoutes from "./routes/article.routes.js";
import projectRoutes from "./routes/project.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", articleRoutes);
app.use("/api", projectRoutes)

export default app;
