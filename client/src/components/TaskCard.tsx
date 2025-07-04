// TaskCard.tsx
import { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { MoreHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import SubtaskItem from "./SubtaskItem";

type Subtask = {
    _id: string;
    text: string;
    completed: boolean;
};

type TaskType = {
    _id: string;
    title: string;
    priority: "high" | "medium" | "low";
    status: "backlog" | "todo" | "inprogress" | "done";
    dueDate?: string;
    assignee?: string;
    subtasks?: Subtask[];
};

type TaskCardProps = {
    task: TaskType;
    index: number;
    status: TaskType["status"];
    onDelete?: (id: string) => void;
    onEdit?: (task: TaskType) => void;
};

const priorityColor = {
    high: "bg-pink-500 text-white",
    medium: "bg-yellow-400 text-white",
    low: "bg-green-500 text-white",
};

const TaskCard = ({ task, index, status, onDelete, onEdit }: TaskCardProps) => {
    const [showSubtasks, setShowSubtasks] = useState(false);
    const completed = task.subtasks?.filter(s => s.completed).length || 0;
    const total = task.subtasks?.length || 0;
    const initials = task.assignee ? task.assignee.slice(0, 2).toUpperCase() : "No Assignee";
    const due = task.dueDate
        ? new Date(task.dueDate).toLocaleString("en-US", { month: "short", day: "numeric" })
        : "";

    const [menuOpen, setMenuOpen] = useState(false);
    const [subtasks, setSubtasks] = useState<Subtask[]>(task.subtasks || []);
    //console.log("Subtasks for:", task.title, task.subtasks);

    const handleSubtaskUpdate = (updatedSubtask: Subtask) => {
        setSubtasks(prev =>
            prev.map(sub => (sub._id === updatedSubtask._id ? updatedSubtask : sub))
        );
      };

    return (
        <Draggable draggableId={`${status}-${task._id}`} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="bg-white p-4 rounded-xl shadow-md mb-3 border border-gray-200 relative"
                >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div
                                className={`w-2.5 h-2.5 rounded-full ${priorityColor[task.priority]}`}
                            />
                            <span className="uppercase text-xs font-semibold text-gray-700">
                                {task.priority} priority
                            </span>
                            <span className="bg-gray-200 text-xs text-center font-semibold px-2 py-0.5 rounded-full">
                                {initials}
                            </span>
                        </div>
                        <div className="relative">
                            <MoreHorizontal
                                className="cursor-pointer"
                                onClick={() => setMenuOpen(prev => !prev)}
                            />
                            {menuOpen && (
                                <div className="absolute right-0 mt-2 bg-white border rounded shadow-md z-10 text-sm">
                                    <button
                                        onClick={() => onEdit?.(task)}
                                        className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => onDelete?.(task._id)}
                                        className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold">{task.title}</h3>

                    {/* Checklist summary + toggle */}
                    <div className="flex items-center justify-between text-sm mt-2"
                        onClick={() => setShowSubtasks(prev => !prev)}
                    >
                        <p className="text-gray-600">Checklist ({completed}/{total})</p>
                        <button>
                            {showSubtasks ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                    </div>

                    {/* Checklist items */}
                    {showSubtasks && (
                        <div className="mt-2 space-y-1">
                            {subtasks.map((subtask) => (
                                <SubtaskItem
                                    key={subtask._id}
                                    taskId={task._id}
                                    subtask={subtask}
                                    onUpdate={handleSubtaskUpdate}
                                />
                            ))}
                        </div>
                    )}

                    {/* Footer info */}
                    <div className="mt-4 flex flex-wrap gap-2 items-center">
                        {due && (
                            <span className="bg-red-600 text-white text-xs px-3 py-0.5 rounded-full">
                                {due}
                            </span>
                        )}
                        <span className="bg-gray-100 text-xs px-3 py-0.5 rounded-full">
                            {task.status.replace("inprogress", "In Progress").toUpperCase()}
                        </span>
                    </div>
                </div>
            )}
        </Draggable>
    );
};

export default TaskCard;
