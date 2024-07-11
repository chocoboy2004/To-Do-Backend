import { Router } from "express";
import { 
    createTodo 
} from "../controllers/todo.controller.js";

const router = Router()

router.route("/create").post(createTodo);

export default router;