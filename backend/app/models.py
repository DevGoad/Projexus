from datetime import datetime
from typing import List, Dict, Any

from sqlalchemy import (
    Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Table
)
from sqlalchemy.orm import relationship

from app.database import Base
from app.config import settings

# Bookmarks table: many-to-many relationship between Users and Projects
bookmarks = Table(
    "bookmarks",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True),
    Column("project_id", Integer, ForeignKey("projects.id"), primary_key=True),
)


class Domain(Base):
    __tablename__ = "domains"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False, index=True)
    slug = Column(String(100), unique=True, nullable=False, index=True)
    description = Column(String(255), default="")
    created_at = Column(DateTime, default=datetime.utcnow)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), default="student")  # student | recruiter | admin
    organization = Column(String(150), default="")
    created_at = Column(DateTime, default=datetime.utcnow)

    projects = relationship("Project", back_populates="owner", cascade="all, delete-orphan")
    saved_projects = relationship("Project", secondary=bookmarks, back_populates="saved_by")


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False, index=True)
    domain = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=False)
    problem_statement = Column(Text, default="")
    team = Column(String(255), default="")       # e.g., "A. Mehta, R. Kulkarni, S. Iyer"
    team_size = Column(Integer, default=1)
    team_roles = Column(Text, default="")        # e.g., "A. Mehta (Lead & Algorithms), R. Kulkarni (Embedded), S. Iyer (ROS Integration)"
    year = Column(Integer, default=2026, index=True)
    branch = Column(String(100), default="Engineering", index=True)
    tags = Column(String(300), default="")        # comma-separated
    tech_stack = Column(String(300), default="")  # comma-separated
    github_url = Column(String(300), default="")
    demo_url = Column(String(300), default="")
    docs_url = Column(String(300), default="")
    media_urls = Column(Text, default="")         # comma-separated or JSON list

    # Demo type: live_container, static_web, video, simulation_media, model_3d
    demo_type = Column(String(50), default="static_web")

    # Readiness checklist items (exact weights: 15, 10, 25, 15, 10, 10, 15 => 100)
    check_description = Column(Boolean, default=False)       # 15: Description & problem statement complete
    check_team = Column(Boolean, default=False)              # 10: Team and roles listed
    check_demo = Column(Boolean, default=False)              # 25: Demo available and verified working
    check_docs = Column(Boolean, default=False)              # 15: Documentation / README / report uploaded
    check_tech_stack = Column(Boolean, default=False)        # 10: Tech stack and tags filled in
    check_media = Column(Boolean, default=False)             # 10: Media (screenshots/video) added
    check_faculty_verified = Column(Boolean, default=False)  # 15: Faculty/mentor verification

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="projects")
    saved_by = relationship("User", secondary=bookmarks, back_populates="saved_projects")

    @property
    def readiness_score(self) -> int:
        score = 0
        if self.check_description:
            score += 15
        if self.check_team:
            score += 10
        if self.check_demo:
            score += 25
        if self.check_docs:
            score += 15
        if self.check_tech_stack:
            score += 10
        if self.check_media:
            score += 10
        if self.check_faculty_verified:
            score += 15
        return score

    @property
    def is_production_ready(self) -> bool:
        return self.readiness_score >= settings.PRODUCTION_READY_THRESHOLD

    @property
    def readiness_breakdown(self) -> List[Dict[str, Any]]:
        return [
            {
                "key": "check_description",
                "label": "Description and problem statement complete",
                "weight": 15,
                "completed": bool(self.check_description),
            },
            {
                "key": "check_team",
                "label": "Team and roles listed",
                "weight": 10,
                "completed": bool(self.check_team),
            },
            {
                "key": "check_demo",
                "label": "Demo available and verified working",
                "weight": 25,
                "completed": bool(self.check_demo),
            },
            {
                "key": "check_docs",
                "label": "Documentation / README / report uploaded",
                "weight": 15,
                "completed": bool(self.check_docs),
            },
            {
                "key": "check_tech_stack",
                "label": "Tech stack and tags filled in",
                "weight": 10,
                "completed": bool(self.check_tech_stack),
            },
            {
                "key": "check_media",
                "label": "Media (screenshots/video) added",
                "weight": 10,
                "completed": bool(self.check_media),
            },
            {
                "key": "check_faculty_verified",
                "label": "Faculty/mentor verification",
                "weight": 15,
                "completed": bool(self.check_faculty_verified),
            },
        ]

    @property
    def tags_list(self) -> List[str]:
        if not self.tags:
            return []
        return [t.strip() for t in self.tags.split(",") if t.strip()]

    @property
    def tech_stack_list(self) -> List[str]:
        if not self.tech_stack:
            return []
        return [t.strip() for t in self.tech_stack.split(",") if t.strip()]

    @property
    def media_list(self) -> List[str]:
        if not self.media_urls:
            return []
        return [m.strip() for m in self.media_urls.split(",") if m.strip()]
