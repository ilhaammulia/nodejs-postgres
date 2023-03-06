import express from "express";
import {
  getUsers,
  createUser,
  login,
  logout,
} from "../controllers/UserController.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshTokenController.js";

const router = express.Router();

router.get("/users", verifyToken, getUsers);
router.post("/users", createUser);
router.post("/users/login", login);
router.get("/users/token", refreshToken);
router.get("/users/logout", logout);

export default router;
