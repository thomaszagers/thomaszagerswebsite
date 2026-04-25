import { Router } from "express";
import { setAdminSession, verifyAdminCredentials } from "../lib/auth.js";

const router = Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body ?? {};

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  const isValid = await verifyAdminCredentials(username, password);

  if (!isValid) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  setAdminSession(req);
  req.session.save((error) => {
    if (error) {
      return res.status(500).json({ message: "Failed to save session." });
    }

    return res.json({
      user: {
        username: req.session.username,
      },
    });
  });
});

router.post("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({ message: "Failed to log out." });
    }

    res.clearCookie("thomas_admin_sid");
    return res.json({ success: true });
  });
});

router.get("/me", (req, res) => {
  if (!req.session.isAdmin) {
    return res.status(401).json({ authenticated: false });
  }

  return res.json({
    authenticated: true,
    user: {
      username: req.session.username,
    },
  });
});

export default router;