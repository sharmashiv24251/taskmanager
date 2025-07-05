"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
}

export function DeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure that you wish to delete this task?",
}: DeleteDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] p-6">
        <div className="flex items-start justify-between mb-6">
          <h2 className="text-lg font-medium leading-relaxed pr-4">{title}</h2>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 bg-transparent border-2 border-custom-red text-custom-red hover:bg-blue-50"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            className="flex-1 bg-custom-red hover:bg-red-800 text-white"
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
