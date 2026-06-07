from fastapi import APIRouter
from database.mongodb import db
from models.admin import AdminSignup, AdminLogin
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from bson import ObjectId

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


class AdminProfileUpdate(BaseModel):
    business_name: Optional[str] = None
    business_description: Optional[str] = None


@router.post("/register")
def register(admin: AdminSignup):

    existing_admin = db.admins.find_one(
        {"email": admin.email}
    )

    if existing_admin:
        return {
            "success": False,
            "message": "Email already registered"
        }

    admin_data = admin.model_dump()

    admin_data["created_at"] = datetime.utcnow()

    result = db.admins.insert_one(admin_data)

    return {
        "success": True,
        "message": "Account created successfully",
        "admin_id": str(result.inserted_id)
    }


@router.get("/profile/{admin_id}")
def get_profile(admin_id: str):
    try:
        admin = db.admins.find_one({"_id": ObjectId(admin_id)})
    except Exception:
        admin = None

    if not admin:
        return {
            "success": False,
            "message": "Admin not found"
        }

    profile = {
        "admin_id": str(admin["_id"]),
        "name": admin.get("name"),
        "email": admin.get("email"),
        "business_name": admin.get("business_name"),
        "business_description": admin.get("business_description")
    }

    return {
        "success": True,
        "profile": profile
    }


@router.put("/profile/{admin_id}")
def update_profile(admin_id: str, profile: AdminProfileUpdate):
    update_data = {k: v for k, v in profile.model_dump().items() if v is not None}

    if not update_data:
        return {
            "success": False,
            "message": "No information provided to update"
        }

    try:
        result = db.admins.update_one(
            {"_id": ObjectId(admin_id)},
            {"$set": update_data}
        )
    except Exception:
        return {
            "success": False,
            "message": "Unable to update admin profile"
        }

    if result.matched_count == 0:
        return {
            "success": False,
            "message": "Admin not found"
        }

    return {
        "success": True,
        "message": "Business profile updated successfully"
    }


@router.post("/login")
def login(admin: AdminLogin):

    existing_admin = db.admins.find_one(
        {
            "email": admin.email,
            "password": admin.password
        }
    )

    if not existing_admin:
        return {
            "success": False,
            "message": "Invalid email or password"
        }

    return {
        "success": True,
        "admin_id": str(existing_admin["_id"]),
        "name": existing_admin["name"],
        "business_name": existing_admin.get("business_name"),
        "business_description": existing_admin.get("business_description")
    }