import { useEffect, useState } from 'react';
import { getTodos, type TodoResponse } from './services/todoService';

const TodoApp = () => {
  const [data, setData] = useState<TodoResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const result = await getTodos();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <div>Loading your gorgeous tasks...</div>;
  if (error) return <div style={{ color: 'var(--text-main)' }}>Error: {error}</div>;

  return (
    <div>
      {/* Use your styled Header here */}
      <div className="header">
        <p>Completed: <span id="completeNum">{data?.done_item_count}</span></p>
        <p>Pending: <span id="pendingNum">{data?.pending_items_count}</span></p>
      </div>

      <>
        <h1>Done Items</h1>
        {data?.done_items.map((item, index) => (
          <div key={index} className="itemContainer">
            <p>{item.title}</p>
          </div>
        ))}
      </>

      <>
        <h1>Pending Items</h1>
        {data?.pending_items.map((item, index) => (
          <div key={index} className="itemContainer">
            <p>{item.title}</p>
          </div>
        ))}
      </>
    </div>
  );
};

export default TodoApp