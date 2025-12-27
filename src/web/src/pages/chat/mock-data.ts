"use client";

import type { MockUIMessage } from "@/components/functional/chat/mock-message";

// ===== Sample Mock Messages organized by component type =====

export const mockComponentDemos: Record<string, MockUIMessage[]> = {
    // Text message demo
    "text": [
        {
            id: "text-user-1",
            role: "user",
            parts: [{ type: "text", role: "user", content: "Can you help me build a REST API with Python?" }],
        },
        {
            id: "text-assistant-1",
            role: "assistant",
            parts: [{
                type: "text",
                role: "assistant",
                content: `# Building REST APIs with Python

Great question! I'd recommend using **FastAPI** - it's modern, fast, and has excellent documentation.

## Quick Start

Here are the key benefits:
- 🚀 **Fast**: Very high performance
- 📝 **Auto-docs**: Swagger UI built-in
- ✅ **Type hints**: Full Python type support`
            }],
        },
    ],

    // Reasoning demo
    "reasoning": [
        {
            id: "reasoning-1",
            role: "assistant",
            parts: [{
                type: "reasoning",
                content: `Let me think about the best approach here...

First, I should consider what frameworks are available:
1. Flask - Lightweight and simple
2. FastAPI - Modern, fast, with automatic docs
3. Django REST Framework - Full-featured

I'll recommend FastAPI as it has the best balance of simplicity and features.`,
                isStreaming: false,
                duration: 5,
            }],
        },
    ],

    // Chain of Thought demo
    "chain-of-thought": [
        {
            id: "cot-1",
            role: "assistant",
            parts: [{
                type: "chain-of-thought",
                steps: [
                    { label: "Analyzing user requirements", description: "Understanding the need for REST API", status: "complete" },
                    { label: "Searching documentation", description: "Looking for best practices", status: "complete", searchResults: ["OAuth2 Guide", "JWT Tokens", "API Keys"] },
                    { label: "Generating code examples", status: "complete" },
                    { label: "Preparing response", status: "active" },
                ],
            }],
        },
    ],

    // Tool demo
    "tool": [
        {
            id: "tool-1",
            role: "assistant",
            parts: [{
                type: "tool",
                toolName: "search_documentation",
                input: { query: "FastAPI authentication", limit: 5 },
                output: {
                    results: [
                        { title: "Security - FastAPI", url: "https://fastapi.tiangolo.com/tutorial/security/" },
                        { title: "OAuth2 with Password", url: "https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/" },
                    ],
                },
                state: "output-available",
            }],
        },
    ],

    // Code Block demo
    "code-block": [
        {
            id: "code-1",
            role: "assistant",
            parts: [{
                type: "code-block",
                language: "python",
                code: `from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/items/{item_id}")
async def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}`,
                showLineNumbers: true,
            }],
        },
    ],

    // Artifact demo
    "artifact": [
        {
            id: "artifact-1",
            role: "assistant",
            parts: [{
                type: "artifact",
                title: "Project Structure",
                description: "A production-ready FastAPI layout",
                content: `my_api/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── models/
│   └── routers/
├── tests/
└── requirements.txt`,
            }],
        },
    ],

    // Sources demo
    "sources": [
        {
            id: "sources-1",
            role: "assistant",
            parts: [{
                type: "sources",
                sources: [
                    { title: "FastAPI Official Documentation", href: "https://fastapi.tiangolo.com/" },
                    { title: "Python REST API Best Practices", href: "https://realpython.com/api-integration-python/" },
                ],
            }],
        },
    ],

    // Suggestions demo
    "suggestions": [
        {
            id: "suggestions-1",
            role: "assistant",
            parts: [{
                type: "suggestions",
                suggestions: ["Add database support", "Show authentication example", "Deploy to production", "Add unit tests"],
            }],
        },
    ],

    // Loader demo
    "loader": [
        {
            id: "loader-1",
            role: "assistant",
            parts: [{ type: "loader", text: "Generating database schema..." }],
        },
    ],

    // Confirmation demo
    "confirmation": [
        {
            id: "confirmation-1",
            role: "assistant",
            parts: [{
                type: "confirmation",
                toolName: "create_file",
                state: "approval-requested",
            }],
        },
    ],

    // Timesheet Form demo (PAH Element)
    "timesheet-form": [
        {
            id: "timesheet-intro",
            role: "assistant",
            parts: [{
                type: "text",
                role: "assistant",
                content: "Please fill in your timesheet information in the form below:",
            }],
        },
        {
            id: "timesheet-form-1",
            role: "assistant",
            parts: [{
                type: "timesheet-form",
                defaultValues: {
                    project: "PAH Development",
                    task: "Implement new features",
                    hours: 8,
                },
                state: "input",
            }],
        },
    ],

    // Timesheet submitted state demo
    "timesheet-submitted": [
        {
            id: "timesheet-submitted-1",
            role: "assistant",
            parts: [{
                type: "timesheet-form",
                defaultValues: {
                    project: "PAH Development",
                    task: "Code review",
                    hours: 2,
                },
                state: "submitted",
            }],
        },
    ],

    // Timesheet confirmed state demo
    "timesheet-confirmed": [
        {
            id: "timesheet-confirmed-1",
            role: "assistant",
            parts: [{
                type: "timesheet-form",
                defaultValues: {
                    project: "PAH Development",
                    task: "Meeting",
                    hours: 1,
                },
                state: "confirmed",
            }],
        },
    ],

    // Log Draft Card demo (Main PAH Element)
    "log-draft-card": [
        {
            id: "log-user-1",
            role: "user",
            parts: [{ type: "text", role: "user", content: "Spent 3 hours on backend fixing login bug" }],
        },
        {
            id: "log-assistant-1",
            role: "assistant",
            parts: [{
                type: "text",
                role: "assistant",
                content: "I have recorded your activity. Please review and confirm the details below:",
            }],
        },
        {
            id: "log-draft-1",
            role: "assistant",
            parts: [{
                type: "log-draft-card",
                originalMessage: "Spent 3 hours on backend fixing login bug",
                defaultValues: {
                    workspaceId: "work",
                    taskContent: "Fix login bug on backend - handle authentication flow",
                    duration: 180, // 3 hours = 180 minutes
                    tags: ["backend", "bugfix", "authentication"],
                },
                workspaces: [
                    { id: "work", name: "Work", color: "#3b82f6" },
                    { id: "pah", name: "PAH Project", color: "#f97316" },
                    { id: "personal", name: "Personal", color: "#10b981" },
                ],
                suggestedTags: ["backend", "bugfix", "authentication"],
                state: "editing",
            }],
        },
    ],

    // Log Draft Card - Saving state
    "log-draft-saving": [
        {
            id: "log-draft-saving-1",
            role: "assistant",
            parts: [{
                type: "log-draft-card",
                originalMessage: "1h project planning meeting",
                defaultValues: {
                    workspaceId: "work",
                    taskContent: "Weekly project planning meeting",
                    duration: 60,
                    tags: ["meeting", "planning"],
                    mood: 4,
                },
                state: "saving",
            }],
        },
    ],

    // Log Draft Card - Saved state
    "log-draft-saved": [
        {
            id: "log-draft-saved-1",
            role: "assistant",
            parts: [{
                type: "log-draft-card",
                originalMessage: "Code review 2 hours",
                defaultValues: {
                    workspaceId: "pah",
                    taskContent: "Code review for feature branch",
                    duration: 120,
                    tags: ["code-review", "backend"],
                    mood: 5,
                },
                workspaces: [
                    { id: "work", name: "Work", color: "#3b82f6" },
                    { id: "pah", name: "PAH Project", color: "#f97316" },
                ],
                state: "saved",
            }],
        },
    ],
};

