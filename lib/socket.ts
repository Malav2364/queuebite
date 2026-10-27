import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { API_BASE_URL } from './api';

let socketInstance: Socket | null = null;

export function getSocket(): Socket {
  if (!socketInstance) {
    socketInstance = io(API_BASE_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }
  return socketInstance;
}

export interface LiveQueueUpdate {
  queueEntryId: string;
  queueNumber?: number;
  positionInLine?: number;
  partiesAhead?: number;
  estimatedWaitMinutes?: number;
  status?: string;
  message?: string;
  tableNumber?: string;
}

/**
 * Custom React hook to subscribe to live updates for a specific queue entry.
 */
export function useQueueSocket(
  queueEntryId?: string | null,
  callbacks?: {
    onPositionUpdated?: (data: LiveQueueUpdate) => void;
    onCalled?: (data: LiveQueueUpdate) => void;
    onSeated?: (data: LiveQueueUpdate) => void;
    onStatusChanged?: (data: LiveQueueUpdate) => void;
  }
) {
  const [isConnected, setIsConnected] = useState(false);
  const [latestUpdate, setLatestUpdate] = useState<LiveQueueUpdate | null>(null);
  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;

  useEffect(() => {
    if (!queueEntryId) return;

    const socket = getSocket();

    const handleConnect = () => {
      setIsConnected(true);
      socket.emit('join:queue', { queueEntryId });
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handlePositionUpdated = (data: LiveQueueUpdate) => {
      if (data.queueEntryId === queueEntryId) {
        setLatestUpdate(data);
        callbacksRef.current?.onPositionUpdated?.(data);
      }
    };

    const handleCalled = (data: LiveQueueUpdate) => {
      if (data.queueEntryId === queueEntryId) {
        setLatestUpdate((prev) => ({ ...prev, ...data, status: 'CALLED' }));
        callbacksRef.current?.onCalled?.(data);
      }
    };

    const handleSeated = (data: LiveQueueUpdate) => {
      if (data.queueEntryId === queueEntryId) {
        setLatestUpdate((prev) => ({ ...prev, ...data, status: 'SEATED' }));
        callbacksRef.current?.onSeated?.(data);
      }
    };

    const handleStatusChanged = (data: LiveQueueUpdate) => {
      if (data.queueEntryId === queueEntryId) {
        setLatestUpdate((prev) => ({ ...prev, ...data }));
        callbacksRef.current?.onStatusChanged?.(data);
      }
    };

    if (socket.connected) {
      handleConnect();
    } else {
      socket.connect();
    }

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('queue:position_updated', handlePositionUpdated);
    socket.on('queue:called', handleCalled);
    socket.on('queue:seated', handleSeated);
    socket.on('queue:status_changed', handleStatusChanged);

    return () => {
      socket.emit('leave:queue', { queueEntryId });
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('queue:position_updated', handlePositionUpdated);
      socket.off('queue:called', handleCalled);
      socket.off('queue:seated', handleSeated);
      socket.off('queue:status_changed', handleStatusChanged);
    };
  }, [queueEntryId]);

  return {
    isConnected,
    latestUpdate,
    socket: getSocket(),
  };
}

/**
 * Custom React hook to subscribe to live queue statistics for a whole restaurant (Host or Explorer).
 */
export function useRestaurantSocket(
  restaurantId?: string | null,
  onQueueUpdated?: (data: any) => void
) {
  useEffect(() => {
    if (!restaurantId) return;

    const socket = getSocket();

    const handleConnect = () => {
      socket.emit('join:restaurant', { restaurantId });
    };

    if (socket.connected) {
      handleConnect();
    } else {
      socket.connect();
    }

    socket.on('connect', handleConnect);
    if (onQueueUpdated) {
      socket.on('queue:joined', onQueueUpdated);
      socket.on('restaurant:queue_count_updated', onQueueUpdated);
      socket.on('restaurant:entry_removed', onQueueUpdated);
    }

    return () => {
      socket.emit('leave:restaurant', { restaurantId });
      socket.off('connect', handleConnect);
      if (onQueueUpdated) {
        socket.off('queue:joined', onQueueUpdated);
        socket.off('restaurant:queue_count_updated', onQueueUpdated);
        socket.off('restaurant:entry_removed', onQueueUpdated);
      }
    };
  }, [restaurantId, onQueueUpdated]);
}

/**
 * Custom React hook to subscribe to collaborative group dining updates.
 */
export function useGroupSocket(
  sessionId?: string | null,
  callbacks?: {
    onMemberJoined?: (data: any) => void;
    onMemberReady?: (data: any) => void;
    onQueueJoined?: (data: any) => void;
  }
) {
  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;

  useEffect(() => {
    if (!sessionId) return;

    const socket = getSocket();

    const handleConnect = () => {
      socket.emit('join:group', { sessionId });
    };

    const handleMemberJoined = (data: any) => {
      if (data.sessionId === sessionId) {
        callbacksRef.current?.onMemberJoined?.(data);
      }
    };

    const handleMemberReady = (data: any) => {
      if (data.sessionId === sessionId) {
        callbacksRef.current?.onMemberReady?.(data);
      }
    };

    const handleQueueJoined = (data: any) => {
      if (data.sessionId === sessionId) {
        callbacksRef.current?.onQueueJoined?.(data);
      }
    };

    if (socket.connected) {
      handleConnect();
    } else {
      socket.connect();
    }

    socket.on('connect', handleConnect);
    socket.on('group:member_joined', handleMemberJoined);
    socket.on('group:member_ready', handleMemberReady);
    socket.on('group:queue_joined', handleQueueJoined);

    return () => {
      socket.emit('leave:group', { sessionId });
      socket.off('connect', handleConnect);
      socket.off('group:member_joined', handleMemberJoined);
      socket.off('group:member_ready', handleMemberReady);
      socket.off('group:queue_joined', handleQueueJoined);
    };
  }, [sessionId]);
}

/**
 * Custom React hook to subscribe to real-time pre-order lifecycle updates.
 */
export function useOrderSocket(
  orderId?: string | null,
  onStatusUpdated?: (data: any) => void
) {
  useEffect(() => {
    if (!orderId) return;

    const socket = getSocket();

    const handleConnect = () => {
      socket.emit('join:order', { orderId });
    };

    const handleStatusUpdate = (data: any) => {
      if (data.orderId === orderId) {
        onStatusUpdated?.(data);
      }
    };

    if (socket.connected) {
      handleConnect();
    } else {
      socket.connect();
    }

    socket.on('connect', handleConnect);
    socket.on('order:status_updated', handleStatusUpdate);

    return () => {
      socket.emit('leave:order', { orderId });
      socket.off('connect', handleConnect);
      socket.off('order:status_updated', handleStatusUpdate);
    };
  }, [orderId, onStatusUpdated]);
}

