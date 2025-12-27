"""Chat API endpoint using LangGraph orchestrator."""

import logging
from typing import List

from fastapi import APIRouter, Query
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from app.agents import get_orchestrator_graph
from app.utils.prompt import ClientMessage, convert_to_openai_messages
from app.utils.stream import stream_text, patch_response_with_headers

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

router = APIRouter()


class Request(BaseModel):
    messages: List[ClientMessage]


@router.post("/agent/chat")
async def handle_chat_data(request: Request, protocol: str = Query('data')):
    """Handle chat requests using LangGraph orchestrator.
    
    Receives messages from frontend, converts to OpenAI format,
    streams through LangGraph orchestrator, and returns SSE response.
    """
    logger.debug("=" * 50)
    logger.debug("Received chat request")
    logger.debug(f"Protocol: {protocol}")
    
    messages = request.messages
    openai_messages = convert_to_openai_messages(messages)
    
    # Get the orchestrator graph (lazy initialization)
    graph = get_orchestrator_graph()

    response = StreamingResponse(
        stream_text(graph, openai_messages, protocol),
        media_type="text/event-stream"
    )
    return patch_response_with_headers(response, protocol)
