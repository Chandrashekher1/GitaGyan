## 🌸 GitaGyan – AI-Powered Spiritual Companion

```
  Connect with the timeless teachings of the Bhagavad Gita through AI-powered conversations. Discover insights, save meaningful responses, and embark on your spiritual journey.
```
# 📖 About the Project
GitaGyan is an AI-powered web application that allows users to interact with the wisdom of the Bhagavad Gita.
Using Retrieval-Augmented Generation (RAG), the system fetches the most relevant verses and explains them in simple, personalized language.

It’s designed for:
 - Students seeking clarity on life decisions
 - Spiritual seekers wanting to explore scriptures
 - Anyone curious about Indian philosophy in an interactive way
 - Bhakts, elders, and aged individuals who wish to ask their problems directly and receive guidance from the Gita

# ✨Features
 - Verse Retrieval – Get context-based answers directly from the Bhagavad Gita
 - AI Conversations – Chat with an AI persona of Lord Krishna
 - Multi-language Support – Choose from multiple Indian & global languages
 - Save & Share – Bookmark insightful responses
 - Immersive UI – Includes background music (Krishna’s flute) for focus
 - Responsive Design – Works smoothly on mobile and desktop

# The Problem
While the Bhagavad Gita is one of the most profound spiritual texts, accessing and understanding its wisdom in the modern world comes with several challenges:
- Complex Language & Interpretation – Many translations are difficult to understand without a teacher or guru, especially for beginners.
- Scattered Resources – Knowledge is spread across books, commentaries, and websites, making it hard to find a consolidated source.
- Time-Consuming – Reading and studying all 700 verses requires time, patience, and deep focus, which most people struggle to dedicate.
- Lack of Personalized Guidance – Different people face different problems (students, professionals, elders, seekers), but finding verses relevant to one’s life situation is not easy.
- Language Barrier – Not everyone is comfortable with Sanskrit or English; accessibility in native languages is limited.
- Digital Disconnect – In today’s fast-paced lifestyle, younger generations often prefer quick, conversational learning instead of traditional long reading.
- Practical Application Gap – Many struggle to apply the teachings of the Gita to modern challenges like career confusion, stress, relationships, and decision-making.

# Our Solution
To address these challenges, GitaGyan provides an AI-powered platform that makes the wisdom of the Bhagavad Gita more accessible, personalized, and practical:
- Simplified Understanding – AI explains verses in clear, easy-to-understand language, removing barriers of complex translations.
- Consolidated Knowledge – All verses and interpretations are organized in one platform, eliminating the need to search across multiple sources.
- Quick Access – Instead of reading all 700 shlokas, users can directly ask questions and get relevant, contextual answers instantly.
- Personalized Guidance – Responses are tailored to individual life problems (students, professionals, elders, seekers), ensuring relevance.
- Multilingual Support – The platform supports multiple Indian languages, breaking down the language barrier.
- Modern Conversational Format – Offers an interactive chat interface with Lord Krishna’s persona, appealing to both young and old generations.
- Practical Applications – Provides actionable insights by mapping teachings of the Gita to real-life challenges like stress, career decisions, and relationships.

# Screenshots
<img width="1902" height="871" alt="image" src="https://github.com/user-attachments/assets/b0034fb3-a68a-4f6c-8e16-17560d8202d9" />
<img width="1920" height="882" alt="image" src="https://github.com/user-attachments/assets/105eb590-c8a5-42b7-8aa4-355a23367a19" />

# 🛠 Tech Stack
Frontend:
- React.js/ TypeScript, Tailwind CSS and ShadCN UI
  
Backend:
- Node.js + Express.js
- MongoDB (user data)
  
AI Layer:
- Gemini API (for response generation)
  
📚 Vector Database (Astra DB) for RAG

Deployment:
- Vercel (Frontend)
- Render  (Backend)

# ⚙️ Installation & Setup
Clone the repo:
```
git clone https://github.com/Chandrashekher1/Chat-with-Gita.git
cd Chat-wWth-Gita
```
Frontend Setup
```
cd frontend
npm install
npm run dev
```
Backend Setup
```
cd backend
npm install
npm run dev
```
# Example API Endpoint
```
POST /api/chat
Content-Type: application/json
Authorization: `${token}`

{
  "query": "What does the Gita say about karma?"
}
```
# Response
```
{
  "answer": "According to Bhagavad Gita 2.47, you have the right to perform your duty, but not to the fruits of action..."
}
```

# 📜 License
This project is licensed under the MIT License.

# Quote 
```
✨ May this project spread wisdom and clarity from the eternal Gita to the modern world.
```

