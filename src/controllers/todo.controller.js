import AsyncHandler from "../utils/AsyncHandler.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import Todo from "../models/todo.model.js"
import mongoose from "mongoose"

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

const deleteTodo = AsyncHandler(async(req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new ApiError(400, "Id is required")
    }

    const response = await Todo.findOne({ _id: new mongoose.Types.ObjectId(id) })
    if (!response) {
        throw new ApiError(400, "Invalid todo id or request")
    }

    await Todo.deleteOne(response._id)

    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "Todo deleted successfully!")
    )
})

export {
    createTodo,
    deleteTodo
}