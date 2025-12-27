"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    BookOpenIcon,
    CalendarIcon,
    ClockIcon,
    SparklesIcon,
    PlayCircleIcon,
    HistoryIcon
} from "lucide-react";

export interface LearningSession {
    id: string;
    title: string;
    reason: string;
    estimatedTime: string;
    sourceDomain?: string;
}

export interface LearningPlanDashboardProps {
    userName?: string;
    sessions: LearningSession[];
    onStartSession?: (session: LearningSession) => void;
    className?: string;
}

export function LearningPlanDashboard({
    userName = "bạn",
    sessions,
    onStartSession,
    className,
}: LearningPlanDashboardProps) {
    return (
        <div className={cn("space-y-6 w-full max-w-2xl mx-auto", className)}>
            {/* Header / Greeting */}
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <SparklesIcon className="w-5 h-5 text-yellow-500 animate-pulse" />
                    <h2 className="text-xl font-bold tracking-tight">
                        Chào buổi sáng, {userName}
                    </h2>
                </div>
                <p className="text-muted-foreground flex items-center gap-2 text-sm">
                    <CalendarIcon className="w-4 h-4" />
                    Nay bạn có <span className="font-bold text-foreground">{sessions.length} bài</span> cần ôn lại và học mới.
                </p>
            </div>

            {/* Sessions List */}
            <div className="grid gap-4">
                {sessions.map((session) => (
                    <Card key={session.id} className="group overflow-hidden hover:shadow-md transition-all duration-300 border-l-4 border-l-primary/30 hover:border-l-primary">
                        <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row md:items-center justify-between p-4 gap-4">
                                <div className="space-y-2 flex-1">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider bg-primary/5 text-primary border-primary/10">
                                            {session.sourceDomain || "Resource"}
                                        </Badge>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                                            <ClockIcon className="w-3 h-3" />
                                            {session.estimatedTime}
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                                        {session.title}
                                    </h3>
                                    <div className="flex items-start gap-1.5 text-sm text-muted-foreground bg-muted/30 p-2 rounded-md italic">
                                        <HistoryIcon className="w-4 h-4 mt-0.5 shrink-0" />
                                        <span>{session.reason}</span>
                                    </div>
                                </div>

                                <Button
                                    onClick={() => onStartSession?.(session)}
                                    className="md:shrink-0 gap-2 font-bold group-hover:scale-105 transition-transform"
                                >
                                    <PlayCircleIcon className="w-5 h-5" />
                                    Start Learning
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Empty State */}
            {sessions.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/20">
                    <BookOpenIcon className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                    <p className="text-muted-foreground font-medium">Hôm nay bạn đã hoàn thành kế hoạch học tập!</p>
                </div>
            )}
        </div>
    );
}
