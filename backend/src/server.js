import express from "express";
import { PORT } from "./config/index.js";
import healthRoutes from "./routes/health.js";
import sessionRoutes from "./routes/session.js";
// import authRoutes from "./routes/authentication.js";
import tasksRoutes from "./routes/tasks.js";
import commentRoutes from "./routes/comments.js";
import notificationRoutes from "./routes/notifications.js";
import fileRoutes from "./routes/files.js";
import projectFileRoutes from "./routes/projectFile.routes.js";
import docRoutes from "./routes/doc.routes.js";
import docFileRoutes from "./routes/docFile.routes.js";
import cors from "cors";
import authRoutes from './routes/auth.routes.js'
import projectRoutes from './routes/projects.routes.js'
import organizationRoutes from './routes/organization.routes.js'
import overviewRoutes from './routes/overview.routes.js'
import announcementRoutes from './routes/announcement.routes.js'

const app = express();

app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));


app.use('/auth', authRoutes)
app.use('/api', projectRoutes)
app.use('/api/organization', organizationRoutes)
app.use('/api/overview', overviewRoutes)
// app.use("/auth", authRoutes);
app.use("/health", healthRoutes);
app.use("/session", sessionRoutes);
app.use("/tasks", tasksRoutes);
app.use("/tasks", commentRoutes);
app.use("/api/tasks", fileRoutes);
app.use("/api/projects", projectFileRoutes);
app.use("/api/docs", docRoutes);
app.use("/api/docs", docFileRoutes); 
app.use("/api/announcements", announcementRoutes);
app.use("/notifications", notificationRoutes);

// Global fallback (404)
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    code: "NOT_FOUND",
    message: "Route not found",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});
