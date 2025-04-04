import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useState } from "react";

interface LiveChatDialogProps {
  open: boolean;
  onClose: () => void;
  user: any;
}

export function LiveChatDialog({ open, onClose, user }: LiveChatDialogProps) {
  const [chatUrl, setChatUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Chat URL:", chatUrl);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          width: "90%",
          maxWidth: "90%",
          margin: "auto",
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)"
        }
      }}
    >
      <DialogTitle>Cài đặt Live Chat</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} className="mt-4">
          <input
            type="url"
            value={chatUrl}
            onChange={(e) => setChatUrl(e.target.value)}
            placeholder="Nhập URL live chat"
            className="w-full p-2 border rounded mb-4"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Lưu
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
} 