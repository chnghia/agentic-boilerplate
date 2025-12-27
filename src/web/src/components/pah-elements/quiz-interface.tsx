"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    CheckCircle2Icon,
    XCircleIcon,
    ArrowRightIcon,
    BookOpenIcon,
    HelpCircleIcon,
    FastForwardIcon,
    QuoteIcon
} from "lucide-react";

export interface QuizQuestion {
    id: string;
    type: "multiple-choice" | "free-text";
    question: string;
    options?: { id: string; text: string }[];
    correctAnswer?: string; // id for MC, text keywords for free-text
    explanation: string;
    sourceHighlight?: string;
}

export interface QuizInterfaceProps {
    questions: QuizQuestion[];
    onFinish?: (results: any) => void;
    className?: string;
}

export function QuizInterface({
    questions,
    onFinish,
    className,
}: QuizInterfaceProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string>("");
    const [freeTextAnswer, setFreeTextAnswer] = useState<string>("");
    const [state, setState] = useState<"question" | "feedback">("question");

    const currentQuestion = questions[currentIndex];
    const isLastQuestion = currentIndex === questions.length - 1;

    const handleSubmit = () => {
        setState("feedback");
    };

    const handleNext = () => {
        if (isLastQuestion) {
            onFinish?.({});
        } else {
            setCurrentIndex(prev => prev + 1);
            setState("question");
            setSelectedOption("");
            setFreeTextAnswer("");
        }
    };

    const isCorrect = currentQuestion.type === "multiple-choice"
        ? selectedOption === currentQuestion.correctAnswer
        : true; // AI would evaluate this in real usage

    return (
        <div className={cn("w-full max-w-2xl mx-auto", className)}>
            <Card className="border-none shadow-lg overflow-hidden bg-background/60 backdrop-blur-md">
                {/* Progress Header */}
                <div className="h-1.5 w-full bg-muted">
                    <div
                        className="h-full bg-primary transition-all duration-500"
                        style={{ width: `${((currentIndex + (state === "feedback" ? 1 : 0)) / questions.length) * 100}%` }}
                    />
                </div>

                <CardHeader className="flex flex-row items-center justify-between pb-2 bg-muted/20">
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] font-bold">
                            Question {currentIndex + 1} / {questions.length}
                        </Badge>
                        <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-tight">
                            {currentQuestion.type === "multiple-choice" ? "Multiple Choice" : "Free Text"}
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent className="pt-6 space-y-6 min-h-[300px]">
                    {/* Question Text */}
                    <div className="space-y-4">
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <HelpCircleIcon className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold leading-snug">
                                {currentQuestion.question}
                            </h3>
                        </div>
                    </div>

                    {state === "question" ? (
                        /* Input Area */
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {currentQuestion.type === "multiple-choice" ? (
                                <RadioGroup
                                    value={selectedOption}
                                    onValueChange={setSelectedOption}
                                    className="grid gap-3"
                                >
                                    {currentQuestion.options?.map((option) => (
                                        <div key={option.id} className="relative">
                                            <RadioGroupItem
                                                value={option.id}
                                                id={option.id}
                                                className="peer sr-only"
                                            />
                                            <Label
                                                htmlFor={option.id}
                                                className="flex items-center p-4 border rounded-xl hover:bg-muted/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                                            >
                                                <div className="w-6 h-6 rounded-full border flex items-center justify-center mr-3 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground">
                                                    {option.id.toUpperCase()}
                                                </div>
                                                <span className="font-medium">{option.text}</span>
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            ) : (
                                <div className="space-y-3">
                                    <Textarea
                                        placeholder="Type your answer here..."
                                        className="min-h-[120px] text-lg p-4 bg-muted/20 resize-none focus:bg-background transition-colors"
                                        value={freeTextAnswer}
                                        onChange={(e) => setFreeTextAnswer(e.target.value)}
                                    />
                                    <p className="text-xs text-muted-foreground italic">
                                        Tip: Think about the core concepts we discussed in the article.
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Feedback Area */
                        <div className="space-y-6 animate-in zoom-in-95 duration-300">
                            {/* Result Banner */}
                            <div className={cn(
                                "flex items-center gap-3 p-4 rounded-xl border",
                                isCorrect
                                    ? "bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400"
                                    : "bg-destructive/10 border-destructive/20 text-destructive"
                            )}>
                                {isCorrect ? (
                                    <CheckCircle2Icon className="w-6 h-6" />
                                ) : (
                                    <XCircleIcon className="w-6 h-6" />
                                )}
                                <span className="font-bold text-lg">
                                    {isCorrect ? "Chính xác!" : "Chưa đúng rồi!"}
                                </span>
                            </div>

                            {/* Explanation */}
                            <div className="space-y-3">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                    <BookOpenIcon className="w-3.5 h-3.5" />
                                    AI Explanation
                                </Label>
                                <div className="text-foreground leading-relaxed">
                                    {currentQuestion.explanation}
                                </div>
                            </div>

                            {/* Source Highlight */}
                            {currentQuestion.sourceHighlight && (
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                        <QuoteIcon className="w-3.5 h-3.5" />
                                        Source Highlight
                                    </Label>
                                    <div className="bg-muted/30 p-4 rounded-xl border-l-4 border-primary/20 italic text-sm text-muted-foreground">
                                        "{currentQuestion.sourceHighlight}"
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>

                <CardFooter className="p-6 bg-muted/10 border-t flex items-center justify-between">
                    {state === "question" ? (
                        <>
                            <Button
                                variant="ghost"
                                className="text-muted-foreground gap-1.5"
                                onClick={() => handleSubmit()} // Skip/Evaluate anyway
                            >
                                <FastForwardIcon className="w-4 h-4" />
                                Skip
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={currentQuestion.type === "multiple-choice" ? !selectedOption : !freeTextAnswer}
                                className="px-8 font-bold gap-2"
                            >
                                Submit Answer
                                <ArrowRightIcon className="w-4 h-4" />
                            </Button>
                        </>
                    ) : (
                        <Button
                            onClick={handleNext}
                            className="w-full font-bold gap-2 py-6 text-lg"
                        >
                            {isLastQuestion ? "Finish Session" : "Next Question"}
                            <ArrowRightIcon className="w-5 h-5" />
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
