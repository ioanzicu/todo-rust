import { useState } from "react";
import { type ToDoItemProps } from "../interfaces/todo";
import { updateTodoStatus } from "../services/todoService";

const ToDoItem: React.FC<ToDoItemProps> = ({ title, status: initialStatus, passBackResponse }) => {
    const [currentStatus, setCurrentStatus] = useState(initialStatus);

    const handleAction = async () => {
        const action = currentStatus === "PENDING" ? "edit" : "delete";
        const nextStatus = currentStatus === "PENDING" ? "DONE" : "PENDING";

        try {
            const data = await updateTodoStatus(action, title, nextStatus);

            setCurrentStatus(nextStatus);
            passBackResponse(data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="itemContainer">
            <p className={currentStatus === 'DONE' ? 'strikethrough' : ''}>{title}</p>
            <button className="actionButton" onClick={handleAction}>
                {currentStatus === "PENDING" ? "edit" : "delete"}
            </button>
        </div>
    );
};

export default ToDoItem;