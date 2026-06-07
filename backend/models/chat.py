from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str
    admin_id: str
