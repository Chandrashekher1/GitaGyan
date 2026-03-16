export interface SafetyResult {
    safe: boolean;
    level: "safe" | "distress" | "crisis";
    reason: string;
}
export declare function classifySafety(userMessage: string): Promise<SafetyResult>;
//# sourceMappingURL=safetyClassifier.d.ts.map