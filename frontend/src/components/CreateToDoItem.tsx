import React, { useState } from 'react';
import { createTodo } from '../services/todoService';

interface CreateProps {
    passBackResponse: (response: any) => void;
}

const CreateToDoItem: React.FC<CreateProps> = ({ passBackResponse }) => {
    const [title, setTitle] = useState("");

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleCreate = async () => {
        if (!title.trim()) return;

        try {
            const data = await createTodo(title);

            setTitle("");
            passBackResponse(data);
        } catch (error) {
            console.error("Failed to create item:", error);
        }
    };

    return (
        <div className="inputContainer">
            <input
                type="text"
                id="name"
                placeholder="create to do item"
                value={title}
                onChange={handleTitleChange}
            />
            <button
                className="actionButton"
                id="create-button"
                onClick={handleCreate}
            >
                Create
            </button>
        </div>
    );
};

export default CreateToDoItem;