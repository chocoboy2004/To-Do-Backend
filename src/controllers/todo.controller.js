import AsyncHandler from "../utils/AsyncHandler.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"

const createTodo = AsyncHandler(async(req, res) => {
    res.send("Hello Backend! Its me Rahul")
})

export {
    createTodo
}