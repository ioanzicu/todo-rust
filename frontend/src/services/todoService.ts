// Using the interfaces we defined earlier
export interface TodoItem {
  title: string;
  status: 'PENDING' | 'DONE';
}

export interface TodoResponse {
  pending_items: TodoItem[];
  done_items: TodoItem[];
  pending_items_count: number;
  done_item_count: number;
}

const API_URL = import.meta.env.VITE_API_URL;
const TOKEN = import.meta.env.VITE_API_TOKEN;

/**
 * Fetches all todos and counts from the server
 */
export const getTodos = async (): Promise<TodoResponse> => {
  const response = await fetch(`${API_URL}/v1/item/get`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'token': TOKEN 
    }
  });

  if (!response.ok) {
    // We throw the error so the component can catch it and show a UI message
    throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
  }

  return response.json();
};