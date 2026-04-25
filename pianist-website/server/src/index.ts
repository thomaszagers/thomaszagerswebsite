import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/events.js";

declare module "express-session" {
  interface SessionData {
    isAdmin?: boolean;
    username?: string;
  }
}

const app = express();

const PORT = Number(process.env.PORT || 3001);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const SESSION_SECRET = process.env.SESSION_SECRET;

if (!SESSION_SECRET) {
  throw new Error("Missing SESSION_SECRET in environment.");
}

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    name: "thomas_admin_sid",
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 8,
    },
  }),
);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/admin", authRoutes);
app.use("/api/admin/events", eventRoutes);

app.listen(PORT, () => {
  console.log(`Admin server running on http://localhost:${PORT}`);
});
