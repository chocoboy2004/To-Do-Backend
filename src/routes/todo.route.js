import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import { 
    createTodo, 
    deleteTodo
} from "../controllers/todo.controller.js";

const router = Router()

router.route("/create").post(verifyJWT, createTodo);
router.route("/delete/:id").post(deleteTodo);

export default router;