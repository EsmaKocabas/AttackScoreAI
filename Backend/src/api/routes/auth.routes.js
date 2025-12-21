import express from "express";
import { createUser, login, getAllUsers, updateUser, deleteUser } from "../controllers/auth.controller.js";

const router = express.Router();
router.post("/register", createUser);
router.post("/login", login);
router.get("/users", getAllUsers);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
export default router;