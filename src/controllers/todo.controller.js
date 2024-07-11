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

    const response = await Todo.findById(new mongoose.Types.ObjectId(id))
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

const updateTodo = AsyncHandler(async(req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!id) {
        throw new ApiError(400, "Id is required")
    }
    
    if (!name && !description) {
        throw new ApiError(400, "todo name or description is needed")
    }

    const response = await Todo.findById(new mongoose.Types.ObjectId(id))

    if (!response) {
        throw new ApiError(400, "Invalid todo id")
    }

    response.name = name.trim() !== "" ? name.trim() : response.name
    response.description = description.trim() !== "" ? description.trim() : response.description
    await response.save({ validateBeforeSave: false })

    const updatedTodo = await Todo.findById(response._id)

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, updatedTodo, "Todo updated successfully!"
        )
    )
})

const displayAllTodos = AsyncHandler(async(req, res) => {
    const user = req.user._id;
    if (!user) {
        throw new ApiError(404, "Token got expired")
    }

    const todo = await Todo.find({ createdBy: user })
    if (!todo) {
        throw new ApiError(404, "You have not listed any todo")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            todo,
            "All todos are fetched successfully!"
        )
    )
})

const toggle = AsyncHandler(async(req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new ApiError(400, "Id is required")
    }

    const todo = await Todo.findById(new mongoose.Types.ObjectId(id))
    if (!todo) {
        throw new ApiError(400, "Invalid todo id or todo is not created yet")
    }

    todo.isCompleted = !todo.isCompleted
    await todo.save({ validateBeforeSave: false })

    const response = await Todo.findById(todo._id)

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, response, "Todo status has been updated successfully!"
        )
    )
})

export {
    createTodo,
    deleteTodo,
    updateTodo,
    displayAllTodos,
    toggle
}