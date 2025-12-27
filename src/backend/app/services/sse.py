import asyncio
import logging
from typing import List

logger = logging.getLogger(__name__)


class SSEManager:
    def __init__(self):
        self.active_connections: List[asyncio.Queue] = []
        self._shutdown_event = asyncio.Event()

    async def connect(self) -> asyncio.Queue:
        queue = asyncio.Queue()
        self.active_connections.append(queue)
        logger.info(f"New SSE connection. Total: {len(self.active_connections)}")
        return queue

    def disconnect(self, queue: asyncio.Queue):
        if queue in self.active_connections:
            self.active_connections.remove(queue)
            logger.info(f"SSE connection removed. Total: {len(self.active_connections)}")

    async def broadcast(self, event: str, data: str):
        """Broadcasts a message to all active connections."""
        payload = f"event: {event}\ndata: {data}\n\n"
        logger.info(f"Broadcasting SSE: {payload.strip()}")

        # We iterate over a copy to safely remove dead connections if needed
        # though disconnect() usually handles explicit disconnects.
        for queue in self.active_connections:
            await queue.put(payload)

    def is_shutting_down(self) -> bool:
        """Check if shutdown has been initiated."""
        return self._shutdown_event.is_set()

    async def shutdown(self):
        """Signal all connections to close and wait for cleanup."""
        logger.info(
            f"Shutting down SSE manager. Closing {len(self.active_connections)} connections."
        )
        self._shutdown_event.set()

        # Push a shutdown signal (None) to all queues to unblock waiting gets
        for queue in self.active_connections:
            await queue.put(None)

        # Wait briefly for connections to cleanup
        await asyncio.sleep(0.5)

        # Force clear remaining connections
        self.active_connections.clear()
        logger.info("SSE manager shutdown complete.")


sse_manager = SSEManager()
