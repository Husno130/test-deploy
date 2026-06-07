from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URI = os.getenv("MONGODB_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME", "ai_marketing_db")

if not MONGO_URI:
    raise ValueError("MONGODB_URI environment variable not set")

client = MongoClient(MONGO_URI)

db = client[DATABASE_NAME]