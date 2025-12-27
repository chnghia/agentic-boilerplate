import { create } from 'zustand';
import { useShallow } from 'zustand/shallow';

export interface SSEEvent {
    type: string;
    data: any;
    timestamp: Date;
}

interface SSEState {
    // Connection state
    isConnected: boolean;
    connectionError: string | null;

    // Events
    events: SSEEvent[];
    latestEvent: SSEEvent | null;

    // Actions
    setConnected: (connected: boolean) => void;
    setConnectionError: (error: string | null) => void;
    addEvent: (event: SSEEvent) => void;
    clearEvents: () => void;
}

export const useSSEStore = create<SSEState>((set) => ({
    // Initial state
    isConnected: false,
    connectionError: null,
    events: [],
    latestEvent: null,

    // Actions
    setConnected: (connected) => set({
        isConnected: connected,
        connectionError: connected ? null : undefined
    }),

    setConnectionError: (error) => set((state) => ({
        connectionError: error,
        // Only set isConnected to false when there's an actual error
        isConnected: error ? false : state.isConnected
    })),

    addEvent: (event) => set((state) => ({
        events: [...state.events.slice(-99), event], // Keep last 100 events
        latestEvent: event,
    })),

    clearEvents: () => set({ events: [], latestEvent: null }),
}));

// Selector hooks with shallow comparison to prevent infinite re-renders
export const useSSEConnection = () => useSSEStore(
    useShallow((state) => ({
        isConnected: state.isConnected,
        connectionError: state.connectionError,
    }))
);

export const useLatestSSEEvent = () => useSSEStore((state) => state.latestEvent);

export const useSSEEventsByType = (type: string) => useSSEStore(
    useShallow((state) => state.events.filter(e => e.type === type))
);
