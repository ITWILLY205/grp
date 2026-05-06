import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// Load environment variables
dotenv.config();
import authRoutes from "./routes/authRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import disciplineRoutes from "./routes/disciplineRoutes.js";
const app = express();
// Middleware
app.use(cors());
app.use(express.json());
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/discipline", disciplineRoutes);
// Basic Route
app.get("/", (req, res) => {
    res.json({ message: "Scholar Sphere Professional API is running" });
});
// Health Check
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: "Internal Server Error",
        message: err.message || "An unhandled error occurred",
    });
});
export default app;
//# sourceMappingURL=app.js.map