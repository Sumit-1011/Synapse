import { MoreHorizontal } from "lucide-react";
import { useState } from "react";

const Menu = ({ taskId }: { taskId: string }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button onClick={() => setOpen((prev) => !prev)}>
                <MoreHorizontal className="w-5 h-5 text-gray-500" />
            </button>
            {open && (
                <div className="absolute right-0 mt-2 w-28 bg-white border rounded shadow z-10">
                    <button
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                        onClick={() => {
                            // trigger edit
                            console.log("Edit", taskId);
                            setOpen(false);
                        }}
                    >
                        Edit
                    </button>
                    <button
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm text-red-500"
                        onClick={() => {
                            // trigger delete
                            console.log("Delete", taskId);
                            setOpen(false);
                        }}
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};

export default Menu;
