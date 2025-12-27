"""Mock response data for PAH component demos.

Contains mock data converted from frontend mock-data.ts for testing
PAH UI components through the demo sub-agent.
"""

from typing import Any, Dict, List

# Type aliases for clarity
MockResponse = Dict[str, Any]

# ===== Mock Responses for PAH Components =====

MOCK_RESPONSES: Dict[str, MockResponse] = {
    # Text message demo
    "text": {
        "type": "pah-text",
        "messages": [
            {
                "role": "user",
                "content": "Can you help me build a REST API with Python?"
            },
            {
                "role": "assistant",
                "content": """# Building REST APIs with Python

Great question! I'd recommend using **FastAPI** - it's modern, fast, and has excellent documentation.

## Quick Start

Here are the key benefits:
- 🚀 **Fast**: Very high performance
- 📝 **Auto-docs**: Swagger UI built-in
- ✅ **Type hints**: Full Python type support"""
            }
        ]
    },

    # Log Draft Card demo (Main PAH Element)
    "log-draft": {
        "type": "pah-log-draft-card",
        "data": {
            "originalMessage": "Spent 3 hours on backend fixing login bug",
            "defaultValues": {
                "workspaceId": "work",
                "taskContent": "Fix login bug on backend - handle authentication flow",
                "duration": 180,  # 3 hours = 180 minutes
                "tags": ["backend", "bugfix", "authentication"],
            },
            "workspaces": [
                {"id": "work", "name": "Work", "color": "#3b82f6"},
                {"id": "pah", "name": "PAH Project", "color": "#f97316"},
                {"id": "personal", "name": "Personal", "color": "#10b981"},
            ],
            "suggestedTags": ["backend", "bugfix", "authentication"],
            "state": "editing",
        },
        "introText": "I've recorded your activity. Please review and confirm the details below:",
    },

    # Timesheet Form demo
    "timesheet": {
        "type": "pah-timesheet-form",
        "data": {
            "defaultValues": {
                "project": "PAH Development",
                "task": "Implement new features",
                "hours": 8,
            },
            "state": "input",
        },
        "introText": "Please fill in your timesheet information in the form below:",
    },

    # Daily Summary demo
    "daily-summary": {
        "type": "pah-daily-summary",
        "data": {
            "date": "Wednesday, December 24, 2025",
            "tasks": [
                {
                    "id": "t1",
                    "title": "Fix login bug on backend - handle authentication flow",
                    "projectName": "PAH Project",
                    "projectColor": "#f97316",
                    "startTime": "09:00",
                    "endTime": "12:00",
                    "duration": 180,
                },
                {
                    "id": "t2",
                    "title": "Weekly project planning meeting",
                    "projectName": "Work",
                    "projectColor": "#3b82f6",
                    "startTime": "13:30",
                    "endTime": "14:30",
                    "duration": 60,
                },
                {
                    "id": "t3",
                    "title": "Code review for feature branch",
                    "projectName": "PAH Project",
                    "projectColor": "#f97316",
                    "startTime": "15:00",
                    "endTime": "17:00",
                    "duration": 120,
                },
            ],
        },
        "introText": "Here is a summary of the work you've done today:",
    },

    # News Digest demo
    "news-digest": {
        "type": "pah-news-digest",
        "data": {
            "items": [
                {
                    "id": "news-1",
                    "title": "OpenAI Announces New Sparse Autoencoders for Model Interpretability",
                    "summary": "New research helps deepen understanding of how neurons in LLMs work.",
                    "url": "https://openai.com/news/sparse-autoencoders",
                    "relevanceScore": 98,
                    "source": "OpenAI Blog",
                },
                {
                    "id": "news-2",
                    "title": "Meta Releases Llama 3.1: The First Frontier-Level Open Source Model",
                    "summary": "The release of Llama 3.1 405B marks a major turning point for the open source community.",
                    "url": "https://ai.meta.com/blog/llama-3-1-open-source/",
                    "relevanceScore": 95,
                    "source": "Meta AI",
                },
                {
                    "id": "news-3",
                    "title": "Mistral NeMo: A New 12B Model Developed with NVIDIA",
                    "summary": "A small but powerful model, optimized for consumer GPU video memory.",
                    "url": "https://mistral.ai/news/mistral-nemo/",
                    "relevanceScore": 89,
                    "source": "Mistral AI",
                },
            ],
        },
        "introText": "Good morning! Here are the highlighted news items selected just for you:",
    },

    # Resource Preview demo
    "resource-preview": {
        "type": "pah-resource-preview",
        "data": {
            "data": {
                "url": "https://medium.com/p/65487654",
                "title": "Advanced Vector Search with LanceDB and Python",
                "domain": "medium.com",
                "imageUrl": "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000",
                "aiSummary": "This article guides how to use LanceDB to perform advanced vector search.",
                "userIntent": "Researching LanceDB to apply for vector search in the PAH project.",
                "tags": ["LanceDB", "Vector Search", "Python", "Database"],
            },
            "state": "editing",
        },
        "introText": "I see you just sent a link. Here is my preview and analysis:",
    },

    # Learning Plan demo
    "learning-plan": {
        "type": "pah-learning-plan",
        "data": {
            "sessions": [
                {
                    "id": "s1",
                    "title": "Advanced Vector Search with LanceDB",
                    "reason": "You saved this 3 days ago to research for the PAH project.",
                    "estimatedTime": "15 mins",
                    "sourceDomain": "medium.com",
                },
                {
                    "id": "s2",
                    "title": "Understanding Sparse Autoencoders",
                    "reason": "Hot news from OpenAI this morning you just bookmarked.",
                    "estimatedTime": "10 mins",
                    "sourceDomain": "openai.com",
                },
                {
                    "id": "s3",
                    "title": "Tailwind CSS Performance Optimization",
                    "reason": "You noted this last week when doing UI.",
                    "estimatedTime": "8 mins",
                    "sourceDomain": "tailwindcss.com",
                },
            ],
        },
    },

    # Quiz demo
    "quiz": {
        "type": "pah-quiz",
        "data": {
            "questions": [
                {
                    "id": "q1",
                    "type": "multiple-choice",
                    "question": "What is the main purpose of Sparse Autoencoders (SAEs) in OpenAI's research?",
                    "options": [
                        {"id": "a", "text": "Increase model training speed"},
                        {"id": "b", "text": "Reduce checkpoint file size"},
                        {"id": "c", "text": "Decode the meaning of neurons in LLMs (Interpretability)"},
                        {"id": "d", "text": "Replace Transformer architecture"},
                    ],
                    "correctAnswer": "c",
                    "explanation": "Sparse Autoencoders help map densely active neurons in LLMs to sparser 'features'.",
                },
                {
                    "id": "q2",
                    "type": "free-text",
                    "question": "Why is model sparsity important for interpretability?",
                    "explanation": "Sparsity ensures that at any given time, only a small number of features are activated.",
                },
            ],
        },
    },
}


def get_mock_response(component_name: str) -> MockResponse | None:
    """Get mock response for a component name.
    
    Args:
        component_name: Name of the component (e.g., 'log-draft', 'timesheet')
        
    Returns:
        Mock response dict or None if not found
    """
    return MOCK_RESPONSES.get(component_name)


def get_available_components() -> List[str]:
    """Get list of available demo component names."""
    return list(MOCK_RESPONSES.keys())
