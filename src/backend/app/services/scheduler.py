"""Scheduler service for delayed SSE broadcasts.

Simple fire-and-forget scheduler using asyncio for demo purposes.
Events are not persisted and will be lost on server restart.
"""

import asyncio
import json
import logging
from typing import Any, Dict

from app.services.sse import sse_manager

logger = logging.getLogger(__name__)


async def _delayed_broadcast(delay_seconds: float, event_type: str, event_data: Dict[str, Any]):
    """Internal async function to wait and then broadcast SSE event."""
    logger.info(f"Scheduled SSE event '{event_type}' in {delay_seconds}s")
    await asyncio.sleep(delay_seconds)
    
    # Convert data to JSON string for SSE
    data_json = json.dumps(event_data)
    await sse_manager.broadcast(event_type, data_json)
    logger.info(f"Broadcasted SSE event '{event_type}': {data_json[:100]}...")


def schedule_sse_event(
    event_type: str,
    event_data: Dict[str, Any],
    delay_seconds: float = 5.0,
) -> None:
    """Schedule an SSE event to be broadcast after a delay.
    
    This is a fire-and-forget function that creates an async task.
    The task will run in the background and broadcast the event after the delay.
    
    Args:
        event_type: SSE event type (e.g., 'url_summary_complete')
        event_data: Data to send with the event
        delay_seconds: Delay before broadcasting (default: 5.0 for testing)
    """
    # Create background task - fire and forget
    asyncio.create_task(_delayed_broadcast(delay_seconds, event_type, event_data))
    logger.info(f"Created scheduled SSE task: {event_type} in {delay_seconds}s")
