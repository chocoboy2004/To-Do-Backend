import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import {
  loginUser,
  logoutUser,
  registerUser,
  updateProfileInfo
} from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(verifyJWT, logoutUser);
router.route("/update-details").patch(verifyJWT, updateProfileInfo);

export default router;
