
import os
from motor.motor_asyncio import AsyncIOMotorClient

class DatabaseClient:
    def __init__(self):
        self.client = None
        self.db = None
        # Defaulting to local if no env provided, but handles Atlas strings
        self.uri = os.environ.get("MONGODB_URI", "mongodb://localhost:27017")
        self.db_name = "churnsense_ai"

    async def connect(self):
        self.client = AsyncIOMotorClient(self.uri)
        self.db = self.client[self.db_name]
        print(f"Connected to MongoDB: {self.db_name}")

    async def close(self):
        if self.client:
            self.client.close()

db_client = DatabaseClient()
