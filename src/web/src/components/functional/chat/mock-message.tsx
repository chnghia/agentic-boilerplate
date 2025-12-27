"use client";

import { motion } from "framer-motion";
import { Streamdown } from "streamdown";
import { cn } from "@/lib/utils";
import { SparklesIcon } from "./icons";
import type { BundledLanguage } from "shiki";
import {
    CopyIcon,
    ExternalLinkIcon,
    SearchIcon
} from "lucide-react";

// AI Elements imports
import {
    Reasoning,
    ReasoningTrigger,
    ReasoningContent,
} from "@/components/ai-elements/reasoning";
import {
    ChainOfThought,
    ChainOfThoughtHeader,
    ChainOfThoughtContent,
    ChainOfThoughtStep,
    ChainOfThoughtSearchResults,
    ChainOfThoughtSearchResult,
} from "@/components/ai-elements/chain-of-thought";
import {
    Tool,
    ToolHeader,
    ToolContent,
    ToolInput,
    ToolOutput,
} from "@/components/ai-elements/tool";
import { CodeBlock, CodeBlockCopyButton } from "@/components/ai-elements/code-block";
import {
    Artifact,
    ArtifactHeader,
    ArtifactTitle,
    ArtifactDescription,
    ArtifactContent,
    ArtifactActions,
    ArtifactAction,
    ArtifactClose,
} from "@/components/ai-elements/artifact";
import {
    Sources,
    SourcesTrigger,
    SourcesContent,
    Source,
} from "@/components/ai-elements/sources";
import { Suggestions, Suggestion } from "@/components/ai-elements/suggestion";
import { Loader } from "@/components/ai-elements/loader";
import {
    Confirmation,
    ConfirmationTitle,
    ConfirmationRequest,
    ConfirmationActions,
    ConfirmationAction,
} from "@/components/ai-elements/confirmation";
import {
    TimesheetForm, type TimesheetEntry,
    LogDraftCard, type LogDraftData, type Workspace,
    DailySummaryView, type TimelineTask,
    ResourcePreviewCard, type ResourcePreviewData,
    NewsDigestCard, type NewsItem,
    LearningPlanDashboard, type LearningSession,
    QuizInterface, type QuizQuestion
} from "@/components/pah-elements";

// ===== Mock Message Types =====

export interface MockTextPart {
    type: "text";
    role: "user" | "assistant";
    content: string;
}

export interface MockReasoningPart {
    type: "reasoning";
    content: string;
    isStreaming?: boolean;
    duration?: number;
}

export interface MockChainOfThoughtPart {
    type: "chain-of-thought";
    steps: {
        label: string;
        description?: string;
        status: "complete" | "active" | "pending";
        searchResults?: string[];
    }[];
}

export interface MockToolPart {
    type: "tool";
    toolName: string;
    input: Record<string, unknown>;
    output?: unknown;
    errorText?: string;
    state: "input-streaming" | "input-available" | "output-available" | "output-error";
}

export interface MockCodeBlockPart {
    type: "code-block";
    language: string;
    code: string;
    showLineNumbers?: boolean;
}

export interface MockArtifactPart {
    type: "artifact";
    title: string;
    description?: string;
    content: string;
}

export interface MockSourcesPart {
    type: "sources";
    sources: { title: string; href: string }[];
}

export interface MockSuggestionsPart {
    type: "suggestions";
    suggestions: string[];
    onSelect?: (suggestion: string) => void;
}

export interface MockLoaderPart {
    type: "loader";
    text?: string;
}

export interface MockConfirmationPart {
    type: "confirmation";
    toolName: string;
    state: "approval-requested" | "approval-responded" | "output-available" | "output-denied";
    approved?: boolean;
    reason?: string;
}

export interface MockTimesheetFormPart {
    type: "timesheet-form";
    defaultValues?: Partial<TimesheetEntry>;
    state?: "input" | "submitted" | "confirmed";
    onSubmit?: (data: TimesheetEntry) => void;
}

export interface MockLogDraftCardPart {
    type: "log-draft-card";
    defaultValues?: Partial<LogDraftData>;
    workspaces?: Workspace[];
    suggestedTags?: string[];
    state?: "editing" | "saving" | "saved" | "cancelled";
    originalMessage?: string;
    onConfirm?: (data: LogDraftData) => void;
    onCancel?: () => void;
}

