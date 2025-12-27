"""Callback endpoint for frontend component confirmations.

Routes callback requests through the orchestrator agent for proper
architecture alignment. The callback_agent handles the logic,
and this endpoint handles async SSE scheduling.
"""

import logging
from typing import Any, Dict, Optional

from fastapi import APIRouter
from pydantic import BaseModel

from app.agents import get_orchestrator_graph
from app.services.scheduler import schedule_sse_event

logger = logging.getLogger(__name__)

router = APIRouter()


class CallbackRequest(BaseModel):
    """Request body for component callbacks."""
    action: str  # e.g., "confirm", "save", "read_later"
    component_type: str  # e.g., "resource-preview"
    data: Dict[str, Any]  # Component-specific data
    delay_seconds: Optional[float] = 5.0  # Configurable delay for testing


class CallbackResponse(BaseModel):
    """Response for callback endpoint."""
    success: bool
    message: str
    scheduled_event: Optional[str] = None


@router.post("/agent/callback", response_model=CallbackResponse)
async def handle_callback(request: CallbackRequest):
    """Handle callbacks from frontend components.
    
    Routes through the orchestrator agent which delegates to callback_agent.
    The agent returns scheduling info, and we handle async SSE scheduling here.
    """
    logger.info(f"Received callback: action={request.action}, type={request.component_type}")
    logger.debug(f"Callback data: {request.data}")
    
    # Get the orchestrator graph
    graph = get_orchestrator_graph()
    
    # Invoke with callback_context (triggers callback_agent routing)
    result = await graph.ainvoke({
        "messages": [],  # No messages for callback
        "callback_context": {
            "action": request.action,
            "component_type": request.component_type,
            "data": request.data,
            "delay_seconds": request.delay_seconds,
        }
    })
    
    # Extract callback response from agent result
    callback_response = result.get("callback_response", {})
    
    # Handle SSE scheduling if agent returned scheduling info
    sse_event = callback_response.get("sse_event")
    if sse_event:
        schedule_sse_event(
            event_type=sse_event["event_type"],
            event_data=sse_event["event_data"],
            delay_seconds=sse_event["delay_seconds"],
        )
        logger.info(f"Scheduled SSE event: {sse_event['event_type']} in {sse_event['delay_seconds']}s")
    
    return CallbackResponse(
        success=callback_response.get("success", False),
        message=callback_response.get("message", "Unknown error"),
        scheduled_event=callback_response.get("scheduled_event"),
    )
