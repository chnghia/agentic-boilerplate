import { useEffect, useRef } from 'react';
import { useSSEStore, type SSEEvent } from '@/stores/useSSEStore';

const SSE_URL = `${import.meta.env.VITE_INTERNAL_API_URL}/api/v1/agent/events`;
const RECONNECT_DELAY = 3000; // 3 seconds

/**
 * Hook to establish and manage SSE connection.
 * Should be used in AppLayout to maintain connection across all protected pages.
 */
export function useSSEInit() {
    const eventSourceRef = useRef<EventSource | null>(null);
    const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const connect = () => {
            // Clean up existing connection
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }

            try {
                console.log('[SSE] Connecting to:', SSE_URL);
                const eventSource = new EventSource(SSE_URL);
                eventSourceRef.current = eventSource;

                eventSource.onopen = () => {
                    console.log('[SSE] Connected successfully');
                    // Use getState() to avoid stale closure issues
                    useSSEStore.getState().setConnected(true);
                    useSSEStore.getState().setConnectionError(null);
                    console.log('[SSE] State after setConnected:', useSSEStore.getState().isConnected);
                };

                // Listen for named events (conversation_invite)
                eventSource.addEventListener('conversation_invite', (event) => {
                    console.log('[SSE] Received conversation_invite event:', event.data);
                    try {
                        const data = JSON.parse(event.data);
                        const sseEvent: SSEEvent = {
                            type: 'conversation_invite',
                            data,
                            timestamp: new Date(),
                        };
                        useSSEStore.getState().addEvent(sseEvent);
                        console.log('[SSE] Event added to store:', sseEvent);
                    } catch (err) {
                        console.error('[SSE] Failed to parse conversation_invite:', err);
                    }
                });

                // Listen for url_summary_complete events
                eventSource.addEventListener('url_summary_complete', (event) => {
                    console.log('[SSE] Received url_summary_complete event:', event.data);
                    try {
                        const data = JSON.parse(event.data);
                        const sseEvent: SSEEvent = {
                            type: 'url_summary_complete',
                            data,
                            timestamp: new Date(),
                        };
                        useSSEStore.getState().addEvent(sseEvent);
                        console.log('[SSE] url_summary_complete added to store:', sseEvent);
                    } catch (err) {
                        console.error('[SSE] Failed to parse url_summary_complete:', err);
                    }
                });

                // Default message handler
                eventSource.onmessage = (event) => {
                    console.log('[SSE] Received message event:', event.data);
                    try {
                        const data = JSON.parse(event.data);
                        const sseEvent: SSEEvent = {
                            type: data.type || 'message',
                            data,
                            timestamp: new Date(),
                        };
                        useSSEStore.getState().addEvent(sseEvent);
                        console.log('[SSE] Event added to store:', sseEvent);
                    } catch (err) {
                        console.error('[SSE] Failed to parse message:', err);
                    }
                };

                eventSource.onerror = (error) => {
                    console.error('[SSE] Connection error:', error);
                    useSSEStore.getState().setConnected(false);
                    useSSEStore.getState().setConnectionError('Connection lost. Reconnecting...');

                    eventSource.close();

                    // Attempt to reconnect
                    reconnectTimeoutRef.current = setTimeout(() => {
                        console.log('[SSE] Attempting to reconnect...');
                        connect();
                    }, RECONNECT_DELAY);
                };

            } catch (error) {
                console.error('[SSE] Failed to create EventSource:', error);
                useSSEStore.getState().setConnectionError('Failed to establish connection');
            }
        };

        connect();

        return () => {
            // Cleanup on unmount
            console.log('[SSE] Cleaning up connection');
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            useSSEStore.getState().setConnected(false);
        };
    }, []); // Empty dependency - only run once on mount

    // Return reconnect function for manual reconnection if needed
    const reconnect = () => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
        }
        // Trigger reconnect by forcing effect to re-run
        useSSEStore.getState().setConnected(false);
    };

    return { reconnect };
}

