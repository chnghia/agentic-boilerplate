"""Callback sub-agent for handling frontend component confirmations.

This sub-agent processes callback requests from interactive components
(e.g., ResourcePreviewCard) and returns scheduling info for SSE events.
The actual async scheduling is handled by the callback endpoint.
"""

import logging
from typing import Any, Dict
from functools import lru_cache

from langgraph.graph import StateGraph, END

from app.agents.state import AgentState

logger = logging.getLogger(__name__)


def is_callback_intent(state: AgentState) -> bool:
    """Check if state contains callback context.
    
    Args:
        state: Current agent state
        
    Returns:
        True if callback_context is present
    """
    return bool(state.get("callback_context"))


def process_callback(state: AgentState) -> Dict[str, Any]:
    """Process callback request and return scheduling info.
    
    The agent doesn't schedule SSE events directly (async issues in thread pool).
    Instead, it returns the scheduling info for the endpoint to handle.
    
    Args:
        state: Current agent state with callback_context
        
    Returns:
        State update with callback_response containing scheduling info
    """
    callback_ctx = state.get("callback_context", {})
    if not callback_ctx:
        return {
            "callback_response": {
                "success": False,
                "message": "No callback context found"
            }
        }
    
    action = callback_ctx.get("action", "")
    component_type = callback_ctx.get("component_type", "")
    data = callback_ctx.get("data", {})
    delay_seconds = callback_ctx.get("delay_seconds", 5.0)
    
    logger.info(f"Callback agent processing: {component_type}/{action}")
    
    # Handle resource-preview component
    if component_type == "resource-preview":
        if action in ("save", "read_later", "confirm"):
            # Build SSE event data to be scheduled by endpoint
            sse_event = {
                "event_type": "url_summary_complete",
                "delay_seconds": delay_seconds,
                "event_data": {
                    "type": "url_summary_complete",
                    "status": "completed",
                    "message": "Summarization complete! Do you want to view it?",
                    "resource": {
                        "url": data.get("url", ""),
                        "title": data.get("title", "Resource"),
                        "summary": "This is a mock summary of the URL. In production, this will be the result from AI summarization.",
                    },
                    "action_taken": action,
                },
            }
            
            return {
                "callback_response": {
                    "success": True,
                    "message": f"Prepared url_summary_complete event with {delay_seconds}s delay",
                    "scheduled_event": "url_summary_complete",
                    "sse_event": sse_event,  # Endpoint will schedule this
                }
            }
    
    # Unknown component type or action
    logger.warning(f"Unhandled callback: {component_type}/{action}")
    return {
        "callback_response": {
            "success": False,
            "message": f"Unknown component type or action: {component_type}/{action}",
        }
    }


@lru_cache(maxsize=1)
def get_callback_agent_graph():
    """Create and compile the callback sub-agent graph (lazy singleton).
    
    This graph handles callback requests from frontend components
    and returns scheduling info for SSE events.
    
    Returns:
        Compiled LangGraph graph for callback processing
    """
    logger.info("Initializing callback sub-agent graph")
    
    # Build the graph
    graph = StateGraph(AgentState)
    
    # Add single processing node
    graph.add_node("process_callback", process_callback)
    
    # Simple flow: start -> process -> end
    graph.add_edge("__start__", "process_callback")
    graph.add_edge("process_callback", END)
    
    return graph.compile()
