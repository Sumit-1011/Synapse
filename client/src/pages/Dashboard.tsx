import { useEffect, useState } from "react";
import {
    DragDropContext,
    Droppable,
    Draggable,
} from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import API from "../utils/api";

type TaskType = {
    _id: string;
    title: string;
    priority: "high" | "medium" | "low";
    status: "backlog" | "todo" | "inprogress" | "done";
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

    return (
        <div className="p-4">
            <button className="bg-cyan-600 text-white px-4 py-2 rounded mb-4">
                + Add Task
            </button>

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
                                        <Draggable
                                            draggableId={`${status}-${task._id}`} // prevent duplicate IDs
                                            index={index}
                                            key={`${status}-${task._id}`}
                                        >
                                            {(provided, ) => (
                                                <div
                                                    className="bg-white p-2 mb-2 rounded shadow"
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <p className="font-medium">{task.title}</p>
                                                    <p className="text-sm text-gray-500 capitalize">
                                                        {task.priority}
                                                    </p>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
};

export default Dashboard;
