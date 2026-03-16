import mongoose from "mongoose";
export declare const Session: mongoose.Model<{
    sessionId: string;
    userId: string;
    moodTimeline: mongoose.Types.DocumentArray<{
        date: NativeDate;
        emotion?: string | null;
        severity?: number | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        date: NativeDate;
        emotion?: string | null;
        severity?: number | null;
    }> & {
        date: NativeDate;
        emotion?: string | null;
        severity?: number | null;
    }>;
    messageCount: number;
    createdAt: NativeDate;
    lastActive: NativeDate;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    sessionId: string;
    userId: string;
    moodTimeline: mongoose.Types.DocumentArray<{
        date: NativeDate;
        emotion?: string | null;
        severity?: number | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        date: NativeDate;
        emotion?: string | null;
        severity?: number | null;
    }> & {
        date: NativeDate;
        emotion?: string | null;
        severity?: number | null;
    }>;
    messageCount: number;
    createdAt: NativeDate;
    lastActive: NativeDate;
}, {}, mongoose.DefaultSchemaOptions> & {
    sessionId: string;
    userId: string;
    moodTimeline: mongoose.Types.DocumentArray<{
        date: NativeDate;
        emotion?: string | null;
        severity?: number | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        date: NativeDate;
        emotion?: string | null;
        severity?: number | null;
    }> & {
        date: NativeDate;
        emotion?: string | null;
        severity?: number | null;
    }>;
    messageCount: number;
    createdAt: NativeDate;
    lastActive: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    sessionId: string;
    userId: string;
    moodTimeline: mongoose.Types.DocumentArray<{
        date: NativeDate;
        emotion?: string | null;
        severity?: number | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        date: NativeDate;
        emotion?: string | null;
        severity?: number | null;
    }> & {
        date: NativeDate;
        emotion?: string | null;
        severity?: number | null;
    }>;
    messageCount: number;
    createdAt: NativeDate;
    lastActive: NativeDate;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    sessionId: string;
    userId: string;
    moodTimeline: mongoose.Types.DocumentArray<{
        date: NativeDate;
        emotion?: string | null;
        severity?: number | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        date: NativeDate;
        emotion?: string | null;
        severity?: number | null;
    }> & {
        date: NativeDate;
        emotion?: string | null;
        severity?: number | null;
    }>;
    messageCount: number;
    createdAt: NativeDate;
    lastActive: NativeDate;
}>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<{
    sessionId: string;
    userId: string;
    moodTimeline: mongoose.Types.DocumentArray<{
        date: NativeDate;
        emotion?: string | null;
        severity?: number | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        date: NativeDate;
        emotion?: string | null;
        severity?: number | null;
    }> & {
        date: NativeDate;
        emotion?: string | null;
        severity?: number | null;
    }>;
    messageCount: number;
    createdAt: NativeDate;
    lastActive: NativeDate;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
//# sourceMappingURL=Session.model.d.ts.map