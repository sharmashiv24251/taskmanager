"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import type {
  Task,
  TaskFormData,
  TaskPriority,
  TaskStatus,
} from "@/types/task";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => void;
  task?: Task | null;
  mode: "add" | "edit";
}

export function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  task,
  mode,
}: TaskModalProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
    status: "In Progress",
  });

  useEffect(() => {
    if (mode === "edit" && task) {
      setFormData({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        priority: task.priority,
        status: task.status,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        dueDate: "",
        priority: "Medium",
        status: "In Progress",
      });
    }
  }, [mode, task, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.dueDate) return;

    onSubmit(formData);
    onClose();
  };

  const handleInputChange = (field: keyof TaskFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {mode === "add" ? "Add Task" : "Edit Task"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Choose Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleInputChange("dueDate", e.target.value)}
              required
            />
          </div>

          {mode === "edit" && (
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: TaskStatus) =>
                  handleInputChange("status", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={(value: TaskPriority) =>
                handleInputChange("priority", value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent border-custom-red text-custom-red"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-custom-red hover:bg-red-800"
            >
              {mode === "add" ? "Add Task" : "Edit Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
