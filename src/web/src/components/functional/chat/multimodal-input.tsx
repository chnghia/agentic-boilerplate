"use client";

import type { CreateUIMessage, UIMessage, UseChatHelpers, UseChatOptions } from "@ai-sdk/react";

type ChatRequestOptions = {
    headers?: Record<string, string> | Headers;
    body?: object;
    data?: any;
};
import { motion } from "framer-motion";
import type React from "react";
import {
    useRef,
    useEffect,
    useCallback,
    useState,
    type Dispatch,
    type SetStateAction,
} from "react";
import { toast } from "sonner";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useWindowSize } from "@/hooks/use-window-size";

import { cn, sanitizeUIMessages } from "@/lib/utils";

import { ArrowUpIcon, StopIcon, PlusIcon, MicIcon, PaperclipIcon, ImageIcon, NoteIcon, NewspaperIcon, BookIcon, BookmarkIcon } from "./icons";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Context options for Personal Agentic Hub
const CONTEXT_OPTIONS = [
    { value: "daily-log", label: "Daily Log", Icon: NoteIcon },
    { value: "daily-news", label: "Daily News", Icon: NewspaperIcon },
    { value: "daily-learning", label: "Daily Learning", Icon: BookIcon },
    { value: "bookmarker", label: "Bookmarker", Icon: BookmarkIcon },
];

// Model options
const MODEL_OPTIONS = [
    { value: "gpt-4", label: "GPT-4" },
    { value: "gpt-3.5", label: "GPT-3.5" },
    { value: "claude", label: "Claude" },
    { value: "gemini", label: "Gemini" },
];

const suggestedActions = [
    {
        title: "What is the weather",
        label: "in San Francisco?",
        action: "What is the weather in San Francisco?",
    },
    {
        title: "How is python useful",
        label: "for AI engineers?",
        action: "How is python useful for AI engineers?",
    },
];

