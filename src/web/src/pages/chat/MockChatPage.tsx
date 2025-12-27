import { useState, useCallback } from 'react'
import { useScrollToBottom } from '@/hooks/use-scroll-to-bottom';
import { MockPreviewMessage, type MockUIMessage } from '@/components/functional/chat/mock-message';
import { Button } from '@/components/ui/button';
import { XIcon } from 'lucide-react';
import { mockComponentDemos, componentButtons } from './mock-data';

/**
 * MockChatPage - A dedicated page for mocking and testing new PAH components
 * 
 * Use this page to:
 * - Test new custom components before integrating them into the main chat
 * - Preview component rendering with mock data
 * - Develop and iterate on component designs
 * 
 * Access this page at: /chat/mock (requires router setup)
 */
export default function MockChatPage() {
    const chatId = "mock-001";

    // Mock messages state for showcase
    const [mockMessages, setMockMessages] = useState<MockUIMessage[]>([]);
    const [messagesContainerRef, messagesEndRef] = useScrollToBottom<HTMLDivElement>();

    // Add mock messages to the showcase
    const handleComponentDemo = useCallback((componentId: string) => {
        const demoMessages = mockComponentDemos[componentId];
        if (demoMessages) {
            setMockMessages(prev => [...prev, ...demoMessages]);
        }
    }, []);

    // Clear mock messages
    const clearMockMessages = useCallback(() => {
        setMockMessages([]);
    }, []);

    const hasMockMessages = mockMessages.length > 0;

    return (
        <div className="flex flex-col min-w-0 h-[calc(100dvh-52px)] bg-background">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b">
                <h1 className="text-lg font-semibold">Component Mock Showcase</h1>
                {hasMockMessages && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={clearMockMessages}
                    >
                        <XIcon size={16} />
                        <span>Clear All</span>
                    </Button>
                )}
            </div>

            {/* Messages area */}
            <div ref={messagesContainerRef} className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4">
                {/* Show Overview when no messages */}
                {mockMessages.length === 0 && (
                    <div className="flex flex-col items-center justify-center flex-1 gap-4 text-center px-4">
                        <h2 className="text-xl font-medium text-muted-foreground">
                            No components displayed
                        </h2>
                        <p className="text-sm text-muted-foreground max-w-md">
                            Click on one of the component buttons below to preview mock data and rendering.
                        </p>
                    </div>
                )}

                {/* Mock showcase messages */}
                {mockMessages.map((message) => (
                    <MockPreviewMessage
                        key={message.id}
                        chatId={chatId}
                        message={message}
                    />
                ))}

                <div ref={messagesEndRef} className="shrink-0 min-w-[24px] min-h-[24px]" />
            </div>

            {/* Component demo buttons */}
            <div className="mx-auto px-4 bg-background pb-4 md:pb-2 w-full md:max-w-3xl">
                <div className="flex flex-wrap gap-2 pt-3 justify-center">
                    {componentButtons.map((btn) => (
                        <Button
                            key={btn.id}
                            variant="outline"
                            size="sm"
                            className="text-xs gap-1.5"
                            onClick={() => handleComponentDemo(btn.id)}
                        >
                            <span>{btn.icon}</span>
                            <span>{btn.label}</span>
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    )
}
