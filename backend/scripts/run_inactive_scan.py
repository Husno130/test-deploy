#!/usr/bin/env python3
"""
Run inactive-customer automations for every admin.
Usage: from repository root run:
  cd backend
  python scripts/run_inactive_scan.py
This script calls `trigger_inactive_customers(admin_id)` from the automation service.
"""

from database.mongodb import db
from services.automation_service import trigger_inactive_customers


def main():
    admins = list(db.admins.find({}))
    if not admins:
        print("No admins found in the database.")
        return

    for admin in admins:
        admin_id = str(admin.get("_id"))
        print(f"Running inactive scan for admin: {admin_id}")
        try:
            trigger_inactive_customers(admin_id)
            print(f"Completed scan for {admin_id}")
        except Exception as e:
            print(f"Error during scan for {admin_id}: {e}")


if __name__ == "__main__":
    main()
