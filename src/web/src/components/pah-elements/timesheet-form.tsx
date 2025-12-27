"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClockIcon, SendIcon, CheckCircle2Icon, Loader2Icon } from "lucide-react";

export interface TimesheetEntry {
    project: string;
    task: string;
    hours: number;
    date: string;
}

interface TimesheetFormProps {
    defaultValues?: Partial<TimesheetEntry>;
    onSubmit?: (data: TimesheetEntry) => void;
    state?: "input" | "submitted" | "confirmed";
    className?: string;
}

export function TimesheetForm({
    defaultValues,
    onSubmit,
    state = "input",
    className
}: TimesheetFormProps) {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        onSubmit?.({
            project: formData.get("project") as string,
            task: formData.get("task") as string,
            hours: Number(formData.get("hours")),
            date: formData.get("date") as string,
        });
    };

    const isDisabled = state !== "input";

    return (
        <div className={cn(
            "border rounded-xl p-4 bg-gradient-to-br from-muted/30 to-muted/10 backdrop-blur-sm",
            "shadow-sm hover:shadow-md transition-shadow duration-200",
            className
        )}>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/50">
                <div className="p-2 rounded-lg bg-primary/10">
                    <ClockIcon className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <h3 className="font-semibold text-foreground">Timesheet Entry</h3>
                    <p className="text-xs text-muted-foreground">Fill in your work hours</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="project" className="text-sm font-medium">Project</Label>
                        <Input
                            name="project"
                            id="project"
                            placeholder="Enter project name"
                            defaultValue={defaultValues?.project}
                            disabled={isDisabled}
                            className="bg-background/50"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="task" className="text-sm font-medium">Task</Label>
                        <Input
                            name="task"
                            id="task"
                            placeholder="What did you work on?"
                            defaultValue={defaultValues?.task}
                            disabled={isDisabled}
                            className="bg-background/50"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="hours" className="text-sm font-medium">Hours</Label>
                        <Input
                            name="hours"
                            id="hours"
                            type="number"
                            step="0.5"
                            min="0"
                            max="24"
                            placeholder="0"
                            defaultValue={defaultValues?.hours}
                            disabled={isDisabled}
                            className="bg-background/50"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="date" className="text-sm font-medium">Date</Label>
                        <Input
                            name="date"
                            id="date"
                            type="date"
                            defaultValue={defaultValues?.date || new Date().toISOString().split('T')[0]}
                            disabled={isDisabled}
                            className="bg-background/50"
                        />
                    </div>
                </div>

                {state === "input" && (
                    <Button type="submit" className="w-full mt-2">
                        <SendIcon className="w-4 h-4 mr-2" />
                        Submit Timesheet
                    </Button>
                )}

                {state === "submitted" && (
                    <div className="flex items-center justify-center gap-2 py-3 px-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                        <Loader2Icon className="w-4 h-4 text-amber-600 animate-spin" />
                        <span className="text-sm text-amber-600 font-medium">Submitting, please wait...</span>
                    </div>
                )}

                {state === "confirmed" && (
                    <div className="flex items-center justify-center gap-2 py-3 px-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <CheckCircle2Icon className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-600 font-medium">Timesheet confirmed!</span>
                    </div>
                )}
            </form>
        </div>
    );
}
