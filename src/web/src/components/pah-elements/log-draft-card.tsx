"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    FileTextIcon,
    CheckCircle2Icon,
    XIcon,
    PlusIcon,
    CalendarIcon,
    ClockIcon,
    TagIcon,
    SmileIcon,
} from "lucide-react";

// Types
export interface Workspace {
    id: string;
    name: string;
    color?: string;
}

export interface LogDraftData {
    workspaceId: string;
    taskContent: string;
    date: string;
    duration: number; // in minutes
    tags: string[];
    mood?: number; // 1-5 scale
}

export interface LogDraftCardProps {
    // Pre-filled data from AI parsing
    defaultValues?: Partial<LogDraftData>;
    // Available workspaces from database
    workspaces?: Workspace[];
    // Suggested tags from AI
    suggestedTags?: string[];
    // State of the card
    state?: "editing" | "saving" | "saved" | "cancelled";
    // Callbacks
    onConfirm?: (data: LogDraftData) => void;
    onCancel?: () => void;
    // Original user message for context
    originalMessage?: string;
    className?: string;
}

const MOOD_EMOJIS = [
    { value: 1, emoji: "😫", label: "Exhausted" },
    { value: 2, emoji: "😔", label: "Tired" },
    { value: 3, emoji: "😐", label: "Neutral" },
    { value: 4, emoji: "🙂", label: "Good" },
    { value: 5, emoji: "🚀", label: "Energized" },
];

const DEFAULT_WORKSPACES: Workspace[] = [
    { id: "work", name: "Work", color: "#3b82f6" },
    { id: "personal", name: "Personal", color: "#10b981" },
    { id: "study", name: "Study", color: "#8b5cf6" },
];

