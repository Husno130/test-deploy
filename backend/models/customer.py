from pydantic import BaseModel, EmailStr


class Customer(BaseModel):
    name: str
    email: EmailStr
    phone: str
    status: str
    admin_id: str