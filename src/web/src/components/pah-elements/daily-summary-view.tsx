"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ClockIcon, CalendarIcon, CheckCircle2Icon } from "lucide-react";

// Types
export interface TimelineTask {
    id: string;
    title: string;
    projectName: string;
    projectColor?: string;
    duration: number; // in minutes
    startTime: string; // e.g., "09:00"
    endTime: string;   // e.g., "10:30"
}

export interface DailySummaryViewProps {
    date?: string;
    tasks: TimelineTask[];
    className?: string;
}

export function DailySummaryView({
    date = new Date().toLocaleDateString(),
    tasks = [],
    className,
}: DailySummaryViewProps) {
    const totalMinutes = tasks.reduce((acc, task) => acc + task.duration, 0);
    const totalHours = (totalMinutes / 60).toFixed(1);

    return (
        <div className={cn("space-y-6 w-full max-w-2xl mx-auto", className)}>
            {/* Header / Summary Card */}
            <div className="flex flex-wrap gap-4 items-end justify-between px-2">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <CalendarIcon className="w-6 h-6 text-primary" />
                        Daily Summary
                    </h2>
                    <p className="text-muted-foreground">{date}</p>
                </div>

                <Card className="bg-primary/5 border-primary/20 shadow-none">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 rounded-full bg-primary/10 text-primary">
                            <ClockIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Time</p>
                            <p className="text-2xl font-bold text-primary">{totalHours}h</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Timeline */}
            <div className="relative pl-8 space-y-8 before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-gradient-to-b before:from-primary/50 before:via-border/50 before:to-transparent">
                {tasks.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
                        No tasks recorded for today.
                    </div>
                ) : (
                    tasks.map((task) => (
                        <div key={task.id} className="relative group">
                            {/* Marker */}
                            <div className="absolute -left-[29px] top-1.5 w-4 h-4 rounded-full border-2 border-primary bg-background ring-4 ring-background z-10 group-hover:scale-125 transition-transform duration-200" />

                            {/* Content */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                                    <span>{task.startTime}</span>
                                    <span>–</span>
                                    <span>{task.endTime}</span>
                                    <span className="text-xs px-1.5 py-0.5 rounded bg-muted">
                                        {task.duration}m
                                    </span>
                                </div>

                                <Card className="hover:shadow-md hover:border-primary/30 transition-all duration-300 overflow-hidden">
                                    <div
                                        className="h-1 w-full"
                                        style={{ backgroundColor: task.projectColor || "#888" }}
                                    />
                                    <CardContent className="p-4">
                                        <div className="flex flex-wrap justify-between items-start gap-3">
                                            <div className="space-y-1">
                                                <h4 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                                                    {task.title}
                                                </h4>
                                                <Badge
                                                    variant="secondary"
                                                    className="font-medium"
                                                    style={{
                                                        backgroundColor: `${task.projectColor}15`,
                                                        color: task.projectColor,
                                                        borderColor: `${task.projectColor}30`
                                                    }}
                                                >
                                                    {task.projectName}
                                                </Badge>
                                            </div>
                                            <CheckCircle2Icon className="w-5 h-5 text-green-500/50" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
