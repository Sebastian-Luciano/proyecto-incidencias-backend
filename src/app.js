import express from 'express';
import initDatabase from './scripts/initDatabase.js';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import corsOptions from './config/corsConfig.js';
import userRoutes from './routes/userRoutes.js';
import incidenceRoutes from './routes/incidenceRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import setupSocket from './config/socketConfig.js';

dotenv.config();

const app = express();
const server = createServer(app);

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);
app.use('/api/incidences', incidenceRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/uploads', express.static('uploads'));

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000", "https://tudominio.com"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

setupSocket(io);

const PORT = process.env.PORT || 3000;

initDatabase().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(error => {
  console.error('Failed to initialize database:', error);
});

export default app;