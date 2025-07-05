"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Trash2 } from "lucide-react";
import { TaskModal } from "./task-modal";
import type { Task, TaskPriority } from "@/types/task";
import { DeleteDialog } from "./delete-dialog";
import { useTaskContext } from "@/store/task-context";

export function TaskTable() {
  const { getFilteredAndSortedTasks, updateTask, deleteTask } =
    useTaskContext();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const tasks = getFilteredAndSortedTasks();

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
      <div className="border-2 border-custom-red rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-red-50 border-b border-red-200 hover:bg-red-50">
              <TableHead className="w-16 text-custom-red font-semibold">
                SL.No
              </TableHead>
              <TableHead className="min-w-[150px] text-custom-red font-semibold">
                Title
              </TableHead>
              <TableHead className="min-w-[200px] text-custom-red font-semibold">
                Description
              </TableHead>
              <TableHead className="w-32 text-custom-red font-semibold">
                Due Date
              </TableHead>
              <TableHead className="w-32 text-custom-red font-semibold">
                Status
              </TableHead>
              <TableHead className="w-32 text-custom-red font-semibold">
                Priority
              </TableHead>
              <TableHead className="w-24 text-custom-redfont-semibold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task, index) => (
              <TableRow
                key={task.id}
                className={`border-b border-red-100 ${
                  (index + 1) % 2 === 0
                    ? "bg-red-50 hover:bg-red-100"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell className="text-sm text-gray-600 ">
                  {task.description}
                </TableCell>
                <TableCell>{formatDate(task.dueDate)}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      task.status === "Completed" ? "default" : "secondary"
                    }
                    className={
                      task.status === "Completed"
                        ? "bg-custom-green text-white"
                        : "bg-custom-yellow text-yellow-950"
                    }
                  >
                    {task.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Select
                    value={task.priority}
                    onValueChange={(value: TaskPriority) =>
                      handlePriorityChange(task.id, value)
                    }
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
