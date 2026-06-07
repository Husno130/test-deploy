import urllib.request
import json
import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

SITE_PROMPT = (
    "You are Marketo AI, the intelligent chatbot assistant for the Marketo AI marketing automation platform. "
    "This platform helps admins manage customers, generate AI marketing content, build email automation workflows, "
    "and review analytics. Answer questions as the site's expert marketing assistant and reference how the platform "
    "can help with campaigns, customer onboarding, welcome email automations, content generation, and analytics."
)

def generate_text_from_gemini(prompt: str) -> str:
    if not GEMINI_API_KEY:
        raise ValueError("API key not set")
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}"
    headers = {"Content-Type": "application/json"}
    data = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ]
    }
    
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode("utf-8"),
        headers=headers,
        method="POST"
    )
    
    with urllib.request.urlopen(req) as response:
        res_data = json.loads(response.read().decode("utf-8"))
        text = res_data["candidates"][0]["content"]["parts"][0]["text"]
        return text

def generate_chat_reply(prompt: str, history: list = None) -> str:
    if GEMINI_API_KEY:
        try:
            conversation = SITE_PROMPT + "\n\n"
            if history:
                for msg in history:
                    conversation += f"User: {msg.get('user')}\nAI: {msg.get('bot')}\n"
            conversation += f"User: {prompt}\nAI:"
            return generate_text_from_gemini(conversation)
        except Exception as e:
            print(f"Error calling Gemini API: {e}. Falling back to mock response.")
    
    p_lower = prompt.lower()
    if "campaign" in p_lower or "marketing" in p_lower:
        return ("To launch a successful marketing campaign, I recommend the following steps:\n\n"
                "1. **Define Your Audience**: segment customers by behavior or demographics.\n"
                "2. **Craft a Clear Value Proposition**: focus on how your product solves their problem.\n"
                "3. **Select Channels**: utilize email for warm leads, and social media ads for broad outreach.\n"
                "4. **Automate**: use welcome automations to immediately engage new subscribers.\n\n"
                "Would you like me to draft an email template for one of these channels?")
    elif "welcome" in p_lower or "email" in p_lower:
        return ("A welcome email should be friendly, clear, and action-oriented. It typically has:\n\n"
                "- A warm greeting.\n"
                "- A brief introduction or brand story.\n"
                "- A clear Call-to-Action (e.g., 'Get Started' or 'Claim your discount').\n\n"
                "I can write a customized template for you. What is the name of your product or service?")
    elif "customer" in p_lower or "lead" in p_lower:
        return ("Engaging customers requires consistent value. Here are 3 quick tips:\n\n"
                "1. **Personalization**: use their name and reference their recent actions.\n"
                "2. **Trigger-based workflows**: send emails when they take actions, e.g., when a customer is added.\n"
                "3. **Feedback loops**: ask active customers for reviews or suggestions to build loyalty.")
    else:
        return ("Hello! I'm Marketo AI, the chatbot assistant for the Marketo AI marketing automation platform. "
                "I can help you draft marketing emails, brainstorm campaigns, build automation workflows, "
                "and explain how this site manages customers, generates content, and tracks analytics. "
                "Ask me anything about marketing, customer onboarding, or automation on this platform.")

def generate_marketing_content(prompt: str) -> str:
    if GEMINI_API_KEY:
        try:
            email_instructions = (
                "Write a professional plain-text email with a Subject line and a body. "
                "Do not use markdown formatting. Include a friendly greeting, an introduction, "
                "a clear next step or offer, and a polite closing. "
                "Use placeholders like [Customer Name] and [Company Name] if appropriate."
            )
            full_prompt = f"{email_instructions}\n\n{prompt}"
            return generate_text_from_gemini(full_prompt)
        except Exception as e:
            print(f"Error calling Gemini: {e}. Using mock template.")

    p_lower = prompt.lower()
    if "welcome" in p_lower:
        return ("Subject: Welcome to our platform!\n\n"
                "Hi [Customer Name],\n\n"
                "Welcome to [Company Name]! We’re so glad you joined us.\n\n"
                "Our team is dedicated to helping you reach your goals with ease. "
                "To help you get started, here’s a special welcome offer.\n\n"
                "Use Code: WELCOME10 for 10% off your next purchase.\n\n"
                "If you have any questions, please reply to this email and our support team will be happy to help.\n\n"
                "Best regards,\n"
                "The Marketing Team")
    elif "promo" in p_lower or "discount" in p_lower or "sale" in p_lower:
        return ("Subject: Limited Time Offer: Save 20% Today\n\n"
                "Hi [Customer Name],\n\n"
                "We’re excited to share an exclusive limited-time discount with you. "
                "For the next 48 hours, enjoy 20% off our premium plans.\n\n"
                "Whether you’re upgrading or getting started for the first time, "
                "this is a great opportunity to save.\n\n"
                "Use code: SAVE20 at checkout to claim your discount.\n\n"
                "If you have any questions, just reply to this email. We’re here to help.\n\n"
                "Best regards,\n"
                "The Marketing Team")
    else:
        return (f"Subject: Handcrafted Marketing Template\n\n"
                f"Hi [Customer Name],\n\n"
                f"Thank you for being a valued customer. Here is the marketing message you requested:\n\n"
                f"{prompt}\n\n"
                f"We’re committed to helping your brand grow, and we’ll keep delivering helpful updates.\n\n"
                f"Best regards,\n"
                f"The Marketing Team")
