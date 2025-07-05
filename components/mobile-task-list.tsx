"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, ChevronUp, Edit, Trash2 } from "lucide-react";
import { TaskModal } from "./task-modal";
import type { Task, TaskPriority } from "@/types/task";
import { DeleteDialog } from "./delete-dialog";
import { useTaskContext } from "@/store/task-context";

export function MobileTaskList() {
  const { getFilteredAndSortedTasks, updateTask, deleteTask } =
    useTaskContext();
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(
    new Set(["1"])
  );
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const tasks = getFilteredAndSortedTasks();

  const toggleExpanded = (taskId: string) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

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

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleModalSubmit = (data: any) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
    }
  };

  const handlePriorityChange = (taskId: string, priority: TaskPriority) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      updateTask(taskId, {
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        priority,
        status: task.status,
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No task found</p>
      </div>
    );
  }

  return (
    <>
      {/* Single outer container with red border */}
      <div className="border-2 border-custom-red rounded-lg bg-white overflow-hidden">
        {tasks.map((task, index) => {
          const isExpanded = expandedTasks.has(task.id);
          const isLastTask = index === tasks.length - 1;

          return (
            <div
              key={task.id}
              className={`${!isLastTask ? "border-b border-custom-red" : ""}`}
              onClick={() => toggleExpanded(task.id)}
            >
              {/* Task Header - Always Visible */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-red-700 font-medium text-sm">
                      SL.No
                    </span>
                    <span className="font-medium">{index + 1}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleExpanded(task.id)}
                    className="h-6 w-6"
                  >
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-red-700 font-medium text-sm min-w-[35px]">
                    Title
                  </span>
                  <span className="font-medium text-sm">{task.title}</span>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="mt-4 space-y-3">
                    <div className="flex gap-3">
                      <span className="text-red-700 font-medium text-sm min-w-[80px] flex-shrink-0">
                        Description
                      </span>
                      <span className="text-sm text-gray-600">
                        {task.description}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-red-700 font-medium text-sm min-w-[70px]">
                        Due Date
                      </span>
                      <span className="text-sm">
                        {formatDate(task.dueDate)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-red-700 font-medium text-sm min-w-[50px]">
                        Status
                      </span>
                      <Badge
                        variant={
                          task.status === "Completed" ? "default" : "secondary"
                        }
                        className={
                          task.status === "Completed"
                            ? "bg-custom-green text-white  text-xs"
                            : "bg-custom-yellow text-yellow-800 text-xs"
                        }
                      >
                        {task.status}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-red-700 font-medium text-sm min-w-[50px]">
                          Priority
                        </span>
                        <Select
                          value={task.priority}
                          onValueChange={(value: TaskPriority) =>
                            handlePriorityChange(task.id, value)
                          }
                        >
                          <SelectTrigger className="w-28 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(task)}
                          className="h-8 w-8"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(task.id)}
                          className="h-8 w-8 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
      />

      <TaskModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        task={editingTask}
        mode="edit"
      />
    </>
  );
}