// Component button configs for UI
export const componentButtons = [
    { id: "text", label: "Text", icon: "💬" },
    { id: "reasoning", label: "Reasoning", icon: "🧠" },
    { id: "chain-of-thought", label: "Chain of Thought", icon: "🔗" },
    { id: "tool", label: "Tool", icon: "🔧" },
    { id: "code-block", label: "Code", icon: "💻" },
    { id: "artifact", label: "Artifact", icon: "📄" },
    { id: "sources", label: "Sources", icon: "📚" },
    { id: "suggestions", label: "Suggestions", icon: "💡" },
    { id: "loader", label: "Loader", icon: "⏳" },
    { id: "confirmation", label: "Confirmation", icon: "✅" },
    { id: "timesheet-form", label: "Timesheet", icon: "⏱️" },
    { id: "log-draft-card", label: "Log Draft", icon: "📝" },
    { id: "daily-summary", label: "Summary", icon: "📊" },
    { id: "resource-preview", label: "Resource", icon: "🔗" },
    { id: "news-digest", label: "Digest", icon: "📰" },
    { id: "learning-plan", label: "Plan", icon: "🎓" },
    { id: "quiz", label: "Quiz", icon: "❓" },
    { id: "full-demo", label: "Full Demo", icon: "🎬" },
];

