

import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
       console.log('--- 1. FRONTEND: User logged in. Attempting to connect to socket... ---');
      const newSocket = io('http://localhost:3000');
      setSocket(newSocket);
      console.log('--- 3. FRONTEND: Emitting "add_user" with ID:', user._id, '---');
      newSocket.emit('add_user', user._id);

      // --- ADD THESE TWO LINES TO DEBUG ---
      console.log('--- CONTEXT: User logged in, attempting to add user to socket ---');
      console.log('--- CONTEXT: Emitting add_user with ID:', user._id);

      newSocket.emit('add_user', user._id);

      return () => newSocket.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};