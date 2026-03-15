
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserRegister(BaseModel):
    email: EmailStr
    name: str = Field(..., min_length=2)
    organization: Optional[str] = "Independent Analyst"

class OTPVerify(BaseModel):
    email: EmailStr
    otp: str = Field(..., min_length=6, max_length=6)

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_name: str

class UserProfile(BaseModel):
    email: str
    name: str
    organization: str
    is_verified: bool
    created_at: datetime
