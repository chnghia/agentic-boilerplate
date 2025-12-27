"""Streaming utilities for LangGraph and SSE responses."""

import json
import uuid
import logging
from typing import Any, Dict, Sequence

from fastapi.responses import StreamingResponse
from langgraph.graph.state import CompiledStateGraph
from openai.types.chat.chat_completion_message_param import ChatCompletionMessageParam

logger = logging.getLogger(__name__)


def format_sse(payload: dict) -> str:
    """Format a payload as a Server-Sent Event."""
    return f"data: {json.dumps(payload, separators=(',', ':'))}\n\n"


async def stream_text(
    graph: CompiledStateGraph,
    messages: Sequence[ChatCompletionMessageParam],
    protocol: str = "data",
):
    """Yield Server-Sent Events for a streaming LangGraph execution.
    
    Converts LangGraph events to SSE format compatible with the frontend.
    
    Args:
        graph: Compiled LangGraph graph
        messages: Messages in OpenAI format
        protocol: SSE protocol version
        
    Yields:
        SSE formatted strings
    """
    try:
        message_id = f"msg-{uuid.uuid4().hex}"
        text_stream_id = "text-1"
        text_started = False
        text_finished = False
        finish_reason = None
        
        # Track tool calls to emit proper events
        active_tool_calls: Dict[str, Dict[str, Any]] = {}

        yield format_sse({"type": "start", "messageId": message_id})

        # Stream events from LangGraph
        demo_response_emitted = False
        
        async for event in graph.astream_events(
            {"messages": messages},
            version="v2",
        ):
            event_type = event.get("event")
            
            # Handle chat model streaming (text deltas only)
            if event_type == "on_chat_model_stream":
                chunk = event.get("data", {}).get("chunk")
                if chunk and hasattr(chunk, "content") and chunk.content:
                    if not text_started:
                        yield format_sse({"type": "text-start", "id": text_stream_id})
                        text_started = True
                    yield format_sse({
                        "type": "text-delta",
                        "id": text_stream_id,
                        "delta": chunk.content
                    })
                # TODO: [Future Enhancement] Restore tool_call_chunks streaming for large cards/code generation
                # 
                # Currently, tool call chunks are NOT handled here to avoid duplicate events.
                # Tool events are only handled by on_tool_start and on_tool_end.
                #
                # The challenge is that tool_call_chunks use a different ID format than LangGraph's run_id.
                # To restore streaming:
                # 1. Extract tool_call_id from chunk.tool_call_chunks[].id
                # 2. Map this to the LangGraph run_id when on_tool_start fires
                # 3. Emit tool-input-delta events with consistent IDs
                #
                # Benefits of restoring:
                # - Progressive display of tool arguments (useful for code generation previews)
                # - Better UX for long-running tool inputs
                #
                # See: https://python.langchain.com/docs/concepts/streaming/
            
            # Handle tool start
            elif event_type == "on_tool_start":
                tool_name = event.get("name", "")
                run_id = event.get("run_id", "")
                tool_input = event.get("data", {}).get("input", {})
                
                # Use run_id as tool_call_id if not already tracked
                tool_call_id = run_id
                
                if tool_call_id not in active_tool_calls:
                    active_tool_calls[tool_call_id] = {
                        "name": tool_name,
                        "args": tool_input
                    }
                    yield format_sse({
                        "type": "tool-input-start",
                        "toolCallId": tool_call_id,
                        "toolName": tool_name,
                    })
                
                # Emit tool input available
                yield format_sse({
                    "type": "tool-input-available",
                    "toolCallId": tool_call_id,
                    "toolName": tool_name,
                    "input": tool_input,
                })
            
            # Handle tool end
            elif event_type == "on_tool_end":
                run_id = event.get("run_id", "")
                tool_output = event.get("data", {}).get("output")
                
                tool_call_id = run_id
                
                # Extract and parse output content
                if hasattr(tool_output, "content"):
                    content = tool_output.content
                    # Try to parse JSON string to dict
                    if isinstance(content, str):
                        try:
                            output_content = json.loads(content)
                        except json.JSONDecodeError:
                            output_content = content
                    else:
                        output_content = content
                elif isinstance(tool_output, dict):
                    output_content = tool_output
                elif isinstance(tool_output, str):
                    try:
                        output_content = json.loads(tool_output)
                    except json.JSONDecodeError:
                        output_content = tool_output
                else:
                    output_content = str(tool_output) if tool_output else ""
                
                yield format_sse({
                    "type": "tool-output-available",
                    "toolCallId": tool_call_id,
                    "output": output_content,
                })
            
            # Handle chain/graph end for finish reason and demo_response
            elif event_type == "on_chain_end":
                event_name = event.get("name", "")
                event_data = event.get("data", {})
                
                # Check for demo_response from demo sub-agent
                if event_name == "process_demo" and not demo_response_emitted:
                    output = event_data.get("output", {})
                    demo_response = output.get("demo_response")
                    
                    if demo_response:
                        logger.info(f"Emitting PAH component: {demo_response.get('type')}")
                        
                        # Emit intro text if present
                        intro_text = demo_response.get("introText")
                        if intro_text:
                            if not text_started:
                                yield format_sse({"type": "text-start", "id": text_stream_id})
                                text_started = True
                            yield format_sse({
                                "type": "text-delta",
                                "id": text_stream_id,
                                "delta": intro_text
                            })
                            yield format_sse({"type": "text-end", "id": text_stream_id})
                            text_finished = True
                        
                        # Emit PAH component as a "tool" output
                        # This follows the same pattern as regular tools (Weather, etc.)
                        # so message.tsx can render it using the existing tool-* handling
                        component_type = demo_response.get("type", "pah-unknown")
                        tool_call_id = f"pah-{uuid.uuid4().hex[:8]}"
                        tool_name = component_type  # e.g., "pah-log-draft-card"
                        component_data = demo_response.get("data", {})
                        
                        # Emit tool-input-start
                        yield format_sse({
                            "type": "tool-input-start",
                            "toolCallId": tool_call_id,
                            "toolName": tool_name,
                        })
                        
                        # Emit tool-input-available (no input needed for demo)
                        yield format_sse({
                            "type": "tool-input-available",
                            "toolCallId": tool_call_id,
                            "toolName": tool_name,
                            "input": {},
                        })
                        
                        # Emit tool-output-available with PAH component data
                        yield format_sse({
                            "type": "tool-output-available",
                            "toolCallId": tool_call_id,
                            "output": component_data,
                        })
                        
                        demo_response_emitted = True
                
                # Check for graph end
                if event_name == "LangGraph":
                    finish_reason = "stop"

        # Finalize text stream if started
        if text_started and not text_finished:
            yield format_sse({"type": "text-end", "id": text_stream_id})
            text_finished = True

        # Emit finish event
        finish_metadata: Dict[str, Any] = {}
        if finish_reason:
            finish_metadata["finishReason"] = finish_reason
        
        if finish_metadata:
            yield format_sse({"type": "finish", "messageMetadata": finish_metadata})
        else:
            yield format_sse({"type": "finish"})

        yield "data: [DONE]\n\n"
        
    except Exception as e:
        logger.exception("Error in stream_text")
        yield format_sse({
            "type": "error",
            "error": str(e)
        })
        raise


def patch_response_with_headers(
    response: StreamingResponse,
    protocol: str = "data",
) -> StreamingResponse:
    """Apply the standard streaming headers expected by the Vercel AI SDK."""

    response.headers["x-vercel-ai-ui-message-stream"] = "v1"
    response.headers["Cache-Control"] = "no-cache"
    response.headers["Connection"] = "keep-alive"
    response.headers["X-Accel-Buffering"] = "no"

    if protocol:
        response.headers.setdefault("x-vercel-ai-protocol", protocol)

    return response