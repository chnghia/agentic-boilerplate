"use client";

import type { UIMessage } from "@ai-sdk/react";
import { motion } from "framer-motion";
import { Streamdown } from "streamdown";

import { SparklesIcon } from "./icons";
// import { PreviewAttachment } from "./preview-attachment";
import { cn } from "@/lib/utils";
import { Weather } from "./weather";

// PAH Elements for rendering backend pah-component events
import {
    TimesheetForm,
    LogDraftCard,
    DailySummaryView,
    ResourcePreviewCard,
    NewsDigestCard,
    LearningPlanDashboard,
    QuizInterface,
} from "@/components/pah-elements";

// Helper function to render PAH components based on tool name
function renderPahComponent(toolName: string, data: any, key: string) {
    switch (toolName) {
        case "pah-log-draft-card":
            return (
                <LogDraftCard
                    key={key}
                    {...data}
                    onConfirm={(d: any) => console.log("Log confirmed:", d)}
                    onCancel={() => console.log("Log cancelled")}
                />
            );
        case "pah-timesheet-form":
            return (
                <TimesheetForm
                    key={key}
                    {...data}
                    onSubmit={(d: any) => console.log("Timesheet submitted:", d)}
                />
            );
        case "pah-daily-summary":
            return <DailySummaryView key={key} {...data} />;
        case "pah-news-digest":
            return (
                <NewsDigestCard
                    key={key}
                    items={data.items || []}
                    onBookmark={(item: any) => console.log("Bookmarked:", item)}
                    onDismiss={(item: any) => console.log("Dismissed:", item)}
                />
            );
        case "pah-resource-preview":
            return (
                <ResourcePreviewCard
                    key={key}
                    {...data}
                    onSave={async (d: any) => {
                        console.log("Resource saved:", d);
                        try {
                            const response = await fetch(`${import.meta.env.VITE_INTERNAL_API_URL}/api/v1/agent/callback`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    action: "save",
                                    component_type: "resource-preview",
                                    data: { url: d.url, title: d.title },
                                    delay_seconds: 5,
                                }),
                            });
                            const result = await response.json();
                            console.log("Callback response:", result);
                        } catch (err) {
                            console.error("Failed to send callback:", err);
                        }
                    }}
                    onReadLater={async (d: any) => {
                        console.log("Read later:", d);
                        try {
                            const response = await fetch(`${import.meta.env.VITE_INTERNAL_API_URL}/api/v1/agent/callback`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    action: "read_later",
                                    component_type: "resource-preview",
                                    data: { url: d.url, title: d.title },
                                    delay_seconds: 5,
                                }),
                            });
                            const result = await response.json();
                            console.log("Callback response:", result);
                        } catch (err) {
                            console.error("Failed to send callback:", err);
                        }
                    }}
                />
            );
        case "pah-learning-plan":
            return (
                <LearningPlanDashboard
                    key={key}
                    {...data}
                    onStartSession={(s: any) => console.log("Starting session:", s)}
                />
            );
        case "pah-quiz":
            return (
                <QuizInterface
                    key={key}
                    {...data}
                    onFinish={(r: any) => console.log("Quiz finished:", r)}
                />
            );
        default:
            // Show raw data for unknown PAH components
            return (
                <pre key={key} className="text-xs bg-muted p-2 rounded">
                    {JSON.stringify({ type: toolName, data }, null, 2)}
                </pre>
            );
    }
}

