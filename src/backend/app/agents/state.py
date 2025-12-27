"""Agent state definitions for LangGraph."""

from typing import Annotated, Any, Dict, Optional
from typing_extensions import TypedDict
from langgraph.graph.message import add_messages


class AgentState(TypedDict):
    """State for the orchestrator agent.
    
    Uses add_messages reducer to properly handle message updates.
    Extends with additional fields as needed for future features.
    """
    messages: Annotated[list, add_messages]
    # Response from demo sub-agent (PAH component data)
    demo_response: Optional[Dict[str, Any]]
    # Callback context from /callback endpoint
    callback_context: Optional[Dict[str, Any]]
    # Response from callback sub-agent
    callback_response: Optional[Dict[str, Any]]

