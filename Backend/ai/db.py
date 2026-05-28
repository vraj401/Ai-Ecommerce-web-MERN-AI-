from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

client = MongoClient(
    os.getenv("DB_CONNECT")
)

db = client["AlphaMart"]

products_collection = db["products"]