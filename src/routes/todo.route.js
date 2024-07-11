import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import { 
    createTodo 
} from "../controllers/todo.controller.js";

const router = Router()

router.route("/create").post(verifyJWT, createTodo);

export default router;