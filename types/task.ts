export type TaskPriority = "High" | "Medium" | "Low";
export type TaskStatus = "In Progress" | "Completed";

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
}

export type SortOrder = "asc" | "desc";

export interface TaskFilters {
  priority: TaskPriority | "All";
  status: TaskStatus | "All";
  search: string;
}
