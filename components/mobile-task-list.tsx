"use client";
import { Task } from "@/types/task";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { useTaskContext } from "@/store/task-context";
import { DeleteDialog } from "./delete-dialog";

const MobileTaskList = ({ tasks }: { tasks: Task[] }) => {
  const {
    state,
    clearAllFilters,
    deleteTask,
    getFilteredAndSortedTasks,
    setFilters,
    addTask,
  } = useTaskContext();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const handleDelete = (taskId: string) => {
    setDeleteTaskId(taskId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTaskId) {
      deleteTask(deleteTaskId);
      setDeleteTaskId(null);
    }
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setDeleteTaskId(null);
  };
  return (
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
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(task.id)}
            className="h-8 w-8 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default MobileTaskList;
