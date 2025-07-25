import { Loader2 } from "lucide-react"; // Optional icon
import React from "react";

export default function LoadingIndicator() {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <Loader2 className="animate-spin w-10 h-10 text-indigo-500" />
    </div>
  );
}
