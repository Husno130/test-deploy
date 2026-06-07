from pydantic import BaseModel
from typing import Optional, Dict, Any

class AutomationRuleSchema(BaseModel):
    name: str
    trigger: str  # "customer_added", "manual_trigger", "customer_inactive", "weekly_schedule", "daily_digest"
    action: str   # "generate_welcome_email", "generate_promotional_email", "generate_followup_email", "generate_reengage_email", "generate_thankyou_email"
    active: bool = True
    admin_id: str
    config: Optional[Dict[str, Any]] = None  # For action-specific config like days_inactive, day_of_week, time, etc.
