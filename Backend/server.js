import http from 'http';
import app from './app.js';
const PORT = process.env.PORT || 3000;
import { Server } from "socket.io";
const server = http.createServer(app);

// Attach Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});


// Socket connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // join user room
  socket.on("join_room", (userId) => {
    socket.join(userId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Make io accessible in routes
app.set("io", io);



server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

