## GitaGyan – AI-Powered RAG-Based Spiritual Companion

GitaGyan is an AI-powered RAG-based spiritual companion that brings the timeless wisdom of the Bhagavad Gita to life. Using Retrieval-Augmented Generation (RAG), it provides contextual and accurate answers by retrieving relevant verses before generating responses.

# Project Structure

```
GitaVerse/
│── frontend/        
│   ├── src/         
│   ├── public/
│   ├── package.json
│
│── backend/        
│   ├── src/
|   |   ├── config/
|   |   ├── data/
|   |   ├── middleware/ 
│   │   ├── routes/       # API routes
│   │   ├── models/       # MongoDB/AstraDB schemas
|   |   ├── services/
|   |   ├── startup/ 
│   │   └── index.ts
│   ├── package.json
│
│── README.md        
```

# Features
- Ask & Learn – Query Bhagavad Gita and get answers tied to real verses.
- RAG Pipeline – Combines vector search with LLMs for grounded responses.
- Semantic Search – Fast & accurate retrieval of relevant shlokas.
- User System – Login/Signup or Guest mode for personalization.
- User-Friendly Interface – Clean UI for asking questions and exploring teachings.
- Accurate & Grounded – Avoids hallucinations by retrieving real verses before generating responses.


# Tech Stack
- Frontend: React , Tailwind CSS , Shadcn
- Backend: Node.js / Express.js
- Database: MongoDB Atlas , AstraDB 
- Model: Gemini
- Deployment: Vercel (frontend) , Render (backend)

# How It Works
1. Preprocessing: Bhagavad Gita verses are embedded into vectors using AstraDB embedding.
2. Storage: Stored in a vector database AstraDB.
3. Query: User asks a question.
4. Retrieval: Semantic search finds the most relevant verses.
5. Generation: Retrieved verses are passed to the LLM, which generates a contextual answer.
6. Response: Final spiritual guidance is returned to the user.

# Installation & Setup

```
# Clone the repo
https://github.com/Chandrashekher1/Chat-with-Gita.git
cd GitaGyan

cd backend
npm install
cp .env.example .env   
npm run dev

cd frontend
npm install
cp .env.example .env   
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

# Project Highlights
- Built a RAG-based solution for spiritually grounded responses.
- Integrated vector database for fast & efficient retrieval.
- Designed for scalability with modular frontend + backend architecture.
- Provides real-time spiritual guidance from the Bhagavad Gita.

