import React from "react";
import { DecryptedText } from "./decrypted-text";

export default function LoadingIndicator() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-black">
      <DecryptedText
        text="Loading..."
        className="text-4xl animate-pulse"
        speed={50}
        loop={true}
      />
    </div>
  );
}
