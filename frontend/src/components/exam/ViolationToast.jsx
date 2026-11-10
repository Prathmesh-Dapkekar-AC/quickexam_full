import React from "react";
import { Dialog } from "../ui/dialog";
import { Button } from "../ui/button";
import { AlertTriangle } from "lucide-react";

export const ViolationToast = ({ open, count, onClose }) => {
  return (
    <Dialog open={open} title="Exam Security Alert" onClose={onClose}>
      <div className="flex items-center gap-3 text-rose-600 bg-rose-50 p-3 rounded-lg border border-rose-200 mb-4">
        <AlertTriangle className="h-6 w-6 shrink-0" />
        <span className="text-sm font-medium">
          Tab switch or window unfocus detected! All violations are logged and
          reviewed by faculty.
        </span>
      </div>
      <p className="text-xs text-slate-500 mb-4">
        Total Integrity Flags Logged: <b>{count}</b>
      </p>
      <div className="flex justify-end">
        <Button variant="danger" onClick={onClose}>
          Acknowledge & Return
        </Button>
      </div>
    </Dialog>
  );
};
