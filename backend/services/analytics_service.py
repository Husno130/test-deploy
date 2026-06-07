from database.mongodb import db


def get_dashboard_stats(admin_id: str):

    total_customers = db.customers.count_documents(
        {"admin_id": admin_id}
    )

    active_customers = db.customers.count_documents(
        {
            "admin_id": admin_id,
            "status": "active"
        }
    )

    total_chats = db.chats.count_documents(
        {"admin_id": admin_id}
    )

    emails_generated = db.email_logs.count_documents(
        {"admin_id": admin_id}
    )

    return {
        "total_customers": total_customers,
        "active_customers": active_customers,
        "total_chats": total_chats,
        "emails_generated": emails_generated
    }