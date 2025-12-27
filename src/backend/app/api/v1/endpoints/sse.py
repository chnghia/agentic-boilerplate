import asyncio

from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse

from app.services.policies import PolicyService
from app.services.sse import sse_manager

router = APIRouter()


@router.get("/agent/events")
async def sse_endpoint(request: Request):
    async def event_generator():
        # Check if already shutting down
        if sse_manager.is_shutting_down():
            return

        # 1. Initial Check on Connection
        policy = PolicyService()
        confidence = policy.evaluate_proactive_trigger("daily_tick", {"time": "now"})

        if policy.should_emit_prompt_card(confidence):
            # Immediate prompt for new connection
            invite_payload = '{"type": "conversation_invite", "context_id": "daily_log", "message": "Good morning! Ready for your daily log?", "confidence": 0.9}'
            yield f"event: conversation_invite\ndata: {invite_payload}\n\n"

        # 2. Subscribe to Broadcasts
        queue = await sse_manager.connect()
        try:
            while True:
                if await request.is_disconnected():
                    break
                if sse_manager.is_shutting_down():
                    break

                # Use wait_for with timeout to check shutdown periodically
                try:
                    data = await asyncio.wait_for(queue.get(), timeout=1.0)
                    if data is None:  # Shutdown signal
                        break
                    yield data
                except asyncio.TimeoutError:
                    continue  # Check shutdown status again

        except asyncio.CancelledError:
            pass
        finally:
            sse_manager.disconnect(queue)

    return StreamingResponse(event_generator(), media_type="text/event-stream")