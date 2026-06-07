from fastapi import APIRouter
from database.mongodb import db
from models.automation import AutomationRuleSchema
from services.automation_service import trigger_manual_workflow
from datetime import datetime
from bson import ObjectId

router = APIRouter(
    prefix="/automation",
    tags=["Automation"]
)

@router.get("/{admin_id}")
def get_rules(admin_id: str):
    try:
        count = db.automations.count_documents({"admin_id": admin_id})
    except Exception:
        count = 0
        
    if count == 0:
        try:
            db.automations.insert_one({
                "name": "Welcome New Customers",
                "trigger": "customer_added",
                "action": "generate_welcome_email",
                "active": True,
                "admin_id": admin_id,
                "created_at": datetime.utcnow()
            })
        except Exception as e:
            print(f"⚠️ Error creating default rule: {e}")
            
    try:
        cursor = db.automations.find({"admin_id": admin_id})
        rules = []
        for doc in cursor:
            rules.append({
                "_id": str(doc["_id"]),
                "name": doc["name"],
                "trigger": doc["trigger"],
                "action": doc["action"],
                "active": doc["active"],
                "admin_id": doc["admin_id"],
                "config": doc.get("config")
            })
        return rules
    except Exception as e:
        print(f"⚠️ Error querying rules: {e}")
        return []

@router.post("")
def create_rule(rule: AutomationRuleSchema):
    rule_data = rule.model_dump()
    rule_data["created_at"] = datetime.utcnow()
    result = db.automations.insert_one(rule_data)
    return {
        "success": True,
        "rule_id": str(result.inserted_id)
    }

@router.put("/{rule_id}/toggle")
def toggle_rule(rule_id: str):
    rule = db.automations.find_one({"_id": ObjectId(rule_id)})
    if not rule:
        return {"success": False, "message": "Rule not found"}
        
    new_status = not rule.get("active", True)
    db.automations.update_one(
        {"_id": ObjectId(rule_id)},
        {"$set": {"active": new_status}}
    )
    return {
        "success": True,
        "active": new_status
    }

@router.delete("/{rule_id}")
def delete_rule(rule_id: str):
    result = db.automations.delete_one({"_id": ObjectId(rule_id)})
    return {
        "success": result.deleted_count > 0
    }

@router.get("/logs/{admin_id}")
def get_logs(admin_id: str):
    try:
        cursor = db.automation_logs.find({"admin_id": admin_id}).sort("created_at", -1)
        logs = []
        for doc in cursor:
            logs.append({
                "_id": str(doc["_id"]),
                "rule_name": doc["rule_name"],
                "trigger": doc["trigger"],
                "customer_name": doc["customer_name"],
                "status": doc["status"],
                "message": doc["message"],
                "created_at": doc["created_at"]
            })
        return logs
    except Exception as e:
        print(f"⚠️ Error querying automation logs: {e}")
        return []

@router.post("/trigger/manual/{admin_id}/{customer_id}")
def trigger_manual(admin_id: str, customer_id: str):
    """Manually trigger all active 'manual_trigger' workflows for a customer."""
    try:
        trigger_manual_workflow(admin_id, customer_id)
        return {
            "success": True,
            "message": "Manual workflows triggered for customer"
        }
    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }
