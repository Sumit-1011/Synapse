import { useEffect, useState } from "react";
import {
    DragDropContext,
    Droppable,
} from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import TaskCard from "../components/TaskCard";
import API from "../utils/api";
import AddTaskModal from "../components/AddTaskModal";
import Sidebar from "../components/Sidebar";
import { getUserFromToken } from "../utils/getUser";
import { toast } from "react-hot-toast";

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
    assigneeName?: string;
    dueDate?: string;
    subtasks: Subtask[];
};
  

type ColumnType = {
    title: string;
    tasks: TaskType[];
};

type BoardType = {
    [key in TaskType["status"]]: ColumnType;
};

const initialColumns: BoardType = {
    backlog: { title: "Backlog", tasks: [] },
    todo: { title: "To Do", tasks: [] },
    inprogress: { title: "In Progress", tasks: [] },
    done: { title: "Done", tasks: [] },
};

const Dashboard = () => {
    const [board, setBoard] = useState<BoardType>(initialColumns);
    const [showModal, setShowModal] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<TaskType | null>(null);

    const user = getUserFromToken(); // { name, email, role }
    
    const handleSaveTask = async (
        task: {
            title: string;
            priority: "high" | "medium" | "low";
            assignee: string;
            dueDate: string;
            checklist: { id: number; title: string; completed: boolean }[];
        }
    ) => {
        const payload = {
            title: task.title,
            priority: task.priority,
            assigneeName: task.assignee,
            dueDate: task.dueDate,
            status: "todo", // new tasks go to 'To Do' by default
            subtasks: task.checklist
                .filter((s) => s.title.trim() !== "")
                .map((s) => ({
                    text: s.title,
                    completed: s.completed,
                })),
        };

        try {
            const res = await API.post("/api/tasks", payload);
            const createdTask = res.data;

            // Add the new task to the board
            setBoard((prev) => ({
                ...prev,
                [createdTask.status]: {
                    ...prev[createdTask.status as TaskType["status"]],
                    tasks: [...prev[createdTask.status as TaskType["status"]].tasks, createdTask],
                },
            }));
        } catch (error) {
            console.error("Error creating task:", error);
        }
    };
      

        useEffect(() => {
            const fetchTasks = async () => {
                try {
                    const res = await API.get("/api/tasks");
                    const updated = { ...initialColumns };
                    res.data.forEach((task: TaskType) => {
                        const status = task.status || "todo";
                        if (!updated[status].tasks.find(t => t._id === task._id)) {
                            updated[status].tasks.push(task);
                        }
                    });
                    setBoard(updated);
                } catch (error) {
                    console.error("Failed to fetch tasks", error);
                }
            };
            fetchTasks();
        }, []);

    const handleDragEnd = async (result: DropResult) => {
        const { source, destination } = result;
        if (!destination) return;

        const sourceCol = board[source.droppableId as TaskType["status"]];
        const destCol = board[destination.droppableId as TaskType["status"]];

        const [movedTask] = sourceCol.tasks.splice(source.index, 1);
        movedTask.status = destination.droppableId as TaskType["status"];
        destCol.tasks.splice(destination.index, 0, movedTask);

        setBoard({ ...board });

        try {
            await API.put(`/api/tasks/${movedTask._id}`, {
                status: movedTask.status,
            });
        } catch (err) {
            console.error("Failed to update task status", err);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await API.delete(`/api/tasks/${id}`);
            setBoard(prevBoard => {
                const updatedBoard: BoardType = { ...prevBoard };
                (Object.keys(updatedBoard) as TaskType["status"][]).forEach(status => {
                    updatedBoard[status] = {
                        ...updatedBoard[status],
                        tasks: updatedBoard[status].tasks.filter(task => task._id !== id),
                    };
                });
                console.log("Task deleted:", id);
                return updatedBoard;

            });
        } catch (error) {
            console.error("Failed to delete task", error);
        }
    };

    const handleEdit = async (updatedTask: TaskType) => {
        try {
            await API.put(`/api/tasks/${updatedTask._id}`, updatedTask);
            setBoard(prevBoard => {
                const newBoard: BoardType = { ...prevBoard };
                // Remove the task from all columns
                (Object.keys(newBoard) as TaskType["status"][]).forEach(status => {
                    newBoard[status] = {
                        ...newBoard[status],
                        tasks: newBoard[status].tasks.filter(task => task._id !== updatedTask._id),
                    };
                });
                // Add the updated task to the correct column
                newBoard[updatedTask.status].tasks.push(updatedTask);
                return newBoard;
            });
        } catch (error) {
            console.error("Failed to edit task", error);
        }
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 p-4 bg-gray-50">
            <button
                    className={`px-4 py-2 rounded mb-4 text-white ${user?.role === "admin" ? "bg-cyan-600 hover:bg-cyan-700" : "bg-gray-400 cursor-not-allowed"
                        }`}
                    onClick={() => {
                        if (user?.role === "admin") {
                            setShowModal(true);
                        } else {
                            toast.error("You need admin access to add tasks.");
                        }
                  }}
            >
                + Add Task
            </button>

            {showModal && (
                <AddTaskModal
                    onClose={() => {
                        setShowModal(false);
                        setTaskToEdit(null);
                    }}
                    onSave={(taskData) => {
                        if (taskToEdit) {
                            const updatedTask: TaskType = {
                                _id: taskToEdit._id,
                                title: taskData.title,
                                priority: taskData.priority,
                                assigneeName: taskData.assignee,
                                dueDate: taskData.dueDate,
                                status: taskToEdit.status,
                                subtasks: taskData.checklist.map((s, idx) => ({
                                    _id: taskToEdit.subtasks?.[idx]?._id || Math.random().toString(36).slice(2),
                                    text: s.title,
                                    completed: s.completed,
                                })),
                            };
                            handleEdit(updatedTask);
                        } else {
                            handleSaveTask(taskData);
                        }

                        setShowModal(false);
                        setTaskToEdit(null);
                    }}
                      
                    existingTask={
                        taskToEdit && {
                            _id: taskToEdit._id,
                            title: taskToEdit.title,
                            priority: taskToEdit.priority,
                            assignee: taskToEdit.assigneeName,
                            dueDate: taskToEdit.dueDate,
                            checklist: taskToEdit.subtasks.map((s, idx) => ({
                                id: idx,
                                title: s.text,
                                completed: s.completed,
                            })),
                        }
                    }
                      
                      
                />
              
            )}

            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-4 gap-4">
                    {Object.entries(board).map(([status, col]) => (
                        <Droppable droppableId={status} key={status}>
                            {(provided) => (
                                <div
                                    className="bg-gray-100 p-3 rounded-2xl h-screen overflow-y-auto"
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    <h2 className="font-semibold mb-2 text-2xl bg-emerald-200 text-center rounded-lg">{col.title}</h2>
                                    {col.tasks.map((task, index) => (
                                        <TaskCard
                                            key={task._id}
                                            task={task}
                                            index={index}
                                            status={status as TaskType["status"]}
                                            onDelete={handleDelete}
                                            onEdit={(task) => {
                                                setTaskToEdit(task);
                                                setShowModal(true);
                                              }}
                                        />
                                    
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>
            </div>
            </div>
    );
};

export default Dashboard;
