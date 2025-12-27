"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    BookmarkIcon,
    XIcon,
    NewspaperIcon,
    ArrowRightIcon,
    TrendingUpIcon
} from "lucide-react";

export interface NewsItem {
    id: string;
    title: string;
    summary: string;
    url: string;
    relevanceScore: number; // 0-100
    source: string;
}

export interface NewsDigestCardProps {
    items: NewsItem[];
    onBookmark?: (item: NewsItem) => void;
    onDismiss?: (item: NewsItem) => void;
    onViewMore?: () => void;
    className?: string;
}

export function NewsDigestCard({
    items,
    onBookmark,
    onDismiss,
    onViewMore,
    className,
}: NewsDigestCardProps) {
    return (
        <div className={cn(
            "border rounded-xl bg-gradient-to-b from-background to-muted/10 shadow-sm overflow-hidden",
            className
        )}>
            {/* Header */}
            <div className="px-4 py-3 border-b flex items-center justify-between bg-muted/20">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                        <NewspaperIcon className="w-4 h-4" />
                    </div>
                    <h3 className="font-semibold text-sm">Morning Digest</h3>
                </div>
                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest bg-background/50">
                    {items.length} curated stories
                </Badge>
            </div>

            {/* List */}
            <div className="divide-y divide-border/50">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="p-4 group hover:bg-muted/30 transition-colors duration-200"
                    >
                        <div className="flex flex-col gap-2">
                            {/* Metadata */}
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-bold tracking-tight">
                                    <span className="text-primary/70">{item.source}</span>
                                    <span>•</span>
                                    <div className="flex items-center gap-1 text-primary">
                                        <TrendingUpIcon className="w-3 h-3" />
                                        {item.relevanceScore}% Match
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 w-7 p-0 rounded-full hover:bg-destructive/10 hover:text-destructive"
                                        onClick={() => onDismiss?.(item)}
                                        title="Dismiss"
                                    >
                                        <XIcon className="w-3.5 h-3.5" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 w-7 p-0 rounded-full hover:bg-primary/10 hover:text-primary"
                                        onClick={() => onBookmark?.(item)}
                                        title="Bookmark"
                                    >
                                        <BookmarkIcon className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            </div>

                            {/* Title & TL;DR */}
                            <div className="space-y-1">
                                <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block font-bold text-[15px] leading-tight hover:text-primary transition-colors decoration-primary/30 underline-offset-4 hover:underline"
                                >
                                    {item.title}
                                </a>
                                <p className="text-sm text-muted-foreground leading-snug line-clamp-2 italic">
                                    <span className="font-bold text-[10px] bg-muted px-1 rounded mr-1 not-italic">TL;DR</span>
                                    {item.summary}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="p-2 border-t bg-muted/5">
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full h-8 text-xs font-medium text-muted-foreground hover:text-primary gap-1"
                    onClick={onViewMore}
                >
                    View All News
                    <ArrowRightIcon className="w-3 h-3" />
                </Button>
            </div>
        </div>
    );
}
