import { cn } from "@/lib/utils";

interface MarqueeProps {
    className?: string;
    reverse?: boolean;
    pauseOnHover?: boolean;
    children?: React.ReactNode;
    vertical?: boolean;
    repeat?: number;
}

export default function Marquee({
    className,
    reverse = false,
    pauseOnHover = false,
    children,
    vertical = false,
    repeat = 4,
}: MarqueeProps) {
    return (
        <div
            className={cn(
                "group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] gap-[var(--gap)]",
                vertical ? "flex-col" : "flex-row",
                className
            )}
        >
            {Array.from({ length: repeat }).map((_, i) => (
                <div
                    key={i}
                    className={cn(
                        "flex shrink-0 justify-around gap-[var(--gap)]",
                        vertical ? "flex-col animate-marquee-vertical" : "flex-row animate-marquee",
                        reverse && "[animation-direction:reverse]",
                        pauseOnHover && "pause-on-hover"
                    )}
                >
                    {children}
                </div>
            ))}
        </div>
    );
}
