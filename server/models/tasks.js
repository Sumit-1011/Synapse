import mongoose from "mongoose";

const subtaskSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
});

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        priority: {
            type: String,
            required: true,
            enum: ["high", "medium", "low"],
        },
        assigneeName: {
            type: String,
            default: "",
            trim: true,
        },
        status: {
            type: String,
            enum: ["backlog", "todo", "inprogress", "done"],
            default: "todo",
        },
        dueDate: {
            type: Date,
        },
        subtasks: [subtaskSchema],
    },
    { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
