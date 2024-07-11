import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors({ origin: process.env.CORS_ORIGIN }))
app.use(cookieParser())




import userRoute from "./routes/user.route.js";
import todoRoute from "./routes/todo.route.js";


app.use("/api/v1/user", userRoute);
app.use("/api/v1/todo", todoRoute);



export default app;