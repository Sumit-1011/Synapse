import express from "express";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/user", verifyToken, (req, res) => {
    res.json({
        status: "ok",
        message: "User route accessed",
        user: req.user,
    });
});

router.get("/admin", verifyToken, verifyAdmin, (req, res) => {
    res.json({
        status: "ok",
        message: "Admin route accessed",
        user: req.user,
    });
});

export default router;
