"use client";

import { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TaskProvider, useTaskContext } from "@/store/task-context";
import { TaskModal } from "@/components/task-modal";
import { TaskFilters } from "@/components/task-filters";

function TaskManagerContent() {
  const {
    state,
    clearAllFilters,
    deleteTask,
    getFilteredAndSortedTasks,
    setFilters,
    addTask,
  } = useTaskContext();

  const handleAddTask = (data: any) => {
    addTask(data);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const tasks = getFilteredAndSortedTasks();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col  sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-gray-800 text-white px-4 py-2 rounded-lg font-bold">
              Studio137
              <div className="text-xs">LOGO</div>
            </div>
            <h1 className="text-2xl font-bold">Tasks</h1>
          </div>

          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-custom-red hover:bg-red-800 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Task
          </Button>

          <div className="mb-6">
            <TaskFilters />
          </div>

          <div className="flex flex-col gap-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">{task.title}</h2>
                  <p className="text-sm text-gray-600">{task.description}</p>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
          <TaskModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleAddTask}
            mode="add"
          />
        </div>
      </div>
    </div>
  );
}

function TaskManagerWithSuspense() {
  return (
    <TaskProvider>
      <TaskManagerContent />
    </TaskProvider>
  );
}

export default function TaskManager() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <TaskManagerWithSuspense />
    </Suspense>
  );
}