export function LogDraftCard({
    defaultValues,
    workspaces = DEFAULT_WORKSPACES,
    suggestedTags = [],
    state = "editing",
    onConfirm,
    onCancel,
    originalMessage,
    className,
}: LogDraftCardProps) {
    // Form state
    const [workspaceId, setWorkspaceId] = useState(defaultValues?.workspaceId || workspaces[0]?.id || "");
    const [taskContent, setTaskContent] = useState(defaultValues?.taskContent || "");
    const [date, setDate] = useState(defaultValues?.date || new Date().toISOString().split("T")[0]);
    const [duration, setDuration] = useState(defaultValues?.duration || 60);
    const [tags, setTags] = useState<string[]>(defaultValues?.tags || suggestedTags);
    const [mood, setMood] = useState<number | undefined>(defaultValues?.mood);
    const [tagInput, setTagInput] = useState("");

    const isDisabled = state !== "editing";

    const handleAddTag = () => {
        const newTag = tagInput.trim().replace(/^#/, "");
        if (newTag && !tags.includes(newTag)) {
            setTags([...tags, newTag]);
        }
        setTagInput("");
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter((t) => t !== tagToRemove));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddTag();
        }
    };

    const handleConfirm = () => {
        onConfirm?.({
            workspaceId,
            taskContent,
            date,
            duration,
            tags,
            mood,
        });
    };

    const formatDuration = (mins: number) => {
        const hours = Math.floor(mins / 60);
        const minutes = mins % 60;
        if (hours === 0) return `${minutes}m`;
        if (minutes === 0) return `${hours}h`;
        return `${hours}h ${minutes}m`;
    };

    return (
        <div
            className={cn(
                "border rounded-xl overflow-hidden bg-gradient-to-br from-card to-muted/20",
                "shadow-lg hover:shadow-xl transition-all duration-300",
                state === "saved" && "border-green-500/50 bg-green-500/5",
                state === "cancelled" && "opacity-60",
                className
            )}
        >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b bg-muted/30">
                <div className="p-2 rounded-lg bg-primary/10">
                    <FileTextIcon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-foreground">Log Entry Draft</h3>
                    <p className="text-xs text-muted-foreground">Review and confirm your activity log</p>
                </div>
                {state === "saved" && (
                    <Badge variant="default" className="bg-green-500 text-white">
                        <CheckCircle2Icon className="w-3 h-3 mr-1" />
                        Saved
                    </Badge>
                )}
            </div>

            {/* Original message context */}
            {originalMessage && (
                <div className="px-4 py-2 bg-muted/20 border-b text-sm">
                    <span className="text-muted-foreground">You said: </span>
                    <span className="italic">"{originalMessage}"</span>
                </div>
            )}

            {/* Form content */}
            <div className="p-4 space-y-4">
                {/* Row 1: Workspace and Date/Duration */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Workspace Picker */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-primary" />
                            Project / Context
                        </Label>
                        <Select
                            value={workspaceId}
                            onValueChange={setWorkspaceId}
                            disabled={isDisabled}
                        >
                            <SelectTrigger className="bg-background/50">
                                <SelectValue placeholder="Select workspace" />
                            </SelectTrigger>
                            <SelectContent>
                                {workspaces.map((ws) => (
                                    <SelectItem key={ws.id} value={ws.id}>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="w-2 h-2 rounded-full"
                                                style={{ backgroundColor: ws.color || "#888" }}
                                            />
                                            {ws.name}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Date & Duration */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium flex items-center gap-1.5">
                            <CalendarIcon className="w-3.5 h-3.5" />
                            Date & Duration
                        </Label>
                        <div className="flex gap-2">
                            <Input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                disabled={isDisabled}
                                className="bg-background/50 flex-1"
                            />
                            <div className="relative">
                                <Input
                                    type="number"
                                    value={duration}
                                    onChange={(e) => setDuration(Number(e.target.value))}
                                    disabled={isDisabled}
                                    className="bg-background/50 w-20 pr-6"
                                    min={1}
                                    max={1440}
                                />
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                                    min
                                </span>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <ClockIcon className="w-3 h-3" />
                            {formatDuration(duration)}
                        </p>
                    </div>
                </div>

                {/* Task Content */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium">Task Description</Label>
                    <Textarea
                        value={taskContent}
                        onChange={(e) => setTaskContent(e.target.value)}
                        placeholder="What did you work on?"
                        disabled={isDisabled}
                        className="bg-background/50 min-h-[80px] resize-none"
                    />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-1.5">
                        <TagIcon className="w-3.5 h-3.5" />
                        Tags
                    </Label>
                    <div className="flex flex-wrap gap-2 min-h-[32px]">
                        {tags.map((tag) => (
                            <Badge
                                key={tag}
                                variant="secondary"
                                className="gap-1 pl-2 pr-1 py-1"
                            >
                                #{tag}
                                {!isDisabled && (
                                    <button
                                        onClick={() => handleRemoveTag(tag)}
                                        className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                                    >
                                        <XIcon className="w-3 h-3" />
                                    </button>
                                )}
                            </Badge>
                        ))}
                        {!isDisabled && (
                            <div className="flex items-center gap-1">
                                <Input
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Add tag..."
                                    className="h-7 w-24 text-sm bg-background/50"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleAddTag}
                                    className="h-7 w-7 p-0"
                                >
                                    <PlusIcon className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mood / Energy Selector */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-1.5">
                        <SmileIcon className="w-3.5 h-3.5" />
                        Energy Level
                        <span className="text-muted-foreground font-normal">(optional)</span>
                    </Label>
                    <div className="flex items-center gap-1">
                        {MOOD_EMOJIS.map((m) => (
                            <button
                                key={m.value}
                                type="button"
                                disabled={isDisabled}
                                onClick={() => setMood(mood === m.value ? undefined : m.value)}
                                className={cn(
                                    "p-2 rounded-lg text-2xl transition-all duration-200",
                                    "hover:bg-muted hover:scale-110",
                                    mood === m.value
                                        ? "bg-primary/20 ring-2 ring-primary scale-110"
                                        : "opacity-60 hover:opacity-100",
                                    isDisabled && "cursor-not-allowed"
                                )}
                                title={m.label}
                            >
                                {m.emoji}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Actions */}
            {state === "editing" && (
                <div className="flex items-center gap-2 px-4 py-3 border-t bg-muted/20">
                    <Button
                        variant="outline"
                        onClick={onCancel}
                        className="flex-1 sm:flex-none"
                    >
                        <XIcon className="w-4 h-4 mr-2" />
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        className="flex-1 sm:flex-none"
                        disabled={!taskContent.trim()}
                    >
                        <CheckCircle2Icon className="w-4 h-4 mr-2" />
                        Confirm & Save
                    </Button>
                </div>
            )}

            {state === "saving" && (
                <div className="flex items-center justify-center gap-2 px-4 py-3 border-t bg-amber-500/10">
                    <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-amber-600 font-medium">Saving...</span>
                </div>
            )}
        </div>
    );
}
