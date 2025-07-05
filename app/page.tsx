"use client";

import { useState, Suspense } from "react";

import { TaskModal } from "@/components/task-modal";
import { TaskTable } from "@/components/task-table";
import { MobileTaskList } from "@/components/mobile-task-list";

import { useIsMobile } from "@/hooks/use-mobile";
import { TaskProvider, useTaskContext } from "@/store/task-context";
import { Header } from "@/components/header";

function TaskManagerContent() {
  const { addTask } = useTaskContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleAddTask = (data: any) => {
    addTask(data);
  };

  const handleOpenAddModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Component */}
      <Header onAddTask={handleOpenAddModal} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Task List */}
        {isMobile ? <MobileTaskList /> : <TaskTable />}

        {/* Add Task Modal */}
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddTask}
          mode="add"
        />
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
