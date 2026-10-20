from typing import List, Optional, Dict, Any
from pydantic import BaseModel, ConfigDict
from datetime import datetime

# Resilient EmailStr import: fall back to str if email-validator package is missing
try:
    import email_validator  # noqa: F401
    from pydantic import EmailStr
except (ImportError, Exception):
    EmailStr = str  # type: ignore


# ---------- Auth Schemas ----------

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "student"  # "student" | "recruiter" | "admin"
    organization: Optional[str] = ""


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    email: EmailStr
    role: str
    organization: Optional[str] = ""
    created_at: Optional[datetime] = None


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# ---------- Domain Schemas ----------

class DomainCreate(BaseModel):
    name: str
    slug: Optional[str] = None
    description: Optional[str] = ""


class DomainOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    slug: str
    description: Optional[str] = ""
    project_count: Optional[int] = 0


# ---------- Project Schemas ----------

class ReadinessCheckItem(BaseModel):
    key: str
    label: str
    weight: int
    completed: bool


class ProjectCreate(BaseModel):
    title: str
    domain: str
    description: str
    problem_statement: Optional[str] = ""
    team: Optional[str] = ""
    team_size: Optional[int] = 1
    team_roles: Optional[str] = ""
    year: Optional[int] = 2026
    branch: Optional[str] = "Engineering"
    tags: List[str] = []
    tech_stack: List[str] = []
    github_url: Optional[str] = ""
    demo_url: Optional[str] = ""
    docs_url: Optional[str] = ""
    media_urls: List[str] = []
    demo_type: str = "static_web"  # live_container, static_web, video, simulation_media, model_3d

    # Checklist items
    check_description: bool = False
    check_team: bool = False
    check_demo: bool = False
    check_docs: bool = False
    check_tech_stack: bool = False
    check_media: bool = False
    check_faculty_verified: bool = False


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    domain: Optional[str] = None
    description: Optional[str] = None
    problem_statement: Optional[str] = None
    team: Optional[str] = None
    team_size: Optional[int] = None
    team_roles: Optional[str] = None
    year: Optional[int] = None
    branch: Optional[str] = None
    tags: Optional[List[str]] = None
    tech_stack: Optional[List[str]] = None
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    docs_url: Optional[str] = None
    media_urls: Optional[List[str]] = None
    demo_type: Optional[str] = None

    check_description: Optional[bool] = None
    check_team: Optional[bool] = None
    check_demo: Optional[bool] = None
    check_docs: Optional[bool] = None
    check_tech_stack: Optional[bool] = None
    check_media: Optional[bool] = None
    check_faculty_verified: Optional[bool] = None


class ProjectOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    domain: str
    description: str
    problem_statement: Optional[str] = ""
    team: str
    team_size: int
    team_roles: Optional[str] = ""
    year: int
    branch: str
    tags: List[str]
    tech_stack: List[str]
    github_url: Optional[str] = ""
    demo_url: Optional[str] = ""
    docs_url: Optional[str] = ""
    media_urls: List[str] = []
    demo_type: str

    # Checklist status
    check_description: bool
    check_team: bool
    check_demo: bool
    check_docs: bool
    check_tech_stack: bool
    check_media: bool
    check_faculty_verified: bool

    # Computed fields
    readiness_score: int
    is_production_ready: bool
    readiness_breakdown: List[ReadinessCheckItem]

    owner_id: Optional[int] = None
    owner_name: Optional[str] = None
    is_saved: bool = False
    is_owner: bool = False
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


# ---------- Stats Schemas ----------

class StatsOut(BaseModel):
    projects_listed: int
    production_ready: int
    threshold: int
    domains_count: int
    by_domain: Dict[str, int] = {}
    by_branch: Dict[str, int] = {}
    branches: List[str] = []
    years: List[int] = []
    tags: List[str] = []
