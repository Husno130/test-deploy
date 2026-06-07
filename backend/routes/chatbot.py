from fastapi import APIRouter
from database.mongodb import db
from models.chat import ChatRequest
from services.ai_service import generate_chat_reply
from datetime import datetime

router = APIRouter(
    prefix="/chat",
    tags=["Chatbot"]
)

@router.post("")
def chat(payload: ChatRequest):
    # Fetch recent chat logs for context
    cursor = db.chats.find(
        {"admin_id": payload.admin_id}
    ).sort("timestamp", -1).limit(5)
    
    # Reverse to chronological order
    history = []
    for doc in cursor:
        history.append({
            "user": doc["user"],
            "bot": doc["bot"]
        })
    history.reverse()
    
    # Generate reply
    reply = generate_chat_reply(payload.message, history)
    
    # Store chat log in DB
    db.chats.insert_one({
        "admin_id": payload.admin_id,
        "user": payload.message,
        "bot": reply,
        "timestamp": datetime.utcnow()
    })
    
    return {
        "reply": reply
    }

@router.get("/{admin_id}")
def get_chat_history(admin_id: str):
    cursor = db.chats.find(
        {"admin_id": admin_id}
    ).sort("timestamp", 1)
    
    history = []
    for doc in cursor:
        history.append({
            "user": doc["user"],
            "bot": doc["bot"],
            "timestamp": doc.get("timestamp")
        })
    
    return history
