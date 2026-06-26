import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { INotification } from '../modules/notification/notification.interface';

let io: SocketIOServer;

// Maps userId (string) → Set of connected socketIds
const userSockets: Map<string, Set<string>> = new Map();

export const initSocket = (httpServer: HttpServer): SocketIOServer => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket: Socket) => {
    const userId = socket.handshake.query.userId as string;

    if (userId) {
      if (!userSockets.has(userId)) userSockets.set(userId, new Set());
      userSockets.get(userId)!.add(socket.id);
      // Join a personal room so we can emit to the user by userId
      socket.join(userId);
      console.log(`Socket connected: user=${userId} socket=${socket.id}`);
    }

    socket.on('disconnect', () => {
      if (userId) {
        userSockets.get(userId)?.delete(socket.id);
        if (userSockets.get(userId)?.size === 0) userSockets.delete(userId);
      }
      console.log(`Socket disconnected: socket=${socket.id}`);
    });
  });

  return io;
};

export const getIO = (): SocketIOServer => {
  if (!io) throw new Error('Socket.IO is not initialized');
  return io;
};

/**
 * Emit a real-time notification to a specific user.
 * Works even if the user has multiple browser tabs open.
 */
export const emitNotification = (recipientId: string, notification: Partial<INotification> & { _id?: unknown }) => {
  try {
    const ioInstance = getIO();
    ioInstance.to(recipientId).emit('notification', notification);
  } catch {
    // Socket.IO not yet initialised (e.g. in tests) — silently ignore
  }
};
