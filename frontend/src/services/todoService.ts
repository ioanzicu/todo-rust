import apiRequest from './apiClient';

export interface TodoItem {
  title: string;
  status: 'PENDING' | 'DONE';
}

export interface TodoResponse {
  pending_items: TodoItem[];
  done_items: TodoItem[];
  pending_item_count: number;
  done_item_count: number;
}

/**
 * Get all items
 */
export const getTodos = () => {
  const token = localStorage.getItem('user-token');
  return apiRequest<TodoResponse>('/v1/item/get', 'GET', null, token);
}
/**
 * Update or Delete an item
 * @param action - "edit" or "delete"
 * @param title - The title of the task
 * @param nextStatus - The status to set
 */
export const updateTodoStatus = (action: 'edit' | 'delete', title: string, nextStatus: 'PENDING' | 'DONE') => {
  const token = localStorage.getItem('user-token');
  return apiRequest<any>(`/v1/item/${action}`, 'POST', {
    title,
    status: nextStatus
  }, token);
}

export const createTodo = (title: string) => {
  const token = localStorage.getItem('user-token');
  apiRequest<any>(`/v1/item/create/${encodeURIComponent(title)}`, 'POST', {}, token);
}
