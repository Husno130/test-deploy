from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.auth import router as auth_router
from routes.customers import router as customers_router
from routes.analytics import router as analytics_router
from routes.chatbot import router as chatbot_router
from routes.content import router as content_router
from routes.automation import router as automation_router

app = FastAPI(
    title="AI Marketing Automation Platform"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(customers_router)
app.include_router(analytics_router)
app.include_router(chatbot_router)
app.include_router(content_router)
app.include_router(automation_router)


@app.get("/")
def home():

    return {
        "message": "AI Marketing Automation API Running"
    }