export interface MockDailySummaryPart {
    type: "daily-summary";
    date?: string;
    tasks: TimelineTask[];
}

export interface MockResourcePreviewPart {
    type: "resource-preview";
    data: ResourcePreviewData;
    state?: "editing" | "saving" | "saved";
    onSave?: (data: ResourcePreviewData) => void;
    onReadLater?: (data: ResourcePreviewData) => void;
}

export interface MockNewsDigestPart {
    type: "news-digest";
    items: NewsItem[];
}

export interface MockLearningPlanPart {
    type: "learning-plan";
    userName?: string;
    sessions: LearningSession[];
    onStartSession?: (session: LearningSession) => void;
}

export interface MockQuizPart {
    type: "quiz";
    questions: QuizQuestion[];
    onFinish?: (results: any) => void;
}

export type MockMessagePart =
    | MockTextPart
    | MockReasoningPart
    | MockChainOfThoughtPart
    | MockToolPart
    | MockCodeBlockPart
    | MockArtifactPart
    | MockSourcesPart
    | MockSuggestionsPart
    | MockLoaderPart
    | MockConfirmationPart
    | MockTimesheetFormPart
    | MockLogDraftCardPart
    | MockDailySummaryPart
    | MockResourcePreviewPart
    | MockNewsDigestPart
    | MockLearningPlanPart
    | MockQuizPart;

export interface MockUIMessage {
    id: string;
    role: "user" | "assistant";
    parts: MockMessagePart[];
}

// ===== Icon Wrapper Component =====
const AssistantIcon = () => (
    <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
        <SparklesIcon size={14} />
    </div>
);

// ===== Mock Preview Message Component =====
// Similar structure to PreviewMessage but handles mock message types

