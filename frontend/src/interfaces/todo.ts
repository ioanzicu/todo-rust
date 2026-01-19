export interface ToDoItemProps {
  title: string;
  status: 'PENDING' | 'DONE';
  passBackResponse: (data: any) => void;
}