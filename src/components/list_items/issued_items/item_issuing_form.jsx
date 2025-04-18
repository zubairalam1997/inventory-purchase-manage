import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { IoSend, IoAttach } from "react-icons/io5";

const socket = io("http://127.0.0.1:5000", { transports: ["websocket"] });

const ChatRoom = ({ roomId, senderId, senderName, missingItems }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState(null);
  const [showWrapUp, setShowWrapUp] = useState(false);
  const messagesEndRef = useRef(null);

  // Join room on mount and set up listeners
  useEffect(() => {
    if (!roomId) return;
    socket.emit("join-room", roomId);

    const handleNewMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    const handleNewFile = (fileData) => {
      setMessages((prev) => [...prev, fileData]);
    };

    socket.on("new-message", handleNewMessage);
    socket.on("new-file", handleNewFile);

    // Cleanup listeners on unmount
    return () => {
      socket.off("new-message", handleNewMessage);
      socket.off("new-file", handleNewFile);
    };
  }, [roomId]);

  // Fetch chat history
  useEffect(() => {
    if (!roomId) return;
    axios
      .get(`http://127.0.0.1:5000/chat-history/${roomId}`)
      .then((response) => {
        console.log("Chat history response:", response.data); // <-- Add this
   
        setMessages(response.data || []);
      })
      .catch((err) => console.error("Failed to fetch chat history:", err));
  }, [roomId]);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending a new message
  const sendMessage = () => {
    if (!newMessage.trim()) return;
    console.log("Room ID:", roomId);
    console.log("Sender ID:", senderId);

    const messageData = {
        roomId: roomId,
        senderId: senderId,
        senderName: senderName,
        message: newMessage,
    };

    try {
        socket.emit("send-message", messageData);
        setNewMessage("");
    } catch (error) {
        console.error("Failed to send message:", error);
    }
};

const sendFile = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("roomId", roomId);
    formData.append("senderId", senderId);

    try {
        const response = await axios.post("http://127.0.0.1:5000/upload-file", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        setFile(null);
        setMessages((prev) => [...prev, { senderId,
          senderName, filePath: response.data.filePath }]);
    } catch (error) {
        console.error("File upload failed:", error);
    }
};
  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-4">Missing Items Chat Room</h2>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto border bg-white rounded p-4">
      {messages.map((msg, index) => {
  const msgSenderId = msg.senderId || msg.SenderID;
  const msgSenderName = msg.EmployeeName || msg.senderName || "Unknown";
  const messageText = msg.message || msg.Message;
  const isCurrentUser = msgSenderId === senderId;

  return (
    <div
      key={index}
      className={`mb-3 p-2 rounded max-w-[70%] ${
        isCurrentUser ? "bg-blue-100 ml-auto text-right" : "bg-gray-200"
      }`}
    >
      {msg.filePath || msg.FilePath ? (
        <a
          href={`http://127.0.0.1:5000${msg.filePath || msg.FilePath}`}
          download
          className="text-blue-600 underline break-words"
        >
          {(msg.filePath || msg.FilePath).split("/").pop()}
        </a>
      ) : (
        <p>{messageText}</p>
      )}
      <p className="text-xs text-gray-500 mt-1">
        {isCurrentUser ? "You" : msgSenderName}
      </p>
    </div>
  );
})}



        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="flex mt-4 items-center">
        <input
          type="text"
          className="flex-1 p-2 border rounded"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e)=>{
            if(e.key==="Enter"){
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <label className="ml-2 cursor-pointer">
          <IoAttach size={24} />
          <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
        </label>
        <button className="ml-2 bg-blue-500 text-white px-4 py-2 rounded" onClick={sendMessage}
       >
          <IoSend size={24} />
        </button>
      </div>

      {/* File Upload Button */}
      {file && (
        <button className="mt-2 bg-green-500 text-white p-2 rounded" onClick={sendFile}>
          Upload File
        </button>
      )}

      {/* Wrap-Up Section */}
      <button className="mt-4 bg-gray-700 text-white p-2 rounded" onClick={() => setShowWrapUp(!showWrapUp)}>
        {showWrapUp ? "Hide Wrap-Up" : "View Wrap-Up"}
      </button>

      {showWrapUp && (
        <div className="mt-4 bg-white p-4 border rounded">
          <h3 className="text-lg font-bold">Missing Items Summary</h3>
          <ul className="list-disc pl-6">
            {missingItems.length > 0 ? (
              missingItems.map((item, index) => <li key={index}>{item}</li>)
            ) : (
              <p>No missing items reported.</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ChatRoom;
