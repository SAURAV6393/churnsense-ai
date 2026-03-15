
from fastapi import APIRouter, HTTPException, status
from app.schemas.auth import UserRegister, OTPVerify, Token
from app.services.db_service import db_client
from app.services.auth_service import auth_service
from app.services.email_service import email_service
from datetime import datetime
import logging

router = APIRouter()
logger = logging.getLogger("Auth")

@router.post("/register")
async def register(user: UserRegister):
    """Initiates secure OTP-based authentication flow."""
    try:
        existing_user = await db_client.db.users.find_one({"email": user.email})
        otp = auth_service.generate_otp()
        
        # Async email delivery (simulated as sync for this script context)
        email_sent = email_service.send_otp_email(to_email=user.email, otp=otp, user_name=user.name)
        
        user_data = {
            "email": user.email,
            "name": user.name,
            "organization": user.organization,
            "otp": otp, 
            "is_verified": False,
            "last_login_attempt": datetime.utcnow(),
            "created_at": existing_user["created_at"] if existing_user else datetime.utcnow()
        }
        
        if existing_user:
            await db_client.db.users.update_one({"email": user.email}, {"$set": {"otp": otp, "last_login_attempt": user_data["last_login_attempt"]}})
        else:
            await db_client.db.users.insert_one(user_data)
            
        return {
            "status": "success",
            "message": "OTP delivery initiated via global notification gateway.",
            "email": user.email,
            "delivery_verified": email_sent
        }
    except Exception as e:
        logger.error(f"Registration Error: {e}")
        raise HTTPException(status_code=500, detail="Identity service temporarily unavailable.")

@router.post("/verify-otp", response_model=Token)
async def verify_otp(data: OTPVerify):
    """Validates the identity token and issues a secure JWT session."""
    user = await db_client.db.users.find_one({"email": data.email})
    
    if not user:
        raise HTTPException(status_code=404, detail="Identity record not found.")
        
    if user.get("otp") != data.otp:
        raise HTTPException(status_code=401, detail="Invalid verification token.")
    
    # Secure clear of OTP and update verification status
    await db_client.db.users.update_one({"email": data.email}, {"$set": {"is_verified": True, "otp": None}})
    
    access_token = auth_service.create_access_token(data={"sub": user["email"], "role": "analyst"})
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "user_name": user["name"]
    }
