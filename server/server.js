const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

io.on('connection', (socket) => {
    console.log('A User Connected:', socket.id);

    socket.on('sendMessage', (message) => {
        io.emit('message', message); // Emit the message to all clients
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3500;
server.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
});
