const { Server } = require("socket.io");

function setupWebSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5501",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 Client connected:", socket.id);

    socket.on("send_message", (data) => {
      console.log("📨 Tin nhắn:", data);
      io.emit("receive_message", data);
    });

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });

  return io;
}

module.exports = setupWebSocket;
