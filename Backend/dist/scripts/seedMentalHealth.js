import { connectToDatabase } from "../config/db.astra.js";
import * as dotenv from "dotenv";
dotenv.config();
const MENTAL_HEALTH_COLLECTION = "mental_health_resources";
const CHAT_HISTORY_COLLECTION = "chat_history";
const mentalHealthDocs = [
    { content: 'Board exam anxiety is extremely common among Indian students. The CBT technique of cognitive restructuring helps by identifying catastrophic thoughts like "I will fail and ruin my life" and replacing them with balanced ones: "I may not get full marks but I can handle that outcome. One exam does not define my worth." Break study sessions into 25-minute Pomodoro blocks with 5-minute breaks to reduce overwhelm.', topic: "exam anxiety", technique: "CBT cognitive restructuring", source: "CBT" },
    { content: "Pre-exam panic attacks can be managed with the 4-7-8 breathing technique: inhale for 4 seconds, hold for 7, exhale for 8. This activates the parasympathetic nervous system and reduces cortisol within 3-5 minutes. Practice it daily for 2 weeks before exams for best results. Combine with grounding: name 5 things you can see to anchor yourself to the present moment.", topic: "exam anxiety", technique: "breathing and grounding", source: "NIMHANS" },
    { content: "Exam result anxiety after boards or JEE/NEET: remind yourself that India has multiple valid career paths. Many successful people failed their first attempt. NIMHANS research shows that reframing 'failure' as 'redirection' reduces depressive symptoms. Write a list of 3 alternative paths you could pursue — the act of listing restores a sense of agency and control.", topic: "exam anxiety", technique: "cognitive reframing", source: "NIMHANS" },
    { content: "Sleep deprivation worsens anxiety and academic performance. Sleep hygiene practices proven effective for Indian youth: avoid screens 45 minutes before bed, keep a consistent sleep time even on weekends, use the 4-7-8 breathing or progressive muscle relaxation before sleep. If racing thoughts prevent sleep, keep a worry journal beside your bed — write down every thought so your brain can release it.", topic: "sleep anxiety", technique: "sleep hygiene", source: "CBT" },
    { content: "Chronic sleep anxiety (fear of not sleeping) is treated with Cognitive Behavioral Therapy for Insomnia (CBT-I). Key technique: stimulus control — only use your bed for sleep, not studying or phone use. If you cannot sleep after 20 minutes, get up and do a boring task until sleepy. This breaks the anxiety-bed association within 2-3 weeks.", topic: "sleep anxiety", technique: "CBT-I stimulus control", source: "CBT" },
    { content: "Academic failure and self-worth: your grade is not your identity. Self-worth should be built on values and effort, not outcomes. CBT exercise: write down 5 qualities you have that exist regardless of your marks — kindness, curiosity, loyalty. Repeat daily. NIMHANS studies show students who decouple self-worth from grades recover from failure faster and perform better subsequently.", topic: "academic failure", technique: "self-worth decoupling", source: "NIMHANS" },
    { content: "After academic failure, the most effective recovery technique is behavioral activation: do one small productive thing per day, even unrelated to academics. Cook a meal, go for a 15-minute walk, call a friend. This counters depression by restoring the sense that you can affect your environment. Avoid isolation — it deepens hopelessness.", topic: "academic failure", technique: "behavioral activation", source: "CBT" },
    { content: 'Parental pressure in Indian families often comes from love and fear, not malice. Communication technique: use "I feel" statements instead of "you make me feel". Example: "I feel overwhelmed when I hear comparisons to other students" instead of "you always compare me". Schedule a calm conversation outside of exam season. NIMHANS recommends involving a school counselor as a neutral mediator if direct conversation is difficult.', topic: "parental pressure", technique: "assertive communication", source: "NIMHANS" },
    { content: 'When parental expectations feel impossible, boundary-setting is essential for mental health. It is not disrespectful to say: "I need you to trust my efforts even when my results are not what we hoped." Write a letter if speaking feels too hard. Identify one parent who is more receptive and start there. Seek support from a trusted teacher or relative who can help mediate expectations.', topic: "parental pressure", technique: "boundary setting", source: "CBT" },
    { content: "Social isolation among college students spikes in the first semester. Proven intervention: join one structured activity (club, sport, study group) within the first month — structured environments reduce the awkwardness of initiating friendships. Loneliness is not a character flaw; it is a signal that your need for connection is unmet. Volunteer work is especially effective because it provides connection and purpose simultaneously.", topic: "loneliness", technique: "behavioral activation and social engagement", source: "CBT" },
    { content: 'Loneliness can become chronic if untreated. The CBT approach: challenge the belief "nobody wants to connect with me" by listing evidence for and against it. Behavioral experiment: initiate one small interaction per day (a comment in class, a message to an acquaintance) and record the response. Most interactions will be neutral-to-positive, which gradually updates the negative belief.', topic: "loneliness", technique: "behavioral experiment", source: "CBT" },
    { content: "Relationship breakups are among the top reasons young Indians seek mental health support. The grief is real and valid — allow yourself to feel it without judgment. Avoid immediately seeking a replacement relationship. Focus on rebuilding your individual identity: rediscover hobbies, reconnect with friends you may have neglected. Physical exercise is the most evidence-based intervention for breakup-related sadness.", topic: "breakups", technique: "grief processing and behavioral activation", source: "CBT" },
    { content: 'After a breakup, rumination (repeatedly replaying conversations and mistakes) worsens depression. CBT technique: set a "worry time" — allow yourself 15 minutes daily to think about the relationship, then actively redirect. Use thought-stopping: when intrusive thoughts arise outside worry time, say "stop" aloud and redirect to a physical task. This trains the brain over 3-4 weeks.', topic: "breakups", technique: "rumination reduction", source: "CBT" },
    { content: "Career confusion after 12th or graduation is a form of identity anxiety. The narrative therapy approach: your career is one chapter of your story, not the whole plot. List your values (not just interests) — people who align careers with values report higher satisfaction than those who chase salary or status. Informational interviews (talking to 3 people in fields you are considering) reduce confusion more than any aptitude test.", topic: "career confusion", technique: "narrative therapy and values clarification", source: "CBT" },
    { content: "If you are confused between multiple career paths, do not wait for certainty before acting. Take one small exploratory step in each direction: a free online course, a shadowing experience, a conversation with a professional. Certainty comes from experience, not from thinking harder. Decision paralysis is maintained by avoidance — action dissolves it.", topic: "career confusion", technique: "exposure and action", source: "CBT" },
    { content: 'Social comparison is amplified by social media. The CBT intervention: notice when you are comparing and ask — am I comparing my behind-the-scenes to their highlight reel? Practice "comparison detox" — 72 hours off social media — and journal how your self-perception changes. NIMHANS research on Indian youth shows a 34% reduction in anxiety symptoms after 1-week social media reduction.', topic: "comparison and self-worth", technique: "social comparison reduction", source: "NIMHANS" },
    { content: "Upward social comparison triggers shame; downward comparison triggers guilt. Both are traps. The antidote is self-compassion: treat yourself with the same kindness you would give a struggling friend. Self-compassion practice: place your hand on your heart and say 'this is a moment of suffering — suffering is part of life — may I be kind to myself right now.'", topic: "comparison and self-worth", technique: "self-compassion", source: "CBT" },
    { content: "Panic attacks feel life-threatening but are not dangerous. Symptoms — racing heart, shortness of breath, derealization — peak within 10 minutes and always pass. The paradox: trying to stop a panic attack intensifies it. The effective approach is acceptance: 'I am having a panic attack. It is unpleasant but not dangerous. I will let it pass.' Combine with slow diaphragmatic breathing (5 seconds in, 5 out) and grounding techniques.", topic: "panic attacks", technique: "acceptance and breathing", source: "NIMHANS" },
    { content: "Student burnout in India is significantly underdiagnosed. Signs: emotional exhaustion, cynicism about studies, feeling ineffective even when performing adequately. Recovery requires rest before productivity — not the other way around. Schedule complete rest days with zero academic activity. Identify and reduce your single largest energy drain. Burnout takes 4-8 weeks to recover from with proper rest — this is biological, not laziness.", topic: "burnout", technique: "recovery and boundaries", source: "NIMHANS" },
    { content: "Preventing burnout relapse: implement sustainable study practices — no more than 6 focused hours of study per day, one full rest day per week, social connection at least 3 times per week. The 'sustainable peak' principle: consistent moderate effort over months outperforms intense sprints followed by crashes. Self-monitoring — weekly check-ins on energy, motivation, and mood — helps catch burnout before it becomes severe.", topic: "burnout", technique: "sustainable productivity", source: "CBT" },
];
async function seed() {
    console.log("Connecting to Astra DB...");
    const db = connectToDatabase();
    // Create mental_health_resources collection with NVIDIA vectorize
    console.log(`Creating collection: ${MENTAL_HEALTH_COLLECTION}...`);
    await db.createCollection(MENTAL_HEALTH_COLLECTION, {
        vector: {
            service: {
                provider: "nvidia",
                modelName: "NV-Embed-QA",
            },
        },
    });
    // Create chat_history collection with NVIDIA vectorize
    console.log(`Creating collection: ${CHAT_HISTORY_COLLECTION}...`);
    await db.createCollection(CHAT_HISTORY_COLLECTION, {
        vector: {
            service: {
                provider: "nvidia",
                modelName: "NV-Embed-QA",
            },
        },
    });
    // Seed mental health documents
    const mentalCollection = db.collection(MENTAL_HEALTH_COLLECTION);
    console.log(`Seeding ${mentalHealthDocs.length} mental health documents...`);
    for (const doc of mentalHealthDocs) {
        await mentalCollection.insertOne({
            $vectorize: doc.content,
            content: doc.content,
            topic: doc.topic,
            technique: doc.technique,
            source: doc.source,
        });
        process.stdout.write(".");
    }
    console.log(`\n✅ Seeded ${mentalHealthDocs.length} mental health documents.`);
    console.log(`✅ Created ${CHAT_HISTORY_COLLECTION} collection (empty, ready for chat turns).`);
    process.exit(0);
}
seed().catch((err) => {
    console.error("Seed error:", err);
    process.exit(1);
});
//# sourceMappingURL=seedMentalHealth.js.map