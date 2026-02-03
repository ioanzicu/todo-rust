import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import CreateToDoItem from './components/CreateToDoItem';
import Footer from './components/Footer';
import ToDoItem from './components/ToDoItem';
import { getTodos, type TodoResponse } from './services/todoService';

interface TodoAppProps {
  onLogout?: () => void;
}

const TodoApp: React.FC<TodoAppProps> = ({ onLogout }) => {

  const [data, setData] = useState<TodoResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshData = useCallback(async () => {
    try {
      const result = await getTodos();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  if (loading && !data) return <div>Loading your gorgeous tasks...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <>
      <div>
        {onLogout && (
          <button onClick={onLogout}>
            Logout
          </button>
        )}
      </div>

      <div className="mainContainer">
        <h1 className="main-title">Oh! My Gorgeous <br /> Todo List!</h1>

        <div className="header">

          <div className="stats-container">
            <p>Completed: <span id="completeNum">{data?.done_item_count ?? 0}</span></p>
            <p>Pending: <span id="pendingNum">{data?.pending_item_count ?? 0}</span></p>
          </div>

        </div>

        <div id="doneItems">
          <h2>Done Items</h2>
          {data?.done_items.map((item, index) => (
            <ToDoItem
              key={`${item.title}-${index}`}
              title={item.title}
              status={item.status}
              passBackResponse={refreshData}
            />
          ))}
        </div>

        <div id="pendingItems">
          <h2>To Do Items</h2>
          {data?.pending_items.map((item, index) => (
            <ToDoItem
              key={`${item.title}-${index}`}
              title={item.title}
              status={item.status}
              passBackResponse={refreshData}
            />
          ))}
        </div>

        <CreateToDoItem passBackResponse={refreshData} />

        <Footer />
      </div>
    </>
  );
};

export default TodoApp;