export const learningPlanDemo: MockUIMessage[] = [
    {
        id: "learn-user-1",
        role: "user",
        parts: [{ type: "text", role: "user", content: "Learning plan for today" }],
    },
    {
        id: "learn-assistant-1",
        role: "assistant",
        parts: [
            {
                type: "learning-plan",
                sessions: [
                    {
                        id: "s1",
                        title: "Advanced Vector Search with LanceDB",
                        reason: "You saved this 3 days ago to research for the PAH project.",
                        estimatedTime: "15 mins",
                        sourceDomain: "medium.com"
                    },
                    {
                        id: "s2",
                        title: "Understanding Sparse Autoencoders",
                        reason: "Hot news from OpenAI this morning you just bookmarked.",
                        estimatedTime: "10 mins",
                        sourceDomain: "openai.com"
                    },
                    {
                        id: "s3",
                        title: "Tailwind CSS Performance Optimization",
                        reason: "You noted this last week when doing UI.",
                        estimatedTime: "8 mins",
                        sourceDomain: "tailwindcss.com"
                    }
                ]
            }
        ],
    },
];

export const quizDemo: MockUIMessage[] = [
    {
        id: "quiz-user-1",
        role: "user",
        parts: [{ type: "text", role: "user", content: "Start the quiz on Sparse Autoencoders" }],
    },
    {
        id: "quiz-assistant-1",
        role: "assistant",
        parts: [
            {
                type: "quiz",
                questions: [
                    {
                        id: "q1",
                        type: "multiple-choice",
                        question: "What is the main purpose of Sparse Autoencoders (SAEs) in OpenAI's research?",
                        options: [
                            { id: "a", text: "Increase model training speed" },
                            { id: "b", text: "Reduce checkpoint file size" },
                            { id: "c", text: "Decode the meaning of neurons in LLMs (Interpretability)" },
                            { id: "d", text: "Replace Transformer architecture" }
                        ],
                        correctAnswer: "c",
                        explanation: "Sparse Autoencoders help map densely active neurons in LLMs to thousands of sparser 'features', each typically representing a human-understandable concept.",
                        sourceHighlight: "Our researchers have successfully used sparse autoencoders to decompose the internal representations of large language models into readable features."
                    },
                    {
                        id: "q2",
                        type: "free-text",
                        question: "Why is model sparsity important for interpretability?",
                        explanation: "Sparsity ensures that at any given time, only a small number of features are activated. This avoids 'polysemanticity' - where one neuron performs multiple different tasks, making it extremely difficult to understand its meaning.",
                        sourceHighlight: "By enforcing sparsity, we ensure that each feature is only active for a specific context, reducing overlap and ambiguity."
                    }
                ]
            }
        ],
    },
];

// Add to mockComponentDemos
mockComponentDemos["learning-plan"] = learningPlanDemo;
mockComponentDemos["quiz"] = quizDemo;

