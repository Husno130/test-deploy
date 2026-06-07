def send_simulated_email(to_email: str, subject: str, body: str) -> bool:
    print("\n" + "=" * 60)
    print(f"📧 [EMAIL SIMULATOR] SENDING OUTBOUND EMAIL:")
    print(f"   TO:      {to_email}")
    print(f"   SUBJECT: {subject}")
    print("-" * 60)
    print(body)
    print("=" * 60 + "\n")
    return True
