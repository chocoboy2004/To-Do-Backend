import mongoose from "mongoose";
import { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const todoSchema = new Schema({
    name: {
        type: String,
        required: [true, "todo name is required"]
    },
    description: {
        type: String
    },
    isCompleted: {
        type: Boolean,
        required: true,
        default: false
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "user reference is nescessary"]
    }
}, { timestamps: true })

todoSchema.plugin(mongooseAggregatePaginate);
const Todo = mongoose.model("Todo", todoSchema)

export default Todo;