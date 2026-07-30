from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import logging
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Annotated

import bcrypt
import jwt
from bson import ObjectId
from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr, BeforeValidator, ConfigDict

# ---------------------------------------------------------------------------
# Database
# ---------------------------------------------------------------------------
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_SECRET = os.environ['JWT_SECRET']
JWT_ALGORITHM = "HS256"

app = FastAPI(title="Elvora-X API")
api_router = APIRouter(prefix="/api")
security = HTTPBearer(auto_error=False)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("elvora")

# ---------------------------------------------------------------------------
# Helpers / Models
# ---------------------------------------------------------------------------
PyObjectId = Annotated[str, BeforeValidator(str)]


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "type": "access",
        "exp": now_utc() + timedelta(days=7),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> dict:
    if credentials is None or not credentials.credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        user["_id"] = str(user["_id"])
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class EnquiryCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    email: EmailStr
    phone: str = Field(..., min_length=4, max_length=30)
    message: str = Field(..., min_length=1, max_length=2000)
    enquiry_type: str = Field(default="general")  # general | bulk | distributor
    product: Optional[str] = None


class Enquiry(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    id: PyObjectId = Field(alias="_id")
    name: str
    email: str
    phone: str
    message: str
    enquiry_type: str = "general"
    product: Optional[str] = None
    status: str = "new"  # new | read
    created_at: str


# ---------------------------------------------------------------------------
# Static product catalogue
# ---------------------------------------------------------------------------
PRODUCTS = [
    {
        "id": "forest-blossom",
        "name": "Forest Blossom",
        "category": "Premium Floor Cleaner",
        "tagline": "Deep Clean • Shine • Freshness",
        "accent": "#2E7D32",
        "description": "A premium floor cleaner engineered for a spotless, streak-free finish. Forest Blossom lifts everyday grime while leaving behind a long-lasting botanical fragrance that transforms your home into a sanctuary.",
        "highlights": ["Streak-free spotless shine", "Long lasting floral fragrance", "Safe on all sealed floors", "Concentrated premium formula"],
        "size": "1L",
        "group": "home-care",
    },
    {
        "id": "forest-dew",
        "name": "Forest Dew",
        "category": "Premium Dish Wash",
        "tagline": "Tough on Grease • Gentle on Hands",
        "accent": "#C9A227",
        "description": "Forest Dew cuts through the toughest grease while staying gentle on your hands. A rich, active formula that leaves dishes sparkling clean with a fresh, dewy scent.",
        "highlights": ["Powerful grease cutting action", "Gentle & dermatologically kind", "Sparkling residue-free rinse", "Fresh long lasting scent"],
        "size": "1L",
        "group": "home-care",
    },
    {
        "id": "royal-forest",
        "name": "Royal Forest",
        "category": "Premium Phenyl",
        "tagline": "Powerful Cleaning • Long Lasting Freshness",
        "accent": "#14532D",
        "description": "Royal Forest is a premium phenyl disinfectant that delivers powerful cleaning and enduring freshness. Ideal for homes and professional spaces demanding hygienic, fragrant results.",
        "highlights": ["Deep hygienic protection", "Enduring forest freshness", "Homes & professional spaces", "Premium concentrated phenyl"],
        "size": "1L",
        "group": "home-care",
    },
    {
        "id": "car-dashboard-polish",
        "name": "Car Dashboard Polish",
        "category": "Automobile Interior Care",
        "tagline": "Rich Shine • UV Protection • Anti-Dust",
        "accent": "#0A1128",
        "description": "A premium dashboard polish that restores a deep, non-greasy shine to your car's interior. Enriched with UV protection to guard against fading and cracking, it refreshes dashboards, trims and panels while leaving a long-lasting fragrance.",
        "highlights": ["Deep non-greasy showroom shine", "UV protection against fading & cracks", "Anti-static, repels dust longer", "Fresh long lasting fragrance"],
        "size": "250ml",
        "group": "automobile",
        "image_url": "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1000&q=75",
    },
]

FEATURES = [
    {"title": "Effective Cleaning", "desc": "Powerful, active formulas that deliver a truly spotless result every single time."},
    {"title": "Long Lasting Fragrance", "desc": "Signature botanical scents that linger, keeping your spaces fresh for hours."},
    {"title": "Sparkling Shine", "desc": "A streak-free, radiant finish that makes surfaces gleam like new."},
    {"title": "Safe For Everyday Use", "desc": "Thoughtfully crafted to be gentle, hygienic and dependable for daily living."},
    {"title": "Homes & Professional Spaces", "desc": "Trusted performance scaled for households and professional cleaning alike."},
]


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@api_router.get("/")
async def root():
    return {"message": "Elvora-X API", "tagline": "Spotless and Pure"}


@api_router.get("/products")
async def get_products():
    return {"products": PRODUCTS, "features": FEATURES}


@api_router.post("/enquiries", response_model=Enquiry, response_model_by_alias=False)
async def create_enquiry(payload: EnquiryCreate):
    doc = payload.model_dump()
    doc["status"] = "new"
    doc["created_at"] = now_utc().isoformat()
    result = await db.enquiries.insert_one(doc)
    saved = await db.enquiries.find_one({"_id": result.inserted_id})
    return Enquiry(**saved)


# ---- Auth ----
@api_router.post("/auth/login")
async def login(payload: LoginRequest):
    email = payload.email.lower().strip()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(str(user["_id"]), email)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"email": user["email"], "name": user.get("name", "Admin"), "role": user.get("role", "admin")},
    }


