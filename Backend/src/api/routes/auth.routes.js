import express from "express";
import { createUser, login, getAllUsers } from "../controllers/auth.controller.js";

const router = express.Router();
router.post("/register", createUser);
router.post("/login", login);
router.get("/users", getAllUsers);
export default router;