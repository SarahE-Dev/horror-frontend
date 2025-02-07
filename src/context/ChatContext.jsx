// src/context/ChatContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const ChatContext = createContext({
    socket: null,
    messages: [],
    setMessages: () => {},
    users: [],
    setUsers: () => {},
    typingUsers: new Set(),
    setTypingUsers: () => {},
    isConnected: false
});

const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user) return; // Only connect if user is authenticated

    const newSocket = io('http://localhost:5000', {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
      // Automatically join with authenticated user data
      newSocket.emit('join', { username: user.username });
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setIsConnected(false);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Disconnected:', reason);
      setIsConnected(false);
    });

    newSocket.on('message_history', (history) => {
      setMessages(history);
    });

    newSocket.on('message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('usersList', (updatedUsers) => {
      setUsers(updatedUsers);
    });

    newSocket.on('userTyping', ({ user, isTyping }) => {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        if (isTyping) {
          newSet.add(user);
        } else {
          newSet.delete(user);
        }
        return newSet;
      });
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.close();
      }
      setMessages([]);
      setUsers([]);
      setTypingUsers(new Set());
    };
  }, [user]); // Reconnect if user changes

  const contextValue = {
    socket,
    messages,
    setMessages,
    users,
    setUsers,
    typingUsers,
    setTypingUsers,
    isConnected
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};

const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export { ChatProvider, useChat };