@api_router.get("/auth/me")
async def me(current_user: dict = Depends(get_current_user)):
    return {"email": current_user["email"], "name": current_user.get("name", "Admin"), "role": current_user.get("role", "admin")}


# ---- Admin enquiries ----
@api_router.get("/enquiries", response_model=List[Enquiry], response_model_by_alias=False)
async def list_enquiries(current_user: dict = Depends(get_current_user)):
    docs = await db.enquiries.find().sort("created_at", -1).to_list(1000)
    return [Enquiry(**d) for d in docs]


@api_router.get("/enquiries/stats")
async def enquiry_stats(current_user: dict = Depends(get_current_user)):
    total = await db.enquiries.count_documents({})
    new = await db.enquiries.count_documents({"status": "new"})
    bulk = await db.enquiries.count_documents({"enquiry_type": {"$in": ["bulk", "distributor"]}})
    return {"total": total, "new": new, "bulk": bulk}


@api_router.patch("/enquiries/{enquiry_id}", response_model=Enquiry, response_model_by_alias=False)
async def update_enquiry(enquiry_id: str, current_user: dict = Depends(get_current_user)):
    if not ObjectId.is_valid(enquiry_id):
        raise HTTPException(status_code=400, detail="Invalid id")
    await db.enquiries.update_one({"_id": ObjectId(enquiry_id)}, {"$set": {"status": "read"}})
    doc = await db.enquiries.find_one({"_id": ObjectId(enquiry_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Not found")
    return Enquiry(**doc)


@api_router.delete("/enquiries/{enquiry_id}")
async def delete_enquiry(enquiry_id: str, current_user: dict = Depends(get_current_user)):
    if not ObjectId.is_valid(enquiry_id):
        raise HTTPException(status_code=400, detail="Invalid id")
    await db.enquiries.delete_one({"_id": ObjectId(enquiry_id)})
    return {"success": True}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@elvora-x.com").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "Elvora@2025")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Admin",
            "role": "admin",
            "created_at": now_utc().isoformat(),
        })
        logger.info("Seeded admin user %s", admin_email)
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"email": admin_email}, {"$set": {"password_hash": hash_password(admin_password)}})
        logger.info("Updated admin password for %s", admin_email)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
