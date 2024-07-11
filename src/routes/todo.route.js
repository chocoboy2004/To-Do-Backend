import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import { 
    createTodo, 
    deleteTodo,
    updateTodo,
    displayAllTodos,
    toggle
} from "../controllers/todo.controller.js";

const router = Router()

router.route("/create").post(verifyJWT, createTodo);
router.route("/delete/:id").post(verifyJWT, deleteTodo);
router.route("/update/:id").patch(verifyJWT, updateTodo);
router.route("/display-todos").get(verifyJWT, displayAllTodos);
router.route("/toggle/:id").patch(verifyJWT, toggle);

export default router;