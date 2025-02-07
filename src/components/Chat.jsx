// src/components/Chat.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { Send, Loader2, Users, X, MessageSquare } from 'lucide-react';

const Chat = () => {
  const { user } = useAuth();
  const { socket, messages, users, typingUsers, isConnected } = useChat();
  const [message, setMessage] = useState('');
  const [room] = useState('general');
  const [showUsersList, setShowUsersList] = useState(false);
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    messageInputRef.current?.focus();
  }, [isConnected]);

  // Remove duplicate users by username
  const uniqueUsers = Array.from(new Map(users.map(user => [user.username, user])).values());

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && socket) {
      socket.emit('sendMessage', { message, room });
      setMessage('');
      socket.emit('typing', { room, isTyping: false });
      messageInputRef.current?.focus();
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    
    if (socket) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      socket.emit('typing', { room, isTyping: true });

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing', { room, isTyping: false });
      }, 1000);
    }
  };

  const formatMessageTime = (timestamp) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  if (!user || !isConnected) {
    return (
      <div className="w-full max-w-7xl mx-auto h-[calc(100vh-5rem)] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 text-red-500 animate-spin mx-auto" />
          <div className="text-white text-xl">
            {!user ? 'Please log in to chat' : 'Connecting to chat...'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex h-[calc(100vh-8rem)] bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat Header */}
          <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className='flex items-center space-x-3'>
                <MessageSquare className="w-6 h-6 text-red-500" />
                <h1 className="text-xl font-bold text-white">Horror Chat</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-400">
                  {uniqueUsers.length} {uniqueUsers.length === 1 ? 'user' : 'users'} online
                </span>
                <button
                  onClick={() => setShowUsersList(!showUsersList)}
                  className="md:hidden p-2 rounded-lg hover:bg-gray-700 transition-colors"
                  aria-label="Toggle users list"
                >
                  <Users className="w-6 h-6 text-gray-300" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={msg.id || index}
                className={`flex ${
                  msg.system ? 'justify-center' : msg.user === user.username ? 'justify-end' : 'justify-start'
                } items-end space-x-2`}
              >
                {!msg.system && msg.user !== user.username && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                    <span className="text-white text-sm">{msg.user[0].toUpperCase()}</span>
                  </div>
                )}
                
                <div
                  className={`max-w-[70%] ${
                    msg.system
                      ? 'bg-gray-800/50 px-4 py-2 rounded-full'
                      : msg.user === user.username
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-700 text-gray-100'
                  } ${!msg.system && 'px-4 py-3 rounded-2xl shadow-lg'}`}
                >
                  {!msg.system && (
                    <div className="flex items-baseline space-x-2">
                      <span className="font-medium text-sm">
                        {msg.user === user.username ? 'You' : msg.user}
                      </span>
                    </div>
                  )}
                  <div className={`${msg.system ? 'text-gray-400 text-sm' : 'mt-1'}`}>
                    {msg.message}
                  </div>
                  {!msg.system && (
                    <div className="text-xs opacity-70 mt-1">
                      {formatMessageTime(msg.timestamp)}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {typingUsers.size > 0 && (
              <div className="text-gray-400 text-sm animate-pulse">
                {Array.from(typingUsers).join(', ')} typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 bg-gray-800/50 backdrop-blur-sm border-t border-gray-700">
            <form onSubmit={handleSendMessage} className="flex space-x-4">
              <input
                ref={messageInputRef}
                type="text"
                value={message}
                onChange={handleTyping}
                placeholder="Type your message..."
                className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 
                  focus:ring-red-500 transition-shadow placeholder-gray-400"
              />
              <button
                type="submit"
                disabled={!message.trim()}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors 
                  disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        {/* Users Sidebar */}
        <div
          className={`${
            showUsersList ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
          } md:relative fixed right-0 h-full w-72 bg-gray-800/50 
          backdrop-blur-sm border-l border-gray-700 transition-transform duration-300 z-20`}
        >
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white flex items-center space-x-2">
                <Users className="w-5 h-5 text-red-500" />
                <span>Online Users ({uniqueUsers.length})</span>
              </h2>
              <button
                onClick={() => setShowUsersList(false)}
                className="md:hidden p-2 hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Close users list"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {uniqueUsers.map((u) => (
                <div
                  key={u.id}
                  className={`flex items-center space-x-3 p-2 rounded-lg ${
                    u.username === user.username ? 'bg-gray-700' : 'hover:bg-gray-700/50'
                  } transition-colors`}
                >
                  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                    <span className="text-white text-sm">{u.username[0].toUpperCase()}</span>
                  </div>
                  <span className="text-gray-300">
                    {u.username}
                    {u.username === user.username && ' (You)'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Overlay */}
        {showUsersList && (
          <div 
            className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-10"
            onClick={() => setShowUsersList(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Chat;