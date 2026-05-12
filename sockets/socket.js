// Socket.IO setup — ready for future real-time features
const initializeSocket = (server) => {
  const { Server } = require("socket.io");

  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`⚡ Socket connected: ${socket.id}`);

    // Join user-specific room for targeted notifications
    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their room`);
    });

    // Booking status updates (future feature)
    socket.on("booking:statusUpdate", (data) => {
      // Emit to the booking owner
      if (data.userId) {
        io.to(data.userId).emit("booking:updated", data);
      }
    });

    // Vendor approval notification (future feature)
    socket.on("vendor:approved", (data) => {
      if (data.ownerId) {
        io.to(data.ownerId).emit("vendor:statusChanged", data);
      }
    });

    socket.on("disconnect", () => {
      console.log(`⚡ Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

module.exports = { initializeSocket };
