from pydantic import BaseModel
from typing import Optional

class ContentRequest(BaseModel):
    prompt: str
    admin_id: Optional[str] = None


class ContentBroadcast(BaseModel):
    admin_id: str
    content: str
