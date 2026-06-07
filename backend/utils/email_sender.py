import os
import smtplib
from email.message import EmailMessage

def send_email(to_email: str, subject: str, body: str) -> bool:
    """Send an email using SMTP settings from environment variables.

    Returns True if send succeeded, False otherwise.
    """
    host = os.getenv("EMAIL_HOST")
    port = int(os.getenv("EMAIL_PORT", "0") or 0)
    username = os.getenv("EMAIL_USERNAME")
    password = os.getenv("EMAIL_PASSWORD")
    from_addr = os.getenv("EMAIL_FROM") or username
    use_tls = os.getenv("EMAIL_USE_TLS", "true").lower() in ("1", "true", "yes")
    use_ssl = os.getenv("EMAIL_USE_SSL", "false").lower() in ("1", "true", "yes")

    if not host or not port:
        print("⚠️ Email settings incomplete: EMAIL_HOST or EMAIL_PORT missing")
        return False

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = from_addr
    msg["To"] = to_email
    msg.set_content(body)

    try:
        if use_ssl:
            server = smtplib.SMTP_SSL(host, port, timeout=10)
        else:
            server = smtplib.SMTP(host, port, timeout=10)
        server.ehlo()
        if use_tls and not use_ssl:
            server.starttls()
            server.ehlo()
        if username and password:
            server.login(username, password)

        server.send_message(msg)
        server.quit()
        print(f"✅ Email sent to {to_email}")
        return True
    except Exception as e:
        print(f"❌ Failed to send email to {to_email}: {e}")
        return False
