export interface EmotionResult {
    emotion: "anxiety" | "sadness" | "overwhelmed" | "anger" | "positive" | "neutral" | "crisis";
    severity: number;
    themes: string[];
}
export declare function detectEmotion(userMessage: string): Promise<EmotionResult>;
//# sourceMappingURL=emotionDetect.d.ts.map