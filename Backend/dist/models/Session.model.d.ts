import mongoose from "mongoose";
export declare const Session: mongoose.Model<{
    userId: string;
    sessionId: string;
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
    userId: string;
    sessionId: string;
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
    userId: string;
    sessionId: string;
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
    userId: string;
    sessionId: string;
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
    userId: string;
    sessionId: string;
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
    userId: string;
    sessionId: string;
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