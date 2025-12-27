from fastapi import APIRouter
from app.api.v1.endpoints import sse, chat, callback

api_router = APIRouter()
api_router.include_router(chat.router, tags=["chat"])
api_router.include_router(sse.router, tags=["sse"])
api_router.include_router(callback.router, tags=["callback"])