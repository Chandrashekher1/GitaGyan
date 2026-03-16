export declare function getSemanticChatHistory(userMessage: string, sessionId: string, topK?: number): Promise<{
    role: string;
    content: string;
    emotion: string;
    timestamp: string;
}[]>;
export declare function getRecentChatHistory(sessionId: string, limit?: number): Promise<{
    role: string;
    content: string;
    timestamp: string;
}[]>;
export declare function tripleRAGQuery(userMessage: string, emotionLabel: string, sessionId: string): Promise<{
    gitaContext: string[];
    mentalHealthContext: string[];
    semanticHistory: {
        role: string;
        content: string;
        emotion: string;
        timestamp: string;
    }[];
    recentHistory: {
        role: string;
        content: string;
        timestamp: string;
    }[];
}>;
export declare function saveChatTurn({ sessionId, userId, role, content, emotion, severity, uiComponent, }: {
    sessionId: string;
    userId: string;
    role: "user" | "assistant";
    content: string;
    emotion?: string;
    severity?: number;
    uiComponent?: string;
}): Promise<void>;
//# sourceMappingURL=ragPipeline.d.ts.map