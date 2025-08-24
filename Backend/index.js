import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import toolRoutes from './routes/toolRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import User from './models/userModel.js';
import cronJob from './services/cronService.js';

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json()); 


app.use('/api/auth', authRoutes);
app.use('/api/tools', toolRoutes);
app.use('/api/bookings', bookingRoutes);


app.get('/', (req, res) => {
  res.send('ToolSwap API is running...');
});

app.use(notFound);   
app.use(errorHandler);


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

const activeUsers = {}; 
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  socket.on('add_user', async (userId) => {
    try {
      const user = await User.findById(userId);
      if (user) {
        activeUsers[userId] = {
          socketId: socket.id,
          name: user.name,
        };
        console.log(`User ${user.name} added to active list:`, activeUsers);
      }
    } catch (error) {
      console.error('Error finding user:', error);
    }
  });

  socket.on('disconnect', () => {
    let disconnectedUserName = 'Unknown';
    for (const userId in activeUsers) {
      if (activeUsers[userId].socketId === socket.id) {
        disconnectedUserName = activeUsers[userId].name;
        delete activeUsers[userId];
        break;
      }
    }
    console.log(`User ${disconnectedUserName} disconnected. Active users:`, activeUsers);
  });
});

cronJob.start();

export { io, activeUsers };

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));