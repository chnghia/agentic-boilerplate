"""Demo sub-agent for PAH component demos.

This sub-agent handles /demo commands and returns mock PAH component data.
It simulates the persona agent pattern where orchestrator delegates to
specialized sub-agents.
"""

import logging
from typing import Any, Dict, Optional
from functools import lru_cache

from langgraph.graph import StateGraph, END
from langchain_core.messages import AIMessage

from app.agents.state import AgentState
from app.agents.mock_responses import get_mock_response, get_available_components

logger = logging.getLogger(__name__)


def parse_demo_command(message_content: str) -> Optional[str]:
    """Extract component name from /demo command.
    
    Args:
        message_content: The message content (e.g., "/demo log-draft")
        
    Returns:
        Component name or None if not a demo command
    """
    if not message_content.startswith("/demo "):
        return None
    return message_content.replace("/demo ", "").strip().lower()


def process_demo(state: AgentState) -> Dict[str, Any]:
    """Process demo command and return mock component data.
    
    Args:
        state: Current agent state with messages
        
    Returns:
        State update with demo_response containing component data
    """
    # Get the last user message
    messages = state.get("messages", [])
    if not messages:
        return {"demo_response": {"error": "No messages found"}}
    
    last_msg = messages[-1]
    content = last_msg.content if hasattr(last_msg, 'content') else str(last_msg)
    
    # Parse the demo command
    component_name = parse_demo_command(content)
    if not component_name:
        return {"demo_response": {"error": "Invalid demo command format"}}
    
    # Get mock response
    mock_response = get_mock_response(component_name)
    if mock_response:
        logger.info(f"Demo agent returning mock response for: {component_name}")
        return {"demo_response": mock_response}
    
    # Component not found - return help text
    available = get_available_components()
    help_text = f"Unknown component: '{component_name}'. Available: {', '.join(available)}"
    return {
        "demo_response": {
            "type": "pah-text",
            "messages": [{"role": "assistant", "content": help_text}]
        }
    }


@lru_cache(maxsize=1)
def get_demo_agent_graph():
    """Create and compile the demo sub-agent graph (lazy singleton).
    
    This graph handles /demo commands by looking up mock responses
    and returning PAH component data for the frontend to render.
    
    Returns:
        Compiled LangGraph graph for demo processing
    """
    logger.info("Initializing demo sub-agent graph")
    
    # Build the graph
    graph = StateGraph(AgentState)
    
    # Add single processing node
    graph.add_node("process_demo", process_demo)
    
    # Simple flow: start -> process -> end
    graph.add_edge("__start__", "process_demo")
    graph.add_edge("process_demo", END)
    
    return graph.compile()


def is_demo_command(message_content: str) -> bool:
    """Check if a message is a /demo command.
    
    Args:
        message_content: The message content to check
        
    Returns:
        True if this is a demo command
    """
    return message_content.strip().startswith("/demo ")
