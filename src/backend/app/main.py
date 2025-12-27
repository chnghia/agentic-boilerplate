import logging
import signal
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from vercel.headers import set_headers

from app.api.v1.api import api_router
from app.core.settings import settings
from app.services.sse import sse_manager

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifespan - startup and shutdown events."""
    # Startup - register signal handlers AFTER uvicorn's handlers are set
    # This allows us to "chain" our handler with uvicorn's
    original_sigint = signal.getsignal(signal.SIGINT)
    original_sigterm = signal.getsignal(signal.SIGTERM)

    def chained_signal_handler(signum, frame):
        """Set SSE shutdown flag, then forward to uvicorn's handler."""
        sig_name = signal.Signals(signum).name
        logger.info(f"Received {sig_name}, triggering SSE shutdown flag...")
        
        # Set shutdown flag SYNCHRONOUSLY - this is safe from signal handler
        # SSE loops will detect this within their timeout period
        sse_manager._shutdown_event.set()
        
        # Push None to all queues synchronously (safe for simple puts)
        for queue in sse_manager.active_connections:
            try:
                queue.put_nowait(None)
            except Exception:
                pass
        
        # Forward to uvicorn's original handler for proper shutdown
        if signum == signal.SIGINT and callable(original_sigint):
            original_sigint(signum, frame)
        elif signum == signal.SIGTERM and callable(original_sigterm):
            original_sigterm(signum, frame)

    signal.signal(signal.SIGINT, chained_signal_handler)
    signal.signal(signal.SIGTERM, chained_signal_handler)

    logger.info("Application starting up...")
    yield
    
    # Shutdown - cleanup any remaining connections
    logger.info("Application shutting down...")
    if not sse_manager.is_shutting_down():
        await sse_manager.shutdown()


app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.PROJECT_DESCRIPTION,
    version=settings.PROJECT_VERSION,
    lifespan=lifespan,
)

@app.middleware("http")
async def _vercel_set_headers(request: Request, call_next):
    set_headers(dict(request.headers))
    return await call_next(request)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)