"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Task, TaskFormData, SortOrder, TaskFilters } from "@/types/task";

interface TaskState {
  tasks: Task[];
  filters: TaskFilters;
  sortOrder: SortOrder;
}

type TaskAction =
  | { type: "ADD_TASK"; payload: TaskFormData }
  | { type: "UPDATE_TASK"; payload: { id: string; data: TaskFormData } }
  | { type: "DELETE_TASK"; payload: string }
  | { type: "SET_FILTERS"; payload: Partial<TaskFilters> }
  | { type: "SET_SORT_ORDER"; payload: SortOrder };

interface TaskContextType {
  state: TaskState;
  dispatch: React.Dispatch<TaskAction>;
  addTask: (data: TaskFormData) => void;
  updateTask: (id: string, data: TaskFormData) => void;
  deleteTask: (id: string) => void;
  setFilters: (filters: Partial<TaskFilters>) => void;
  setSortOrder: (order: SortOrder) => void;
  clearAllFilters: () => void;
  getFilteredAndSortedTasks: () => Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Dummy data
const initialTasks: Task[] = [
  {
    id: "1",
    title: "Write blog post on AI trends",
    description:
      "Fix the authentication issue causing login failures for some users.",
    dueDate: "2024-05-06",
    priority: "Medium",
    status: "Completed",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-10T00:00:00Z",
  },
  {
    id: "2",
    title: "Update client presentation",
    description:
      "Update the slides with the latest client feedback and statistics.",
    dueDate: "2024-04-17",
    priority: "Medium",
    status: "Completed",
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-07T00:00:00Z",
  },
  {
    id: "3",
    title: "Prepare quarterly report",
    description:
      "Design mockups for the upcoming feature release in the next sprint.",
    dueDate: "2024-06-19",
    priority: "Medium",
    status: "Completed",
    createdAt: "2024-01-03T00:00:00Z",
    updatedAt: "2024-01-04T00:00:00Z",
  },
  {
    id: "4",
    title: "Update client presentation",
    description:
      "Conduct interviews with users to gather feedback on the new app features.",
    dueDate: "2024-02-17",
    priority: "Medium",
    status: "In Progress",
    createdAt: "2024-01-04T00:00:00Z",
    updatedAt: "2024-01-05T00:00:00Z",
  },
  {
    id: "5",
    title: "Prepare quarterly report",
    description:
      "Update the slides with the latest client feedback and statistics.",
    dueDate: "2024-05-23",
    priority: "Medium",
    status: "In Progress",
    createdAt: "2024-01-05T00:00:00Z",
    updatedAt: "2024-01-11T00:00:00Z",
  },
  {
    id: "6",
    title: "Update client presentation",
    description:
      "Optimize the database queries to improve the app's performance.",
    dueDate: "2024-05-20",
    priority: "High",
    status: "Completed",
    createdAt: "2024-01-06T00:00:00Z",
    updatedAt: "2024-01-16T00:00:00Z",
  },
  {
    id: "7",
    title: "Conduct user interviews",
    description:
      "Write an informative blog post about the latest trends in artificial intelligence.",
    dueDate: "2024-04-27",
    priority: "Low",
    status: "Completed",
    createdAt: "2024-01-07T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
];

const initialState: TaskState = {
  tasks: initialTasks,
  filters: {
    priority: "All",
    status: "All",
    search: "",
  },
  sortOrder: "asc",
};

function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case "ADD_TASK": {
      const newTask: Task = {
        id: Date.now().toString(),
        ...action.payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return {
        ...state,
        tasks: [...state.tasks, newTask],
      };
    }
    case "UPDATE_TASK": {
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id
            ? {
                ...task,
                ...action.payload.data,
                updatedAt: new Date().toISOString(),
              }
            : task
        ),
      };
    }
    case "DELETE_TASK": {
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
    }
    case "SET_FILTERS": {
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };
    }
    case "SET_SORT_ORDER": {
      return {
        ...state,
        sortOrder: action.payload,
      };
    }
    default:
      return state;
  }
}

