import { useCallback, useEffect, useState } from 'react';
import './App.css';
import CreateToDoItem from './components/CreateToDoItem';
import Footer from './components/Footer';
import ToDoItem from './components/ToDoItem';
import { getTodos, type TodoResponse } from './services/todoService';

const TodoApp = () => {
  const [data, setData] = useState<TodoResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 1. Define the Refresh Logic
  // Using useCallback prevents unnecessary re-renders of child components
  const refreshData = useCallback(async () => {
    try {
      const result = await getTodos();
      setData(result);
      setError(null); // Clear any previous errors on success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Initial Load
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  if (loading && !data) return <div>Loading your gorgeous tasks...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div className="mainContainer">
      <h1 className="main-title">Oh! My Gorgeous <br /> Todo List!</h1>

      <div className="header">

        <div className="stats-container">
          <p>Completed: <span id="completeNum">{data?.done_item_count ?? 0}</span></p>
          <p>Pending: <span id="pendingNum">{data?.pending_items_count ?? 0}</span></p>
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
  );
};

export default TodoApp;