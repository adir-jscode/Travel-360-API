"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitNotification = exports.getIO = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
let io;
// Maps userId (string) → Set of connected socketIds
const userSockets = new Map();
const initSocket = (httpServer) => {
    io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        if (userId) {
            if (!userSockets.has(userId))
                userSockets.set(userId, new Set());
            userSockets.get(userId).add(socket.id);
            // Join a personal room so we can emit to the user by userId
            socket.join(userId);
            console.log(`Socket connected: user=${userId} socket=${socket.id}`);
        }
        socket.on("disconnect", () => {
            var _a, _b;
            if (userId) {
                (_a = userSockets.get(userId)) === null || _a === void 0 ? void 0 : _a.delete(socket.id);
                if (((_b = userSockets.get(userId)) === null || _b === void 0 ? void 0 : _b.size) === 0)
                    userSockets.delete(userId);
            }
            console.log(`Socket disconnected: socket=${socket.id}`);
        });
    });
    return io;
};
exports.initSocket = initSocket;
const getIO = () => {
    if (!io)
        throw new Error("Socket.IO is not initialized");
    return io;
};
exports.getIO = getIO;
/**
 * Emit a real-time notification to a specific user.
 * Works even if the user has multiple browser tabs open.
 */
const emitNotification = (recipientId, notification) => {
    try {
        const ioInstance = (0, exports.getIO)();
        ioInstance.to(recipientId).emit("notification", notification);
    }
    catch (_a) {
        // Socket.IO not yet initialised (e.g. in tests) — silently ignore
    }
};
exports.emitNotification = emitNotification;
