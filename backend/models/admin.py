from pydantic import BaseModel, EmailStr
from typing import Optional


class AdminSignup(BaseModel):
    name: str
    email: EmailStr
    password: str
    business_name: Optional[str] = None
    business_description: Optional[str] = None


class AdminLogin(BaseModel):
    email: EmailStr
    password: str