import { motion, AnimatePresence } from "framer-motion";
import { useLatestSSEEvent, useSSEConnection } from "@/stores/useSSEStore";
import { MessageIcon, SparklesIcon } from "./icons";
import { Logo } from "@/components/navbar/logo";
import { Button } from "@/components/ui/button";

interface OverviewProps {
    onPromptSelect?: (message: string, contextId: string) => void;
}

interface ConversationInvite {
    type: string;
    context_id: string;
    message: string;
    confidence: number;
}

const PromptCard = ({
    invite,
    onAccept
}: {
    invite: ConversationInvite;
    onAccept?: (message: string, contextId: string) => void;
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-xl p-5 backdrop-blur-sm"
        >
            <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/20 rounded-lg">
                    <SparklesIcon size={24} />
                </div>
                <div className="flex-1 space-y-3">
                    <p className="text-sm font-medium text-foreground">
                        {invite.message}
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            onClick={() => onAccept?.(invite.message, invite.context_id)}
                            className="bg-primary hover:bg-primary/90"
                        >
                            Start Conversation
                        </Button>
                        <span className="text-xs text-muted-foreground">
                            Context: {invite.context_id}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const WelcomeMessage = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-4"
        >
            <p className="flex flex-row justify-center gap-4 items-center">
                <Logo />
                <span className="text-muted-foreground">+</span>
                <MessageIcon size={32} />
            </p>
            <p className="text-muted-foreground">
                Your AI assistant is ready. Start a conversation or wait for suggestions.
            </p>
        </motion.div>
    );
};

const ConnectionStatus = ({ isConnected, error }: { isConnected: boolean; error: string | null }) => {
    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-destructive bg-destructive/10 px-3 py-1.5 rounded-full"
            >
                {error}
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-xs px-3 py-1.5 rounded-full flex items-center gap-2 ${isConnected
                ? "text-green-600 bg-green-500/10"
                : "text-muted-foreground bg-muted"
                }`}
        >
            <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-muted-foreground"}`} />
            {isConnected ? "Connected" : "Connecting..."}
        </motion.div>
    );
};

export const Overview = ({ onPromptSelect }: OverviewProps) => {
    const { isConnected, connectionError } = useSSEConnection();
    const latestEvent = useLatestSSEEvent();

    // Parse conversation invite from latest event
    const conversationInvite: ConversationInvite | null =
        latestEvent?.type === "conversation_invite"
            ? latestEvent.data as ConversationInvite
            : null;

    return (
        <motion.div
            key="overview"
            className="max-w-3xl mx-auto md:mt-20 px-4"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ delay: 0.3 }}
        >
            <div className="rounded-xl p-6 flex flex-col gap-6 leading-relaxed max-w-xl mx-auto">
                {/* Connection Status */}
                <div className="flex justify-center">
                    <ConnectionStatus isConnected={isConnected} error={connectionError} />
                </div>

                {/* Welcome or Prompt Card */}
                <AnimatePresence mode="wait">
                    {conversationInvite ? (
                        <PromptCard
                            key="prompt-card"
                            invite={conversationInvite}
                            onAccept={onPromptSelect}
                        />
                    ) : (
                        <WelcomeMessage key="welcome" />
                    )}
                </AnimatePresence>

                {/* Quick Actions when connected but no invite */}
                {isConnected && !conversationInvite && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-center"
                    >
                        <p className="text-sm text-muted-foreground">
                            Type a message below to start chatting
                        </p>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};