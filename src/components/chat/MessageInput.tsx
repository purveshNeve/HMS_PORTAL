import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  onTyping?: () => void;
  onStopTyping?: () => void;
  placeholder?: string;
  maxLength?: number;
}

export default function MessageInput({
  onSendMessage,
  onTyping,
  onStopTyping,
  placeholder = "Type your query message...",
  maxLength = 500,
}: MessageInputProps) {
  const [text, setText] = useState("");
  const [isTypingLocal, setIsTypingLocal] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<any>(null);

  // Auto-resize the textarea height based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to calculate scrollHeight
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }, [text]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleSend = () => {
    if (!text.trim()) return;

    // Reset typing state immediately upon sending
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    setIsTypingLocal(false);
    onStopTyping?.();

    onSendMessage(text.trim());
    setText("");
    
    // Focus back on input
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // If Enter (without shift) is pressed, submit the form
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length <= maxLength) {
      setText(val);

      if (val.trim()) {
        // Trigger typing callback if not already typing
        if (!isTypingLocal) {
          setIsTypingLocal(true);
          onTyping?.();
        }

        // Reset debounced stop typing trigger
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
          setIsTypingLocal(false);
          onStopTyping?.();
        }, 1000);
      } else {
        // If input cleared, trigger stop typing immediately
        if (isTypingLocal) {
          setIsTypingLocal(false);
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
          }
          onStopTyping?.();
        }
      }
    }
  };

  return (
    <div className="p-3 bg-white dark:bg-zinc-900 border-t border-slate-100 dark:border-zinc-800 flex flex-col gap-1.5 z-10">
      <div className="flex items-end gap-2.5">
        {/* Text Area */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full text-xs pl-3.5 pr-3.5 py-2.5 bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 placeholder-slate-400 dark:placeholder-zinc-500 resize-none max-h-32 transition-all text-slate-800 dark:text-zinc-100 leading-relaxed scrollbar-thin"
          />
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className={cn(
            "p-2.5 rounded-xl flex items-center justify-center transition-all bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow",
            "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-indigo-600 disabled:shadow-none"
          )}
          aria-label="Send message"
        >
          <Send className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* Character Counter */}
      <div className="flex justify-between items-center px-1">
        <span className="text-[10px] text-slate-400 dark:text-zinc-500 leading-none">
          Press Enter to send, Shift+Enter for newline
        </span>
        <span
          className={cn(
            "text-[9px] font-semibold leading-none select-none",
            text.length >= maxLength ? "text-rose-500 animate-pulse" : "text-slate-400 dark:text-zinc-500"
          )}
        >
          {text.length}/{maxLength}
        </span>
      </div>
    </div>
  );
}
