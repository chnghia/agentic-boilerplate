"""LangGraph orchestrator agent for chat conversations.

Routes requests to appropriate sub-agents:
- callback_context -> callback_agent (from /callback endpoint)
- /demo commands -> demo_agent
- Normal messages -> LLM agent with tools
"""

import logging
from functools import lru_cache
from typing import Literal

from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode, tools_condition
from langchain_openai import ChatOpenAI

from app.agents.state import AgentState
from app.agents.tools import TOOLS
from app.agents.demo_agent import is_demo_command, get_demo_agent_graph
from app.agents.callback_agent import is_callback_intent, get_callback_agent_graph
from app.core.settings import settings

logger = logging.getLogger(__name__)


def route_message(state: AgentState) -> Literal["callback_agent", "demo_agent", "llm_agent"]:
    """Route incoming request to the appropriate handler.
    
    Args:
        state: Current agent state
        
    Returns:
        "callback_agent" for callback context,
        "demo_agent" for /demo commands,
        "llm_agent" for normal messages
    """
    # Check for callback context first (from /callback endpoint)
    if is_callback_intent(state):
        logger.info("Routing to callback agent")
        return "callback_agent"
    
    # Check for demo commands
    messages = state.get("messages", [])
    if messages:
        last_msg = messages[-1]
        content = last_msg.content if hasattr(last_msg, 'content') else str(last_msg)
        
        if is_demo_command(content):
            logger.info(f"Routing to demo agent: {content[:50]}...")
            return "demo_agent"
    
    return "llm_agent"


def run_demo_subgraph(state: AgentState) -> dict:
    """Execute the demo sub-agent and return its response.
    
    Args:
        state: Current agent state
        
    Returns:
        State update with demo_response
    """
    demo_graph = get_demo_agent_graph()
    result = demo_graph.invoke(state)
    return {"demo_response": result.get("demo_response")}


def run_callback_subgraph(state: AgentState) -> dict:
    """Execute the callback sub-agent and return its response.
    
    Args:
        state: Current agent state with callback_context
        
    Returns:
        State update with callback_response
    """
    callback_graph = get_callback_agent_graph()
    result = callback_graph.invoke(state)
    return {"callback_response": result.get("callback_response")}


@lru_cache(maxsize=1)
def get_orchestrator_graph():
    """Create and compile the orchestrator agent graph (lazy singleton).
    
    Routes requests to:
    - callback_agent: handles /callback endpoint requests
    - demo_agent: handles /demo commands
    - llm_agent: handles normal conversations with tools
    
    Uses lru_cache to ensure graph is only created once and reused.
    
    Returns:
        Compiled LangGraph graph ready for invocation/streaming.
    """
    logger.info(f"Orchestrator LLM Base URL: {settings.LLM_BASE_URL}")
    logger.info(f"Orchestrator LLM Model: {settings.LLM_MODEL}")

    # Initialize the LLM with tools bound
    model = ChatOpenAI(
        model=settings.LLM_MODEL,
        api_key=settings.LLM_API_KEY,
        base_url=settings.LLM_BASE_URL,
        streaming=True,
    ).bind_tools(TOOLS)

    def call_model(state: AgentState):
        """LLM agent node: call the model with current messages."""
        response = model.invoke(state["messages"])
        return {"messages": [response]}

    # Build the graph
    graph = StateGraph(AgentState)
    
    # Add nodes
    graph.add_node("llm_agent", call_model)
    graph.add_node("tools", ToolNode(TOOLS))
    graph.add_node("demo_agent", run_demo_subgraph)
    graph.add_node("callback_agent", run_callback_subgraph)
    
    # Add routing from start
    graph.add_conditional_edges(
        "__start__",
        route_message,
        {
            "callback_agent": "callback_agent",
            "demo_agent": "demo_agent",
            "llm_agent": "llm_agent",
        }
    )
    
    # Callback agent and demo agent go directly to end
    graph.add_edge("callback_agent", END)
    graph.add_edge("demo_agent", END)
    
    # LLM agent can call tools
    graph.add_conditional_edges("llm_agent", tools_condition)
    graph.add_edge("tools", "llm_agent")
    
    return graph.compile()

