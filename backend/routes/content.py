from fastapi import APIRouter
from database.mongodb import db
from models.content import ContentRequest, ContentBroadcast
from services.ai_service import generate_marketing_content
from services.automation_service import parse_subject_and_body
from utils.email_sender import send_email
from datetime import datetime
from bson import ObjectId

router = APIRouter(
    prefix="/generate-content",
    tags=["Content Generator"]
)


def fill_template(template: str, customer_name: str, company_name: str) -> str:
    replacements = {
        "[Customer Name]": customer_name,
        "[customer name]": customer_name,
        "[CustomerName]": customer_name,
        "[Company Name]": company_name,
        "[company name]": company_name,
        "[CompanyName]": company_name,
    }
    result = template
    for key, value in replacements.items():
        result = result.replace(key, value)
    return result


@router.post("")
def generate(payload: ContentRequest):
    content = generate_marketing_content(payload.prompt)
    subject, body = parse_subject_and_body(content, "Generated Marketing Content")
    
    if payload.admin_id:
        db.email_logs.insert_one({
            "admin_id": payload.admin_id,
            "subject": subject,
            "body": body,
            "prompt": payload.prompt,
            "sent_at": datetime.utcnow()
        })
        
    return {
        "content": content
    }


@router.post("/broadcast")
def broadcast_content(payload: ContentBroadcast):
    if not payload.content.strip():
        return {"success": False, "message": "Content cannot be empty."}

    subject, body = parse_subject_and_body(payload.content, "Generated Marketing Content")

    try:
        admin = db.admins.find_one({"_id": ObjectId(payload.admin_id)})
        company_name = admin.get("business_name") if admin else None
        admin_name = admin.get("name", "Your Company") if admin else "Your Company"
    except Exception:
        company_name = None
        admin_name = "Your Company"

    company_name = company_name or admin_name
    customers = list(db.customers.find({"admin_id": payload.admin_id, "status": "active"}))

    if not customers:
        return {"success": False, "message": "No active customers found."}

    results = {
        "sent": 0,
        "failed": 0,
        "errors": []
    }

    for customer in customers:
        customer_name = customer.get("name", "Customer")
        recipient = customer.get("email")
        email_subject = fill_template(subject, customer_name, company_name)
        email_body = fill_template(body, customer_name, company_name)

        try:
            if not recipient:
                raise ValueError("Customer email is missing")

            success = send_email(recipient, email_subject, email_body)
            if not success:
                raise RuntimeError("Email sender returned failure")

            db.email_logs.insert_one({
                "admin_id": payload.admin_id,
                "customer_id": str(customer.get("_id")),
                "recipient_email": recipient,
                "subject": email_subject,
                "body": email_body,
                "prompt": "Broadcast generated content",
                "sent_at": datetime.utcnow()
            })
            results["sent"] += 1
        except Exception as e:
            results["failed"] += 1
            results["errors"].append({
                "customer_id": str(customer.get("_id")),
                "email": recipient,
                "message": str(e)
            })

    return {
        "success": True,
        "sent": results["sent"],
        "failed": results["failed"],
        "errors": results["errors"]
    }


@router.get("/history/{admin_id}")
def get_content_history(admin_id: str):
    cursor = db.email_logs.find(
        {"admin_id": admin_id}
    ).sort("sent_at", -1)
    
    history = []
    for doc in cursor:
        history.append({
            "_id": str(doc["_id"]),
            "subject": doc.get("subject", "Generated Template"),
            "body": doc.get("body", ""),
            "prompt": doc.get("prompt", ""),
            "sent_at": doc.get("sent_at")
        })
        
    return history
