from pymongo import MongoClient
from dotenv import load_dotenv
import os
import ssl

load_dotenv()

MONGO_URI = os.getenv("MONGODB_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME", "ai_marketing_db")

if not MONGO_URI:
    raise ValueError("MONGODB_URI environment variable not set")

# Fix SSL/TLS handshake issues on Render + MongoDB Atlas
client = MongoClient(
    MONGO_URI,
    tlsAllowInvalidCertificates=True,
    serverSelectionTimeoutMS=5000
)

db = client[DATABASE_NAME]