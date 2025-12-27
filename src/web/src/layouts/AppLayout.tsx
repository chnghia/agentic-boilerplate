// src/layouts/AppLayout.tsx
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { useSSEInit } from '@/hooks/use-sse'
import { useSSEConnection } from '@/stores/useSSEStore'

export default function AppLayout() {
    // Initialize SSE connection for all protected pages
    useSSEInit();

    // Get connection state from Zustand store
    const { isConnected, connectionError } = useSSEConnection();
    return (
        <div className="relative min-h-screen w-full bg-background p-4 overflow-hidden">
            {/* Navigation & controls */}
            <div className="absolute left-4 top-4 z-10 flex gap-2 items-center">
                <Button asChild variant="outline" size="sm">
                    <Link to="/">← Back to site</Link>
                </Button>
                {/* SSE Connection Status */}
                <div className="flex items-center gap-1.5 text-xs">
                    <span
                        className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
                    />
                    {connectionError && (
                        <span className="text-muted-foreground">{connectionError}</span>
                    )}
                </div>
            </div>

            {/* <div className="absolute right-4 top-4 z-10">
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Model" />
                    </SelectTrigger>
                    <SelectContent>
                        {MODELS.map((model) => (
                            <SelectItem key={model.id} value={model.id}>
                                {model.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div> */}

            {/* Chat */}
            <div className="mx-auto h-[calc(100vh-2rem)] w-full max-w-4xl">
                <Outlet />
                {/* <DemoChat model={selectedModel} className="h-full" /> */}
            </div>
        </div>
    );
}