import Task from "../models/tasks.js";

// Create a task
export const createTask = async (req, res) => {
    try {
        const { title, priority, assigneeName, dueDate, subtasks } = req.body;

        if (!title || !priority) {
            return res.status(400).json({ error: "Title and priority are required." });
        }

        const task = new Task({ title, priority, assigneeName, dueDate, subtasks });
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all tasks
export const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get task by ID
export const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ error: "Task not found" });
        res.json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a task
export const updateTask = async (req, res) => {
    try {
        const updated = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updated) return res.status(404).json({ error: "Task not found" });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a task
export const deleteTask = async (req, res) => {
    try {
        const deleted = await Task.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Task not found" });
        res.json({ message: "Task deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a subtask (text or completed)
export const updateSubtask = async (req, res) => {
    try {
        const { id, subtaskId } = req.params;
        const { text, completed } = req.body;

        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ error: "Task not found" });

        const subtask = task.subtasks.id(subtaskId);
        if (!subtask) return res.status(404).json({ error: "Subtask not found" });

        if (text !== undefined) subtask.text = text;
        if (completed !== undefined) subtask.completed = completed;

        await task.save();
        res.json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a subtask
export const deleteSubtask = async (req, res) => {
    try {
        const { id, subtaskId } = req.params;

        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ error: "Task not found" });

        task.subtasks.id(subtaskId).remove();
        await task.save();
        res.json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
