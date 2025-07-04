import { useState, useEffect } from "react";
import { Trash } from "lucide-react";

type Priority = "high" | "medium" | "low";

interface Subtask {
    id: number;
    title: string;
    completed: boolean;
}

interface AddTaskModalProps {
    onClose: () => void;
    onSave: (
        task: {
            title: string;
            priority: Priority;
            assignee: string;
            checklist: Subtask[];
            dueDate: string;
        },
        taskId?: string // <-- for PATCH (update)
    ) => void;
    existingTask?: {
        _id?: string;
        title: string;
        priority: Priority;
        assignee: string;
        checklist: Subtask[];
        dueDate: string;
    };
}

export default function AddTaskModal({ onClose, onSave, existingTask }: AddTaskModalProps) {
    const [title, setTitle] = useState("");
    const [priority, setPriority] = useState<Priority | "">("");
    const [assignee, setAssignee] = useState("");
    const [checklist, setChecklist] = useState<Subtask[]>([
        { id: Date.now(), title: "", completed: false },
    ]);
    const [dueDate, setDueDate] = useState("");

    useEffect(() => {
        if (existingTask) {
            setTitle(existingTask.title || "");
            setPriority(existingTask.priority || "");
            setAssignee(existingTask.assignee || "");
            setChecklist(existingTask.checklist || []);
            setDueDate(existingTask.dueDate ? existingTask.dueDate.slice(0, 10) : ""); // strip time if needed
        }
    }, [existingTask]);

    const handleSubtaskChange = (id: number, title: string) => {
        setChecklist((prev) =>
            prev.map((item) => (item.id === id ? { ...item, title } : item))
        );
    };

    const addNewSubtask = () => {
        setChecklist((prev) => [...prev, { id: Date.now(), title: "", completed: false }]);
    };

    const removeSubtask = (id: number) => {
        setChecklist((prev) => prev.filter((item) => item.id !== id));
    };

    const handleSave = () => {
        if (!title || !priority || checklist.filter((t) => t.title.trim()).length < 1) {
            alert("Please fill all required fields.");
            return;
        }

        const taskPayload = {
            title,
            priority: priority as Priority,
            assignee,
            checklist,
            dueDate,
        };

        onSave(taskPayload, existingTask?._id); // <-- Send taskId if editing
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-xl p-6 space-y-4">
                <h2 className="text-xl font-semibold">
                    {existingTask ? "Edit Task" : "Add Task"}
                </h2>

                {/* Title */}
                <div>
                    <label className="font-medium">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Enter Task Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                    />
                </div>

                {/* Priority */}
                <div>
                    <label className="font-medium">
                        Select Priority <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-3 mt-2">
                        {["high", "medium", "low"].map((p) => (
                            <button
                                key={p}
                                onClick={() => setPriority(p as Priority)}
                                className={`px-3 py-1 border rounded-full text-sm font-medium ${priority === p
                                        ? "border-black"
                                        : "border-gray-300 text-gray-600"
                                    }`}
                            >
                                <span
                                    className={`inline-block w-2 h-2 rounded-full mr-2 ${p === "high"
                                            ? "bg-pink-500"
                                            : p === "medium"
                                                ? "bg-blue-500"
                                                : "bg-green-500"
                                        }`}
                                ></span>
                                {p.toUpperCase()} PRIORITY
                            </button>
                        ))}
                    </div>
                </div>

                {/* Assignee */}
                <div>
                    <label className="font-medium">Assign to</label>
                    <input
                        type="text"
                        placeholder="Add an assignee"
                        value={assignee}
                        onChange={(e) => setAssignee(e.target.value)}
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                    />
                </div>

                {/* Checklist */}
                <div>
                    <label className="font-medium">
                        Checklist ({checklist.filter((t) => t.title.trim()).length}/
                        {checklist.length}) <span className="text-red-500">*</span>
                    </label>
                    {checklist.map((item) => (
                        <div key={item.id} className="flex items-center mt-2 gap-2">
                            <input
                                type="checkbox"
                                checked={item.completed}
                                onChange={() =>
                                    setChecklist((prev) =>
                                        prev.map((t) =>
                                            t.id === item.id ? { ...t, completed: !t.completed } : t
                                        )
                                    )
                                }
                            />
                            <input
                                type="text"
                                placeholder="Enter task"
                                value={item.title}
                                onChange={(e) => handleSubtaskChange(item.id, e.target.value)}
                                className="flex-1 px-3 py-1 border rounded-md"
                            />
                            <button onClick={() => removeSubtask(item.id)}>
                                <Trash className="text-red-500" size={18} />
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={addNewSubtask}
                        className="text-sm text-blue-600 mt-2 underline"
                    >
                        + Add New
                    </button>
                </div>

                {/* Due Date */}
                <div>
                    <label className="font-medium">Due Date</label>
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                    />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4 mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-red-500 text-red-500 rounded-md"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-teal-600 text-white rounded-md"
                    >
                        {existingTask ? "Update" : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
}
