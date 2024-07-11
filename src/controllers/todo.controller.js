import AsyncHandler from "../utils/AsyncHandler.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import Todo from "../models/todo.model.js"

const createTodo = AsyncHandler(async(req, res) => {
    const { name, description } = req.body;
    if (!name || !description) {
        throw new ApiError(400, "todo name and description is needed")
    }
    if (name === " " || description === " ") {
        throw new ApiError(400, "fields should not be empty")
    }
    if (name.length < 1 || description.length < 1) {
        throw new ApiError(400, "Provide valid inputs")
    }

    const todo = await Todo.create({
        name: name.trim(),
        description: description.trim(),
        createdBy: req.user._id
    })

    const response = await Todo.findOne(todo._id)
    if (!response) {
        throw new ApiError(500, "Something went wrong while creating todo")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, response, "Todo created successfully!")
    )
})

export {
    createTodo
}