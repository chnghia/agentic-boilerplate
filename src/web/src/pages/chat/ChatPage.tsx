import { useChat, type UIMessage } from '@ai-sdk/react';
import { toast } from "sonner";
import { Overview } from '@/components/functional/chat/overview';
import React, { useEffect, useRef } from "react";
import { useScrollToBottom } from '@/hooks/use-scroll-to-bottom';
import { PreviewMessage, ThinkingMessage } from '@/components/functional/chat/message';
import { MultimodalInput } from '@/components/functional/chat/multimodal-input';
import { DefaultChatTransport } from 'ai';
import { useSSEEventsByType } from '@/stores/useSSEStore';

export default function Page() {
    const chatId = "001";

    const { messages, setMessages, sendMessage, status, stop } = useChat({
        id: chatId,
        transport: new DefaultChatTransport({
            api: `${import.meta.env.VITE_INTERNAL_API_URL}/api/v1/agent/chat`,
        }),
        onError: (error: Error) => {
            if (error.message.includes("Too many requests")) {
                toast.error("You are sending too many messages. Please try again later.");
            }
        },
    });

    const [messagesContainerRef, messagesEndRef] = useScrollToBottom<HTMLDivElement>();
    const [input, setInput] = React.useState("");
    const isLoading = status === "submitted" || status === "streaming";

    // Track processed SSE events to avoid duplicates
    const processedEventsRef = useRef<Set<string>>(new Set());

    // Subscribe to url_summary_complete SSE events
    const summaryEvents = useSSEEventsByType('url_summary_complete');

    useEffect(() => {
        // Process new SSE events and push to messages
        summaryEvents.forEach((event) => {
            const eventId = event.timestamp.toISOString();
            if (!processedEventsRef.current.has(eventId)) {
                processedEventsRef.current.add(eventId);

                // Create a new assistant message for the summary notification
                const summaryMessage: UIMessage = {
                    id: `sse-${eventId}`,
                    role: 'assistant',
                    parts: [
                        {
                            type: 'text',
                            text: `✅ **${event.data.message}**\n\n📄 **${event.data.resource?.title || 'Resource'}**\n\n${event.data.resource?.summary || ''}`,
                        },
                    ],
                };

                setMessages((prev) => [...prev, summaryMessage]);
                toast.success("Summary result received!");
                console.log('[ChatPage] Added SSE message to chat:', summaryMessage);
            }
        });
    }, [summaryEvents, setMessages]);

    const handleSubmit = (event?: { preventDefault?: () => void }) => {
        event?.preventDefault?.();
        if (input.trim()) {
            sendMessage({ text: input });
            setInput("");
        }
    };

    return (
        <div className="flex flex-col min-w-0 h-[calc(100dvh-52px)] bg-background">
            {/* Messages area */}
            <div ref={messagesContainerRef} className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4">
                {/* Show Overview when no messages */}
                {messages.length === 0 && (
                    <Overview onPromptSelect={(message) => sendMessage({ text: message })} />
                )}

                {/* Chat messages */}
                {messages.map((message: UIMessage, index: number) => (
                    <PreviewMessage
                        key={message.id}
                        chatId={chatId}
                        message={message}
                        isLoading={isLoading && messages.length - 1 === index}
                    />
                ))}

                {isLoading && messages.length > 0 && messages[messages.length - 1].role === "user" && (
                    <ThinkingMessage />
                )}

                <div ref={messagesEndRef} className="shrink-0 min-w-[24px] min-h-[24px]" />
            </div>

            {/* Input form */}
            <div className="mx-auto px-4 bg-background pb-4 md:pb-2 w-full md:max-w-3xl">
                <form className="flex gap-2 w-full">
                    <MultimodalInput
                        chatId={chatId}
                        input={input}
                        setInput={setInput}
                        handleSubmit={handleSubmit}
                        isLoading={isLoading}
                        stop={stop}
                        messages={messages}
                        setMessages={setMessages}
                        sendMessage={sendMessage}
                    />
                </form>
            </div>
        </div>
    )
}

