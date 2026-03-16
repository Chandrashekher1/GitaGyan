import { connectToDatabase } from "../config/db.astra.js";
// Collection names
const GITA_COLLECTION = "Bhagwat_Gita_As_It_Is";
const MENTAL_HEALTH_COLLECTION = "mental_health_resources";
const CHAT_HISTORY_COLLECTION = "chat_history";
// ── Semantic recall: find past conversations relevant to current message ──
export async function getSemanticChatHistory(userMessage, sessionId, topK = 4) {
    try {
        const db = connectToDatabase();
        const collection = db.collection(CHAT_HISTORY_COLLECTION);
        const cursor = collection.find({ sessionId }, {
            sort: { $vectorize: userMessage },
            limit: topK,
        });
        const results = [];
        for await (const doc of cursor) {
            results.push({
                role: doc.role,
                content: doc.content,
                emotion: doc.emotion,
                timestamp: doc.timestamp,
            });
        }
        return results;
    }
    catch (err) {
        console.error("getSemanticChatHistory error:", err);
        return [];
    }
}
// ── Recent ordered history: last N turns for conversation continuity ──
export async function getRecentChatHistory(sessionId, limit = 6) {
    try {
        const db = connectToDatabase();
        const collection = db.collection(CHAT_HISTORY_COLLECTION);
        const cursor = collection.find({ sessionId }, {
            sort: { timestamp: -1 },
            limit,
        });
        const docs = [];
        for await (const doc of cursor) {
            docs.push({
                role: doc.role,
                content: doc.content,
                timestamp: doc.timestamp,
            });
        }
        return docs.reverse(); // oldest first
    }
    catch (err) {
        console.error("getRecentChatHistory error:", err);
        return [];
    }
}
// ── Full triple RAG query: gita + mental health + chat history ──
export async function tripleRAGQuery(userMessage, emotionLabel, sessionId) {
    const k_gita = ["spiritual", "neutral", "positive"].includes(emotionLabel) ? 5 : 3;
    const k_mental = ["anxiety", "sadness", "overwhelmed", "crisis", "anger"].includes(emotionLabel) ? 5 : 2;
    const db = connectToDatabase();
    const gitaCollection = db.collection(GITA_COLLECTION);
    const mentalCollection = db.collection(MENTAL_HEALTH_COLLECTION);
    // Run all queries in parallel
    const [gitaResults, mentalResults, semanticHistory, recentHistory] = await Promise.all([
        // Gita verse search
        (async () => {
            const results = [];
            const cursor = gitaCollection.find({}, { sort: { $vectorize: userMessage }, limit: k_gita, projection: { text: true } });
            for await (const doc of cursor) {
                results.push(doc.text);
            }
            return results;
        })(),
        // Mental health resource search
        (async () => {
            const results = [];
            try {
                const cursor = mentalCollection.find({}, { sort: { $vectorize: userMessage }, limit: k_mental, projection: { content: true } });
                for await (const doc of cursor) {
                    results.push(doc.content);
                }
            }
            catch (err) {
                console.error("Mental health search error (collection may not exist yet):", err);
            }
            return results;
        })(),
        // Semantic chat history
        getSemanticChatHistory(userMessage, sessionId, 4),
        // Recent ordered history
        getRecentChatHistory(sessionId, 6),
    ]);
    return {
        gitaContext: gitaResults,
        mentalHealthContext: mentalResults,
        semanticHistory,
        recentHistory,
    };
}
// ── Save a single chat turn to Astra DB chat_history collection (vectorized) ──
export async function saveChatTurn({ sessionId, userId, role, content, emotion, severity, uiComponent, }) {
    try {
        const db = connectToDatabase();
        const collection = db.collection(CHAT_HISTORY_COLLECTION);
        await collection.insertOne({
            $vectorize: content,
            sessionId,
            userId,
            role,
            content,
            emotion: emotion || null,
            severity: severity || null,
            timestamp: new Date().toISOString(),
            uiComponent: uiComponent || null,
        });
    }
    catch (err) {
        console.error("saveChatTurn error:", err);
        // Non-fatal — don't crash the request if history save fails
    }
}
//# sourceMappingURL=ragPipeline.js.map