export const PreviewMessage = ({
    message,
}: {
    chatId: string;
    message: UIMessage;
    isLoading: boolean;
}) => {
    return (
        <motion.div
            className="w-full mx-auto max-w-3xl px-4 group/message"
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            data-role={message.role}
        >
            <div
                className={cn(
                    "group-data-[role=user]/message:bg-primary group-data-[role=user]/message:text-primary-foreground flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl"
                )}
            >
                {message.role === "assistant" && (
                    <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
                        <SparklesIcon size={14} />
                    </div>
                )}

                <div className="flex flex-col gap-2 w-full">
                    {message.parts &&
                        (() => {
                            // Deduplicate tool parts - keep only the most advanced state per toolCallId
                            // but preserve original order (first occurrence position)
                            const toolPartsByCallId = new Map<string, { part: any; index: number }>();
                            const stateOrder = ["input-streaming", "input-available", "output-available"];

                            // First pass: find the most advanced state for each toolCallId
                            // Cast to any[] to handle dynamic tool part properties
                            const parts = message.parts as any[];
                            for (let i = 0; i < parts.length; i++) {
                                const part = parts[i];
                                if (part.type?.startsWith("tool-")) {
                                    const existing = toolPartsByCallId.get(part.toolCallId);
                                    if (!existing) {
                                        toolPartsByCallId.set(part.toolCallId, { part, index: i });
                                    } else {
                                        // Keep the more advanced state but preserve first occurrence index
                                        const existingIndex = stateOrder.indexOf(existing.part.state || "");
                                        const newIndex = stateOrder.indexOf(part.state || "");
                                        if (newIndex > existingIndex) {
                                            toolPartsByCallId.set(part.toolCallId, { part, index: existing.index });
                                        }
                                    }
                                }
                            }

                            // Second pass: build final parts array preserving order
                            const seenToolCallIds = new Set<string>();
                            const finalParts: any[] = [];
                            for (const part of parts) {
                                if (part.type?.startsWith("tool-")) {
                                    if (!seenToolCallIds.has(part.toolCallId)) {
                                        seenToolCallIds.add(part.toolCallId);
                                        // Use the most advanced state for this toolCallId
                                        const best = toolPartsByCallId.get(part.toolCallId);
                                        if (best) {
                                            finalParts.push(best.part);
                                        }
                                    }
                                    // Skip duplicates
                                } else {
                                    finalParts.push(part);
                                }
                            }

                            return finalParts.map((part: any, index: number) => {
                                if (part.type === "text") {
                                    return (
                                        <div key={index} className="flex flex-col gap-4">
                                            <Streamdown>{part.text}</Streamdown>
                                        </div>
                                    );
                                }
                                // Handle tool calls - type is "tool-{toolName}" in AI SDK v5
                                if (part.type?.startsWith("tool-")) {
                                    const { toolCallId, state, output } = part;
                                    const toolName = part.type.replace("tool-", "");

                                    if (state === "output-available" && output) {
                                        // Check if this is a PAH component tool
                                        if (toolName.startsWith("pah-")) {
                                            return renderPahComponent(toolName, output, toolCallId);
                                        }
                                        // Regular tools
                                        return (
                                            <div key={toolCallId}>
                                                {toolName === "get_current_weather" ? (
                                                    <Weather weatherAtLocation={output} />
                                                ) : (
                                                    <pre>{JSON.stringify(output, null, 2)}</pre>
                                                )}
                                            </div>
                                        );
                                    }
                                    // Show loading state while tool is executing
                                    if (
                                        state === "input-streaming" ||
                                        state === "input-available"
                                    ) {
                                        // PAH components - show loading placeholder
                                        if (toolName.startsWith("pah-")) {
                                            return (
                                                <div key={toolCallId} className="animate-pulse bg-muted rounded-lg p-4">
                                                    <div className="h-4 bg-muted-foreground/20 rounded w-1/3 mb-2"></div>
                                                    <div className="h-3 bg-muted-foreground/20 rounded w-2/3"></div>
                                                </div>
                                            );
                                        }
                                        return (
                                            <div
                                                key={toolCallId}
                                                className={cn({
                                                    skeleton: ["get_current_weather"].includes(toolName),
                                                })}
                                            >
                                                {toolName === "get_current_weather" ? <Weather /> : null}
                                            </div>
                                        );
                                    }
                                }
                                if (part.type === "file") {
                                    return (
                                        // <PreviewAttachment
                                        //     key={index}
                                        //     attachment={part}
                                        // />
                                        <div key={index}>
                                            PreviewAttachment
                                        </div>
                                    );
                                }


                                return null;
                            });
                        })()}
                </div>
            </div>
        </motion.div>
    );
};

export const ThinkingMessage = () => {
    const role = "assistant";

    return (
        <motion.div
            className="w-full mx-auto max-w-3xl px-4 group/message "
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
            data-role={role}
        >
            <div
                className={cn(
                    "flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl",
                    {
                        "group-data-[role=user]/message:bg-muted": true,
                    }
                )}
            >
                <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
                    <SparklesIcon size={14} />
                </div>

                <div className="flex flex-col gap-2 w-full">
                    <div className="flex flex-col gap-4 text-muted-foreground">
                        Thinking...
                    </div>
                </div>
            </div>
        </motion.div>
    );
};