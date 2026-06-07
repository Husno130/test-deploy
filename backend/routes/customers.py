from fastapi import APIRouter
from database.mongodb import db
from models.customer import Customer
from datetime import datetime
from bson import ObjectId

router = APIRouter(
    prefix="/customers",
    tags=["Customers"]
)


@router.post("/")
def add_customer(customer: Customer):

    customer_data = customer.model_dump()
    customer_data["created_at"] = datetime.utcnow()

    result = db.customers.insert_one(customer_data)
    
    try:
        from services.automation_service import trigger_automation
        trigger_automation(
            admin_id=customer_data["admin_id"],
            trigger_type="customer_added",
            context={
                "customer_id": str(result.inserted_id),
                "customer_name": customer_data["name"],
                "customer_email": customer_data["email"]
            }
        )
    except Exception as e:
        print(f"⚠️ Error triggering automation: {e}")

    return {
        "success": True,
        "customer_id": str(result.inserted_id)
    }


@router.get("/{admin_id}")
def get_customers(admin_id: str):
    customers = []
    cursor = db.customers.find({"admin_id": admin_id})
    for customer in cursor:
        customers.append({
            "_id": str(customer["_id"]),
            "name": customer["name"],
            "email": customer["email"],
            "phone": customer["phone"],
            "status": customer["status"],
            "admin_id": customer["admin_id"],
            "created_at": customer.get("created_at")
        })
    return customers


@router.delete("/{customer_id}")
def delete_customer(customer_id: str):
    result = db.customers.delete_one({"_id": ObjectId(customer_id)})
    return {"success": result.deleted_count > 0}


@router.patch("/{customer_id}")
def update_customer(customer_id: str, data: dict):
    allowed = {k: v for k, v in data.items() if k in ["name", "email", "phone", "status"]}
    if not allowed:
        return {"success": False, "message": "No valid fields to update"}
    db.customers.update_one({"_id": ObjectId(customer_id)}, {"$set": allowed})
    return {"success": True}