export const newsDigestDemo: MockUIMessage[] = [
    {
        id: "news-user-1",
        role: "user",
        parts: [{ type: "text", role: "user", content: "Update me on this morning's news" }],
    },
    {
        id: "news-assistant-1",
        role: "assistant",
        parts: [
            {
                type: "text",
                role: "assistant",
                content: "Good morning! Here are the highlighted news items selected just for you based on your interests in AI research and software development:"
            },
            {
                type: "news-digest",
                items: [
                    {
                        id: "news-1",
                        title: "OpenAI Announces New Sparse Autoencoders for Model Interpretability",
                        summary: "New research helps deepen understanding of how neurons in LLMs work, opening up possibilities for better model control.",
                        url: "https://openai.com/news/sparse-autoencoders",
                        relevanceScore: 98,
                        source: "OpenAI Blog"
                    },
                    {
                        id: "news-2",
                        title: "Meta Releases Llama 3.1: The First Frontier-Level Open Source Model",
                        summary: "The release of Llama 3.1 405B marks a major turning point for the open source community with performance comparable to GPT-4o.",
                        url: "https://ai.meta.com/blog/llama-3-1-open-source/",
                        relevanceScore: 95,
                        source: "Meta AI"
                    },
                    {
                        id: "news-3",
                        title: "Mistral NeMo: A New 12B Model Developed with NVIDIA",
                        summary: "A small but powerful model, optimized for consumer GPU video memory, suitable for self-hosting.",
                        url: "https://mistral.ai/news/mistral-nemo/",
                        relevanceScore: 89,
                        source: "Mistral AI"
                    }
                ]
            }
        ],
    },
];

// Add to mockComponentDemos
mockComponentDemos["news-digest"] = newsDigestDemo;

export const resourcePreviewDemo: MockUIMessage[] = [
    {
        id: "res-user-1",
        role: "user",
        parts: [{ type: "text", role: "user", content: "https://medium.com/p/65487654" }],
    },
    {
        id: "res-assistant-1",
        role: "assistant",
        parts: [
            {
                type: "text",
                role: "assistant",
                content: "I see you just sent a link. Here is my preview and analysis:"
            },
            {
                type: "resource-preview",
                data: {
                    url: "https://medium.com/p/65487654",
                    title: "Advanced Vector Search with LanceDB and Python",
                    domain: "medium.com",
                    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000",
                    aiSummary: "This article guides how to use LanceDB to perform advanced vector search, including performance optimization and integration with popular deep learning frameworks.",
                    userIntent: "Researching LanceDB to apply for vector search in the PAH project.",
                    tags: ["LanceDB", "Vector Search", "Python", "Database"]
                },
                state: "editing"
            }
        ],
    },
];

// Add to mockComponentDemos
mockComponentDemos["resource-preview"] = resourcePreviewDemo;

export const dailySummaryDemo: MockUIMessage[] = [
    {
        id: "summary-user-1",
        role: "user",
        parts: [{ type: "text", role: "user", content: "What did I do today?" }],
    },
    {
        id: "summary-assistant-1",
        role: "assistant",
        parts: [
            {
                type: "text",
                role: "assistant",
                content: "Here is a summary of the work you did today:"
            },
            {
                type: "daily-summary",
                date: "Wednesday, December 24, 2025",
                tasks: [
                    {
                        id: "t1",
                        title: "Fix login bug on backend - handle authentication flow",
                        projectName: "PAH Project",
                        projectColor: "#f97316",
                        startTime: "09:00",
                        endTime: "12:00",
                        duration: 180,
                    },
                    {
                        id: "t2",
                        title: "Weekly project planning meeting",
                        projectName: "Work",
                        projectColor: "#3b82f6",
                        startTime: "13:30",
                        endTime: "14:30",
                        duration: 60,
                    },
                    {
                        id: "t3",
                        title: "Code review for feature branch",
                        projectName: "PAH Project",
                        projectColor: "#f97316",
                        startTime: "15:00",
                        endTime: "17:00",
                        duration: 120,
                    },
                ]
            }
        ],
    },
];

// Add to mockComponentDemos
mockComponentDemos["daily-summary"] = dailySummaryDemo;
