from database.mongodb import db
from services.ai_service import generate_marketing_content
from utils.email_sender import send_email
from datetime import datetime, timedelta
from bson import ObjectId

def parse_subject_and_body(ai_output: str, default_subject: str = "Welcome!"):
    lines = ai_output.strip().split("\n")
    subject = default_subject
    body_lines = []
    has_subject = False
    
    for line in lines:
        if line.lower().startswith("subject:") and not has_subject:
            subject = line[len("subject:"):].strip()
            has_subject = True
        else:
            if not body_lines and not line.strip():
                continue
            body_lines.append(line)
            
    body = "\n".join(body_lines).strip()
    if not has_subject:
        body = ai_output.strip()
        
    return subject, body

def trigger_automation(admin_id: str, trigger_type: str, context: dict):
    print(f"\n🔄 [AUTOMATION SYSTEM] Triggered for admin: {admin_id}, event: {trigger_type}")
    
    try:
        rules = list(db.automations.find({
            "admin_id": admin_id,
            "trigger": trigger_type,
            "active": True
        }))
    except Exception as e:
        print(f"⚠️ Error fetching rules from database: {e}")
        return
    
    if not rules:
        print("ℹ️ No active rules found for this trigger event.")
        return
        
    try:
        admin = db.admins.find_one({"_id": ObjectId(admin_id)})
        business_name = admin.get("business_name") if admin else None
        admin_name = admin.get("name", "Our Marketing") if admin else "Our Marketing"
        business_description = admin.get("business_description") if admin else None
    except Exception:
        business_name = None
        admin_name = "Our Marketing"
        business_description = None
        
    customer_id = context.get("customer_id")
    customer_name = context.get("customer_name", "Customer")
    customer_email = context.get("customer_email")
    
    for rule in rules:
        rule_id = str(rule["_id"])
        rule_name = rule["name"]
        action = rule["action"]
        config = rule.get("config", {})
        
        try:
            print(f"⚡ Running automation rule: '{rule_name}' ({action})")
            
            if action == "generate_welcome_email":
                company_name = business_name or admin_name
                prompt = (f"Write a friendly and professional welcome email for a new customer named '{customer_name}'. "
                          f"The company/sender name is '{company_name}'. "
                          f"Include a warm greeting, thank them for signing up, mention what makes the company unique")
                if business_description:
                    prompt += f" and include a short description of the company: {business_description}."
                prompt += " Offer assistance and next steps."
                
                email_type = "welcome"
                
            elif action == "generate_promotional_email":
                company_name = business_name or admin_name
                promo_offer = config.get("offer", "special offer")
                prompt = (f"Write a professional promotional email to '{customer_name}' about a {promo_offer}. "
                          f"Company/sender: '{company_name}'. Make it compelling with clear call-to-action and urgency.")
                email_type = "promotional"
                
            elif action == "generate_followup_email":
                company_name = business_name or admin_name
                prompt = (f"Write a professional follow-up email to '{customer_name}' from '{company_name}'. "
                          f"Check in on their experience, offer help, and suggest next steps. Keep it concise and friendly.")
                email_type = "followup"
                
            elif action == "generate_reengage_email":
                company_name = business_name or admin_name
                prompt = (f"Write a re-engagement email to '{customer_name}' from '{company_name}'. "
                          f"This is a win-back email for an inactive customer. Use a warm tone and offer something valuable to reignite interest.")
                email_type = "reengage"
                
            elif action == "generate_thankyou_email":
                company_name = business_name or admin_name
                prompt = (f"Write a professional thank you email to '{customer_name}' from '{company_name}'. "
                          f"Thank them for their purchase/business and provide next steps or support resources.")
                email_type = "thankyou"
                
            else:
                raise ValueError(f"Unknown action type: {action}")
            
            ai_output = generate_marketing_content(prompt)
            ai_output = ai_output.replace("[Customer Name]", customer_name)
            ai_output = ai_output.replace("[Company Name]", company_name)
            
            subject, body = parse_subject_and_body(ai_output, f"Message from {company_name}")

            # Attempt to send real email; if sending fails an exception will be raised
            success = send_email(customer_email, subject, body)
            if not success:
                raise Exception("Email sending failed")

            db.email_logs.insert_one({
                "admin_id": admin_id,
                "customer_id": customer_id,
                "recipient_email": customer_email,
                "subject": subject,
                "body": body,
                "email_type": email_type,
                "sent_at": datetime.utcnow()
            })
            
            db.automation_logs.insert_one({
                "admin_id": admin_id,
                "rule_id": rule_id,
                "rule_name": rule_name,
                "trigger": trigger_type,
                "customer_id": customer_id,
                "customer_name": customer_name,
                "status": "success",
                "message": f"Successfully sent {email_type} email to {customer_email}",
                "created_at": datetime.utcnow()
            })
            
        except Exception as e:
            error_msg = str(e)
            print(f"❌ Error executing automation rule: {error_msg}")
            
            db.automation_logs.insert_one({
                "admin_id": admin_id,
                "rule_id": rule_id,
                "rule_name": rule_name,
                "trigger": trigger_type,
                "customer_id": customer_id,
                "customer_name": customer_name,
                "status": "failed",
                "message": f"Failed to run rule: {error_msg}",
                "created_at": datetime.utcnow()
            })

def trigger_inactive_customers(admin_id: str):
    """Check for inactive customers and trigger inactive_customer workflows."""
    print(f"\n🔄 [AUTOMATION SYSTEM] Checking inactive customers for admin: {admin_id}")
    
    try:
        rules = list(db.automations.find({
            "admin_id": admin_id,
            "trigger": "customer_inactive",
            "active": True
        }))
    except Exception as e:
        print(f"⚠️ Error fetching inactive customer rules: {e}")
        return
    
    if not rules:
        return
    
    for rule in rules:
        config = rule.get("config", {})
        days_inactive = config.get("days_inactive", 30)
        cutoff_date = datetime.utcnow() - timedelta(days=days_inactive)
        
        try:
            customers = list(db.customers.find({
                "admin_id": admin_id,
                "status": "active",
                "last_activity": {"$lt": cutoff_date}
            }))
            
            for customer in customers:
                trigger_automation(admin_id, "customer_inactive", {
                    "customer_id": str(customer["_id"]),
                    "customer_name": customer.get("name", "Valued Customer"),
                    "customer_email": customer.get("email")
                })
        except Exception as e:
            print(f"⚠️ Error processing inactive customers: {e}")

def trigger_manual_workflow(admin_id: str, customer_id: str):
    """Trigger manual_trigger workflows for a specific customer."""
    print(f"\n🔄 [AUTOMATION SYSTEM] Manual trigger for customer: {customer_id}")
    
    try:
        customer = db.customers.find_one({"_id": ObjectId(customer_id)})
        if not customer:
            print(f"❌ Customer not found: {customer_id}")
            return
        
        trigger_automation(admin_id, "manual_trigger", {
            "customer_id": str(customer["_id"]),
            "customer_name": customer.get("name", "Customer"),
            "customer_email": customer.get("email")
        })
    except Exception as e:
        print(f"❌ Error triggering manual workflow: {e}")