export const MockPreviewMessage = ({
    message,
}: {
    chatId: string;
    message: MockUIMessage;
    isLoading?: boolean;
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
                {message.role === "assistant" && <AssistantIcon />}

                <div className="flex flex-col gap-2 w-full">
                    {message.parts.map((part, index) => (
                        <MockPartRenderer key={index} part={part} />
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

// ===== Part Renderer =====
function MockPartRenderer({ part }: { part: MockMessagePart }) {
    switch (part.type) {
        case "text":
            return (
                <div className="flex flex-col gap-4">
                    <Streamdown>{part.content}</Streamdown>
                </div>
            );

        case "reasoning":
            return (
                <Reasoning isStreaming={part.isStreaming} duration={part.duration}>
                    <ReasoningTrigger />
                    <ReasoningContent>{part.content}</ReasoningContent>
                </Reasoning>
            );

        case "chain-of-thought":
            return (
                <ChainOfThought defaultOpen>
                    <ChainOfThoughtHeader>Reasoning Steps</ChainOfThoughtHeader>
                    <ChainOfThoughtContent>
                        {part.steps.map((step, idx) => (
                            <ChainOfThoughtStep
                                key={idx}
                                label={step.label}
                                description={step.description}
                                status={step.status}
                                icon={step.searchResults ? SearchIcon : undefined}
                            >
                                {step.searchResults && (
                                    <ChainOfThoughtSearchResults>
                                        {step.searchResults.map((r, i) => (
                                            <ChainOfThoughtSearchResult key={i}>{r}</ChainOfThoughtSearchResult>
                                        ))}
                                    </ChainOfThoughtSearchResults>
                                )}
                            </ChainOfThoughtStep>
                        ))}
                    </ChainOfThoughtContent>
                </ChainOfThought>
            );

        case "tool":
            return (
                <Tool>
                    <ToolHeader
                        title={part.toolName}
                        type={`tool-${part.toolName}` as any}
                        state={part.state}
                    />
                    <ToolContent>
                        <ToolInput input={part.input} />
                        <ToolOutput output={part.output} errorText={part.errorText} />
                    </ToolContent>
                </Tool>
            );

        case "code-block":
            return (
                <CodeBlock
                    code={part.code}
                    language={part.language as BundledLanguage}
                    showLineNumbers={part.showLineNumbers}
                >
                    <CodeBlockCopyButton />
                </CodeBlock>
            );

        case "artifact":
            return (
                <Artifact>
                    <ArtifactHeader>
                        <div>
                            <ArtifactTitle>{part.title}</ArtifactTitle>
                            {part.description && <ArtifactDescription>{part.description}</ArtifactDescription>}
                        </div>
                        <ArtifactActions>
                            <ArtifactAction tooltip="Copy" icon={CopyIcon} />
                            <ArtifactAction tooltip="Open" icon={ExternalLinkIcon} />
                            <ArtifactClose />
                        </ArtifactActions>
                    </ArtifactHeader>
                    <ArtifactContent>
                        <pre className="text-sm font-mono whitespace-pre-wrap">{part.content}</pre>
                    </ArtifactContent>
                </Artifact>
            );

        case "sources":
            return (
                <Sources>
                    <SourcesTrigger count={part.sources.length} />
                    <SourcesContent>
                        {part.sources.map((s, i) => (
                            <Source key={i} href={s.href} title={s.title} />
                        ))}
                    </SourcesContent>
                </Sources>
            );

        case "suggestions":
            return (
                <Suggestions>
                    {part.suggestions.map((s, i) => (
                        <Suggestion
                            key={i}
                            suggestion={s}
                            onClick={(v) => part.onSelect?.(v) || console.log("Clicked:", v)}
                        />
                    ))}
                </Suggestions>
            );

        case "loader":
            return (
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader size={16} />
                    <span className="text-sm">{part.text || "Loading..."}</span>
                </div>
            );

        case "confirmation":
            return (
                <Confirmation
                    state={part.state as any}
                    approval={
                        part.approved !== undefined
                            ? { id: "confirm", approved: part.approved, reason: part.reason }
                            : { id: "confirm" }
                    }
                >
                    <ConfirmationTitle>
                        Do you want to allow <strong>{part.toolName}</strong> to execute?
                    </ConfirmationTitle>
                    <ConfirmationRequest>
                        <ConfirmationActions>
                            <ConfirmationAction variant="outline">Deny</ConfirmationAction>
                            <ConfirmationAction>Allow</ConfirmationAction>
                        </ConfirmationActions>
                    </ConfirmationRequest>
                </Confirmation>
            );

        case "timesheet-form":
            return (
                <TimesheetForm
                    defaultValues={part.defaultValues}
                    state={part.state}
                    onSubmit={(data) => {
                        part.onSubmit?.(data);
                        console.log("Timesheet submitted:", data);
                    }}
                />
            );

        case "log-draft-card":
            return (
                <LogDraftCard
                    defaultValues={part.defaultValues}
                    workspaces={part.workspaces}
                    suggestedTags={part.suggestedTags}
                    state={part.state}
                    originalMessage={part.originalMessage}
                    onConfirm={(data) => {
                        part.onConfirm?.(data);
                        console.log("Log draft confirmed:", data);
                    }}
                    onCancel={() => {
                        part.onCancel?.();
                        console.log("Log draft cancelled");
                    }}
                />
            );

        case "daily-summary":
            return (
                <DailySummaryView
                    date={part.date}
                    tasks={part.tasks}
                />
            );

        case "resource-preview":
            return (
                <ResourcePreviewCard
                    data={part.data}
                    state={part.state}
                    onSave={(data) => {
                        part.onSave?.(data);
                        console.log("Resource saved:", data);
                    }}
                    onReadLater={(data) => {
                        part.onReadLater?.(data);
                        console.log("Resource read later:", data);
                    }}
                />
            );

        case "news-digest":
            return (
                <NewsDigestCard
                    items={part.items}
                    onBookmark={(item) => console.log("Bookmarked:", item)}
                    onDismiss={(item) => console.log("Dismissed:", item)}
                />
            );

        case "learning-plan":
            return (
                <LearningPlanDashboard
                    userName={part.userName}
                    sessions={part.sessions}
                    onStartSession={(session) => {
                        part.onStartSession?.(session);
                        console.log("Starting session:", session);
                    }}
                />
            );

        case "quiz":
            return (
                <QuizInterface
                    questions={part.questions}
                    onFinish={(results) => {
                        part.onFinish?.(results);
                        console.log("Quiz finished:", results);
                    }}
                />
            );

        default:
            return null;
    }
}
