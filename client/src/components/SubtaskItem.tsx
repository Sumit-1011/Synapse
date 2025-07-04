import { useState, useEffect } from "react";
import API from "../utils/api"; // ✅ Adjust path as needed

type Subtask = {
    _id: string;
    text: string;
    completed: boolean;
};

type Props = {
    taskId: string; 
    subtask: Subtask;
    onUpdate: (updated: Subtask) => void;
};

const SubtaskItem = ({ taskId, subtask, onUpdate }: Props) => {
    const [editing, setEditing] = useState(false);
    const [text, setText] = useState(subtask.text);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setText(subtask.text);
    }, [subtask.text]);

    const optimisticUpdate = (fields: Partial<Subtask>) => {
        const optimisticSubtask = { ...subtask, ...fields };
        onUpdate(optimisticSubtask); // ✅ immediately update UI
        return optimisticSubtask;
    };
    

    const handleUpdate = async (updatedFields: Partial<Subtask>) => {

        optimisticUpdate(updatedFields);

        try {
            setLoading(true);
            const res = await API.patch(`/api/tasks/${ taskId }/subtasks/${ subtask._id }`, {
                ...updatedFields
            });
            const updated = res.data;
            onUpdate(updated); // send updated back to parent
        } catch (err) {
            console.error("Failed to update subtask:", err);
            onUpdate(subtask);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckboxChange = () => {
        handleUpdate({ completed: !subtask.completed });
    };

    const handleBlur = () => {
        setEditing(false);
        if (text.trim() && text !== subtask.text) {
            handleUpdate({ text });
        }
    };

    return (
        <div className="flex items-center gap-2 p-1 rounded hover:bg-gray-50">
            <input
                type="checkbox"
                checked={subtask.completed}
                onChange={handleCheckboxChange}
                disabled={loading}
                className="cursor-pointer"
            />
            {editing ? (
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onBlur={handleBlur}
                    autoFocus
                    disabled={loading}
                    className="text-sm border-b border-gray-300 focus:outline-none px-1 py-0.5 w-full"
                />
            ) : (
                <p
                    onClick={() => setEditing(true)}
                    className={`text-sm cursor-pointer w-full ${subtask.completed ? "line-through text-gray-400" : "text-gray-800"
                        }`}
                >
                    {subtask.text}
                </p>
            )}
        </div>
    );
};

export default SubtaskItem;
