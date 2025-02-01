// src/components/Chat.jsx
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Connect to the backend

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Listen for incoming messages
  useEffect(() => {
    socket.on("chat message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Clean up the socket connection when component unmounts
    return () => {
      socket.off("chat message");
    };
  }, []);

  // Handle message input
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  // Send message to backend
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("chat message", message); // Send message to the server
      setMessage(""); // Clear input field
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gray-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-white text-2xl mb-4">Chat</h2>
      <div className="h-64 overflow-y-auto bg-gray-800 p-4 rounded-lg mb-4">
        {messages.map((msg, index) => (
          <div key={index} className="text-white py-2 px-3 bg-gray-700 rounded-lg mb-2">
            {msg}
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="flex space-x-2">
        <input
          type="text"
          value={message}
          onChange={handleMessageChange}
          placeholder="Type a message"
          className="flex-1 px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <button
          type="submit"
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 focus:outline-none"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
