## Readme for Backend

# Setup & Installation

```
git clone https://github.com/Chandrashekher1/Chat-with-Gita.git
cd Backend
npm install

```

# .env file

```
PORT=3000
MONGO_URI=your_mongodb_connection_string
ASTRA_DB_API_ENDPOINT=your_vector_database_api_key
ASTRA_DB_APPLICATION_TOKEN=your_astraDB_token
GOOGLE_API_KEY=your_gemini_api_key
jwtPrivateKey=your_jwt_secret
```
# Run the server
```
npm run dev
```

## API Endpoint

> POST /api/v1/user
> POST /api/v1/login  
> POST /api/v1/chat  
> POST /api/v1/guest-login