export function TaskProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL params only once on mount
  useEffect(() => {
    const urlFilters: Partial<TaskFilters> = {};
    const urlSearch = searchParams.get("search");
    const urlPriority = searchParams.get("priority");
    const urlStatus = searchParams.get("status");
    const urlSort = searchParams.get("sort");

    if (urlSearch) urlFilters.search = urlSearch;
    if (urlPriority && ["High", "Medium", "Low", "All"].includes(urlPriority)) {
      urlFilters.priority = urlPriority as TaskFilters["priority"];
    }
    if (urlStatus && ["In Progress", "Completed", "All"].includes(urlStatus)) {
      urlFilters.status = urlStatus as TaskFilters["status"];
    }

    // Only update if we have URL parameters and they're different from current state
    const hasUrlParams = urlSearch || urlPriority || urlStatus || urlSort;
    if (hasUrlParams) {
      if (Object.keys(urlFilters).length > 0) {
        dispatch({ type: "SET_FILTERS", payload: urlFilters });
      }
      if (
        urlSort &&
        ["asc", "desc"].includes(urlSort) &&
        urlSort !== state.sortOrder
      ) {
        dispatch({ type: "SET_SORT_ORDER", payload: urlSort as SortOrder });
      }
    }
  }, []); // Empty dependency array - only run once on mount

  // Update URL when filters change (but not during initial load)
  const updateURL = (filters: TaskFilters, sortOrder: SortOrder) => {
    const params = new URLSearchParams();

    if (filters.search) params.set("search", filters.search);
    if (filters.priority !== "All") params.set("priority", filters.priority);
    if (filters.status !== "All") params.set("status", filters.status);
    if (sortOrder !== "asc") params.set("sort", sortOrder);

    const queryString = params.toString();
    const newUrl = queryString ? `/?${queryString}` : "/";

    // Only update URL if it's different from current
    const currentUrl = window.location.pathname + window.location.search;
    if (newUrl !== currentUrl) {
      router.replace(newUrl, { scroll: false });
    }
  };

  const setFilters = (filters: Partial<TaskFilters>) => {
    const newFilters = { ...state.filters, ...filters };
    dispatch({ type: "SET_FILTERS", payload: filters });
    updateURL(newFilters, state.sortOrder);
  };

  const setSortOrder = (order: SortOrder) => {
    dispatch({ type: "SET_SORT_ORDER", payload: order });
    updateURL(state.filters, order);
  };

  const clearAllFilters = () => {
    const defaultFilters: TaskFilters = {
      priority: "All",
      status: "All",
      search: "",
    };
    dispatch({ type: "SET_FILTERS", payload: defaultFilters });
    dispatch({ type: "SET_SORT_ORDER", payload: "asc" });
    router.replace("/", { scroll: false });
  };

  const addTask = (data: TaskFormData) => {
    dispatch({ type: "ADD_TASK", payload: data });
  };

  const updateTask = (id: string, data: TaskFormData) => {
    dispatch({ type: "UPDATE_TASK", payload: { id, data } });
  };

  const deleteTask = (id: string) => {
    dispatch({ type: "DELETE_TASK", payload: id });
  };

  const getFilteredAndSortedTasks = (): Task[] => {
    let filteredTasks = state.tasks;

    // Apply search filter
    if (state.filters.search) {
      filteredTasks = filteredTasks.filter(
        (task) =>
          task.title
            .toLowerCase()
            .includes(state.filters.search.toLowerCase()) ||
          task.description
            .toLowerCase()
            .includes(state.filters.search.toLowerCase())
      );
    }

    // Apply priority filter
    if (state.filters.priority !== "All") {
      filteredTasks = filteredTasks.filter(
        (task) => task.priority === state.filters.priority
      );
    }

    // Apply status filter
    if (state.filters.status !== "All") {
      filteredTasks = filteredTasks.filter(
        (task) => task.status === state.filters.status
      );
    }

    // Apply sorting
    filteredTasks.sort((a, b) => {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return state.sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    return filteredTasks;
  };

  const value: TaskContextType = {
    state,
    dispatch,
    addTask,
    updateTask,
    deleteTask,
    setFilters,
    setSortOrder,
    clearAllFilters,
    getFilteredAndSortedTasks,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
}
