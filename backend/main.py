import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import logs, alerts, stats
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="Security Log Analyzer API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development, allow all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(logs.router)
app.include_router(alerts.router)
app.include_router(stats.router)

@app.get("/")
async def root():
    return {"message": "Security Log Analyzer API is running"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