export function MultimodalInput({
    chatId,
    input,
    setInput,
    isLoading,
    stop,
    messages,
    setMessages,
    sendMessage,
    handleSubmit,
    className,
    selectedContext = "daily-log",
    onContextChange,
    selectedModel = "gpt-4",
    onModelChange,
}: {
    chatId: string;
    input: string;
    setInput: (value: string) => void;
    isLoading: boolean;
    stop: () => void;
    messages: Array<UIMessage>;
    setMessages: Dispatch<SetStateAction<Array<UIMessage>>>;
    sendMessage: UseChatHelpers<UIMessage>['sendMessage']
    handleSubmit: (
        event?: {
            preventDefault?: () => void;
        },
        chatRequestOptions?: ChatRequestOptions
    ) => void;
    className?: string;
    selectedContext?: string;
    onContextChange?: (context: string) => void;
    selectedModel?: string;
    onModelChange?: (model: string) => void;
}) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { width } = useWindowSize();
    const [context, setContext] = useState(selectedContext);
    const [model, setModel] = useState(selectedModel);

    useEffect(() => {
        if (textareaRef.current) {
            adjustHeight();
        }
    }, []);

    const adjustHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 7
                }px`;
        }
    };

    const [localStorageInput, setLocalStorageInput] = useLocalStorage(
        "input",
        ""
    );

    useEffect(() => {
        if (textareaRef.current) {
            const domValue = textareaRef.current.value;
            // Prefer DOM value over localStorage to handle hydration
            const finalValue = domValue || localStorageInput || "";
            setInput(finalValue);
            adjustHeight();
        }
        // Only run once after hydration
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setLocalStorageInput(input);
    }, [input, setLocalStorageInput]);

    const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(event.target.value);
        adjustHeight();
    };

    const submitForm = useCallback(() => {
        handleSubmit(undefined, {});
        setLocalStorageInput("");

        if (width && width > 768) {
            textareaRef.current?.focus();
        }
    }, [handleSubmit, setLocalStorageInput, width]);

    const handleContextChange = (value: string) => {
        setContext(value);
        onContextChange?.(value);
    };

    const handleModelChange = (value: string) => {
        setModel(value);
        onModelChange?.(value);
    };

    const handleMention = () => {
        toast.info("Mention feature coming soon!");
    };

    const handleAddImage = () => {
        toast.info("Image upload coming soon!");
    };

    const handleAddFile = () => {
        toast.info("File upload coming soon!");
    };

    const handleMicClick = () => {
        toast.info("Voice input coming soon!");
    };

    return (
        <div className="relative w-full flex flex-col gap-2">
            {messages.length === 0 && (
                <div className="grid sm:grid-cols-2 gap-2 w-full">
                    {suggestedActions.map((suggestedAction, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ delay: 0.05 * index }}
                            key={`suggested-action-${suggestedAction.title}-${index}`}
                            className={index > 1 ? "hidden sm:block" : "block"}
                        >
                            <Button
                                variant="ghost"
                                onClick={async () => {
                                    sendMessage({
                                        role: "user",
                                        parts: [
                                            {
                                                type: "text",
                                                text: suggestedAction.action,
                                            },
                                        ],
                                    });
                                }}
                                className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start"
                            >
                                <span className="font-medium">{suggestedAction.title}</span>
                                <span className="text-muted-foreground">
                                    {suggestedAction.label}
                                </span>
                            </Button>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Main input container with border */}
            <div className={cn(
                "flex flex-col rounded-xl border bg-muted overflow-hidden",
                className
            )}>
                {/* Textarea on top */}
                <Textarea
                    ref={textareaRef}
                    placeholder="Send a message..."
                    value={input || ""}
                    onChange={handleInput}
                    className="min-h-[60px] max-h-[calc(50dvh)] overflow-hidden resize-none text-sm bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    rows={2}
                    autoFocus
                    onKeyDown={(event) => {
                        if (event.key === "Enter" && !event.shiftKey) {
                            event.preventDefault();

                            if (isLoading) {
                                toast.error("Please wait for the model to finish its response!");
                            } else {
                                submitForm();
                            }
                        }
                    }}
                />

                {/* Toolbar below */}
                <div className="flex items-center gap-1 px-2 py-1.5 border-t border-border/50">
                    {/* Plus dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                <PlusIcon size={14} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-40">
                            <DropdownMenuItem onClick={handleMention} className="text-xs py-1.5">
                                <span className="mr-1.5 text-xs">@</span>
                                Mention
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleAddImage} className="text-xs py-1.5">
                                <ImageIcon size={12} />
                                <span className="ml-1.5">Add Image</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleAddFile} className="text-xs py-1.5">
                                <PaperclipIcon size={12} />
                                <span className="ml-1.5">Add File</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Context dropdown */}
                    <Select value={context} onValueChange={handleContextChange}>
                        <SelectTrigger className="h-7 w-auto min-w-[110px] text-xs border-0 bg-transparent px-2">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {CONTEXT_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value} className="text-xs">
                                    <span className="flex items-center gap-1.5">
                                        <option.Icon size={12} />
                                        {option.label}
                                    </span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Model dropdown */}
                    <Select value={model} onValueChange={handleModelChange}>
                        <SelectTrigger className="h-7 w-auto min-w-[80px] text-xs border-0 bg-transparent px-2">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {MODEL_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value} className="text-xs">
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Mic button */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted-foreground"
                        onClick={handleMicClick}
                        disabled
                    >
                        <MicIcon size={16} />
                    </Button>

                    {/* Submit/Stop button */}
                    {isLoading ? (
                        <Button
                            size="sm"
                            className="h-8 w-8 p-0 rounded-lg"
                            onClick={(event) => {
                                event.preventDefault();
                                stop();
                                setMessages((messages) => sanitizeUIMessages(messages));
                            }}
                        >
                            <StopIcon size={14} />
                        </Button>
                    ) : (
                        <Button
                            size="sm"
                            className="h-8 w-8 p-0 rounded-lg"
                            onClick={(event) => {
                                event.preventDefault();
                                submitForm();
                            }}
                            disabled={!input || input.length === 0}
                        >
                            <ArrowUpIcon size={14} />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}