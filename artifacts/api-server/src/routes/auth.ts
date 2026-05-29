import { Router } from "express";
import { logger } from "../lib/logger";

const router = Router();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin123";

router.post("/auth/login", (req, res) => {
  const { username, password } = req.body as { username?: string; password?: string };

  if (!username || !password) {
    res.status(400).json({ error: "Username and password are required" });
    return;
  }

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  req.session.admin = { username, role: "admin" };
  req.log.info({ username }, "Admin logged in");
  res.json({ success: true, user: { username, role: "admin" } });
});

router.post("/auth/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      logger.error({ err }, "Error destroying session");
    }
  });
  res.json({ success: true });
});

router.get("/auth/me", (req, res) => {
  if (!req.session.admin) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  res.json(req.session.admin);
});

export default router;
