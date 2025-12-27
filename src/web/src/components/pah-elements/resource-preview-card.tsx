"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    ExternalLinkIcon,
    SaveIcon,
    ClockIcon,
    TagIcon,
    MessageSquareQuoteIcon,
    LightbulbIcon,
    XIcon,
    PlusIcon
} from "lucide-react";

export interface ResourcePreviewData {
    url: string;
    title: string;
    domain: string;
    imageUrl?: string;
    aiSummary: string;
    userIntent: string;
    tags: string[];
}

export interface ResourcePreviewCardProps {
    data: ResourcePreviewData;
    onSave?: (data: ResourcePreviewData) => void;
    onReadLater?: (data: ResourcePreviewData) => void;
    state?: "editing" | "saving" | "saved";
    className?: string;
}

export function ResourcePreviewCard({
    data,
    onSave,
    onReadLater,
    state = "editing",
    className,
}: ResourcePreviewCardProps) {
    const [summary, setSummary] = useState(data.aiSummary);
    const [intent, setIntent] = useState(data.userIntent);
    const [tags, setTags] = useState(data.tags);
    const [newTag, setNewTag] = useState("");

    const handleAddTag = () => {
        if (newTag && !tags.includes(newTag)) {
            setTags([...tags, newTag]);
            setNewTag("");
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(t => t !== tagToRemove));
    };

    const isDisabled = state !== "editing";

    return (
        <div className={cn(
            "border rounded-xl overflow-hidden bg-background shadow-sm hover:shadow-md transition-shadow duration-300",
            state === "saved" && "border-green-500/50 bg-green-50/5 dark:bg-green-900/5",
            className
        )}>
            {/* Split Layout: Image on top/side, Content on bottom/other side */}
            <div className="flex flex-col md:flex-row">
                {/* Preview Section - Column 1 (Visual) */}
                <div className="md:w-1/3 border-b md:border-b-0 md:border-r bg-muted/20 relative group">
                    {data.imageUrl ? (
                        <img
                            src={data.imageUrl}
                            alt={data.title}
                            className="w-full h-48 md:h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-48 md:h-full flex items-center justify-center bg-primary/5 italic text-muted-foreground text-sm">
                            No preview image
                        </div>
                    )}
                    <div className="absolute top-2 left-2">
                        <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm border-none shadow-sm">
                            {data.domain}
                        </Badge>
                    </div>
                </div>

                {/* Analysis Section - Column 2 (Form) */}
                <div className="md:w-2/3 p-4 flex flex-col gap-4">
                    {/* Header Info */}
                    <div className="space-y-1">
                        <a
                            href={data.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-start gap-2 hover:text-primary transition-colors"
                        >
                            <h3 className="font-bold text-lg leading-tight line-clamp-2 underline-offset-4 group-hover:underline">
                                {data.title}
                            </h3>
                            <ExternalLinkIcon className="w-4 h-4 shrink-0 mt-1 opacity-50 group-hover:opacity-100" />
                        </a>
                        <p className="text-xs text-muted-foreground truncate">{data.url}</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {/* Summary */}
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                <MessageSquareQuoteIcon className="w-3.5 h-3.5" />
                                AI Summary
                            </Label>
                            <Textarea
                                value={summary}
                                onChange={(e) => setSummary(e.target.value)}
                                disabled={isDisabled}
                                className="text-sm min-h-[80px] bg-muted/30 focus:bg-background transition-colors resize-none"
                                placeholder="Edit AI summary..."
                            />
                        </div>

                        {/* Intent */}
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                                <LightbulbIcon className="w-3.5 h-3.5" />
                                My Intent (Why save this?)
                            </Label>
                            <Textarea
                                value={intent}
                                onChange={(e) => setIntent(e.target.value)}
                                disabled={isDisabled}
                                className="text-sm border-primary/20 focus:border-primary/50 bg-primary/5 transition-colors resize-none"
                                placeholder="Why are you saving this resource?"
                            />
                        </div>

                        {/* Topics */}
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                <TagIcon className="w-3.5 h-3.5" />
                                Suggested Topics
                            </Label>
                            <div className="flex flex-wrap gap-2 min-h-[32px]">
                                {tags.map(tag => (
                                    <Badge key={tag} variant="secondary" className="gap-1 pr-1.5 shadow-none">
                                        {tag}
                                        {!isDisabled && (
                                            <button
                                                onClick={() => handleRemoveTag(tag)}
                                                className="hover:text-destructive transition-colors ml-1"
                                            >
                                                <XIcon className="w-3 h-3" />
                                            </button>
                                        )}
                                    </Badge>
                                ))}
                                {!isDisabled && (
                                    <div className="flex items-center gap-1">
                                        <Input
                                            value={newTag}
                                            onChange={(e) => setNewTag(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                                            placeholder="Add tag..."
                                            className="h-6 w-24 text-[10px] py-0 px-2 shadow-none"
                                        />
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={handleAddTag}
                                            className="h-6 w-6 p-0 rounded-full"
                                        >
                                            <PlusIcon className="w-3 h-3" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-end gap-2 pt-2 mt-auto border-t border-border/50">
                        {state === "editing" ? (
                            <>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onReadLater?.({ ...data, aiSummary: summary, userIntent: intent, tags })}
                                    className="gap-2 text-xs"
                                >
                                    <ClockIcon className="w-3.5 h-3.5" />
                                    Read Later
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={() => onSave?.({ ...data, aiSummary: summary, userIntent: intent, tags })}
                                    className="gap-2 text-xs"
                                >
                                    <SaveIcon className="w-3.5 h-3.5" />
                                    Save to Library
                                </Button>
                            </>
                        ) : (
                            <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                {state === "saving" ? "Saving..." : "Saved successfully!"}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
