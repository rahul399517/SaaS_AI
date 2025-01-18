import React, { useEffect, useState } from "react";

type ToastMessageProps = {
  message: string;
  visible: boolean;
  onClose: () => void;
};

export default function ToastErrorMessage({
  message,
  visible,
  onClose,
}: ToastMessageProps) {
  const [show, setShow] = useState(visible);

  useEffect(() => {
    if (visible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 300); // Allow animation to complete before closing
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!show) return null;

  return (
    <div className="fixed top-4 right-4 z-50 transition-all duration-300 transform animate-toast">
      <div className="flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg bg-red-100 text-red-700 border border-red-300">
        {/* Error Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-red-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01M12 19c-3.866 0-7-3.134-7-7s3.134-7 7-7 7 3.134 7 7-3.134 7-7 7zm0 0h0"
          />
        </svg>
        {/* Message */}
        <span className="text-sm font-medium flex-1">{message}</span>
        {/* Close Button */}
        <button
          onClick={() => {
            setShow(false);
            setTimeout(onClose, 300); // Allow animation to complete before closing
          }}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-red-200 hover:bg-red-300 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-red-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
