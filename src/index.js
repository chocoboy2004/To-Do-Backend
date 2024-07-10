import connectDB from "./db/server.js";
import app from "./app.js";
import dotenv from "dotenv";

dotenv.config({
    path: "./.env"
})

connectDB()
.then(() => {
    app.on("error", (error) => {
        console.log(error);
    })
})
.then(() => {
    app.listen(process.env.PORT || 4444, () => {
        console.log(`Database connected successfully!`);
        console.log(`App is listining on: http://localhost:${process.env.PORT || 4444}`);
    })
})
.catch(error => console.error(error))