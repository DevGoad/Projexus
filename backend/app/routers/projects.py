from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas, auth

router = APIRouter(prefix="/projects", tags=["projects"])


def _to_out(project: models.Project, current_user: Optional[models.User]) -> schemas.ProjectOut:
    return schemas.ProjectOut(
        id=project.id,
        title=project.title,
        domain=project.domain,
        description=project.description,
        problem_statement=project.problem_statement or "",
        team=project.team,
        team_size=project.team_size,
        team_roles=project.team_roles or "",
        year=project.year or 2026,
        branch=project.branch or "Engineering",
        tags=project.tags_list,
        tech_stack=project.tech_stack_list,
        github_url=project.github_url or "",
        demo_url=project.demo_url or "",
        docs_url=project.docs_url or "",
        media_urls=project.media_list,
        demo_type=project.demo_type or "static_web",

        check_description=project.check_description,
        check_team=project.check_team,
        check_demo=project.check_demo,
        check_docs=project.check_docs,
        check_tech_stack=project.check_tech_stack,
        check_media=project.check_media,
        check_faculty_verified=project.check_faculty_verified,

        readiness_score=project.readiness_score,
        is_production_ready=project.is_production_ready,
        readiness_breakdown=[schemas.ReadinessCheckItem(**item) for item in project.readiness_breakdown],

        owner_id=project.owner_id,
        owner_name=project.owner.name if project.owner else None,
        is_saved=bool(current_user and project in current_user.saved_projects),
        is_owner=bool(current_user and project.owner_id == current_user.id),
        created_at=project.created_at,
        updated_at=project.updated_at,
    )


@router.get("", response_model=List[schemas.ProjectOut])
def list_projects(
    domain: Optional[str] = None,
    q: Optional[str] = None,
    year: Optional[int] = None,
    branch: Optional[str] = None,
    tech_tag: Optional[str] = None,
    min_readiness: Optional[int] = None,
    max_readiness: Optional[int] = None,
    demo_type: Optional[str] = None,
    saved_only: bool = False,
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(auth.get_current_user_optional),
):
    query = db.query(models.Project)

    if domain and domain.upper() != "ALL":
        query = query.filter(models.Project.domain.ilike(domain.strip()))

    if q:
        like = f"%{q.strip()}%"
        query = query.filter(
            or_(
                models.Project.title.ilike(like),
                models.Project.description.ilike(like),
                models.Project.tags.ilike(like),
                models.Project.tech_stack.ilike(like),
                models.Project.team.ilike(like),
            )
        )

    if year:
        query = query.filter(models.Project.year == year)

    if branch and branch.upper() != "ALL":
        query = query.filter(models.Project.branch.ilike(branch.strip()))

    if tech_tag:
        like_tag = f"%{tech_tag.strip()}%"
        query = query.filter(
            or_(
                models.Project.tags.ilike(like_tag),
                models.Project.tech_stack.ilike(like_tag),
            )
        )

    if demo_type and demo_type.upper() != "ALL":
        query = query.filter(models.Project.demo_type == demo_type.strip())

    projects = query.order_by(models.Project.created_at.desc()).all()

    # Filter by readiness range in memory (computed property)
    if min_readiness is not None:
        projects = [p for p in projects if p.readiness_score >= min_readiness]
    if max_readiness is not None:
        projects = [p for p in projects if p.readiness_score <= max_readiness]

    if saved_only:
        if not current_user:
            raise HTTPException(status_code=401, detail="Login required to view saved projects")
        projects = [p for p in projects if p in current_user.saved_projects]

    return [_to_out(p, current_user) for p in projects]


@router.get("/{project_id}", response_model=schemas.ProjectOut)
def get_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(auth.get_current_user_optional),
):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return _to_out(project, current_user)


@router.post("", response_model=schemas.ProjectOut, status_code=status.HTTP_201_CREATED)
def create_project(
    payload: schemas.ProjectCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_student),
):
    project = models.Project(
        title=payload.title.strip(),
        domain=payload.domain.strip(),
        description=payload.description.strip(),
        problem_statement=payload.problem_statement.strip() if payload.problem_statement else "",
        team=payload.team.strip() if payload.team else "",
        team_size=payload.team_size or 1,
        team_roles=payload.team_roles.strip() if payload.team_roles else "",
        year=payload.year or 2026,
        branch=payload.branch.strip() if payload.branch else "Engineering",
        tags=",".join([t.strip() for t in payload.tags if t.strip()]),
        tech_stack=",".join([t.strip() for t in payload.tech_stack if t.strip()]),
        github_url=payload.github_url.strip() if payload.github_url else "",
        demo_url=payload.demo_url.strip() if payload.demo_url else "",
        docs_url=payload.docs_url.strip() if payload.docs_url else "",
        media_urls=",".join([m.strip() for m in payload.media_urls if m.strip()]),
        demo_type=payload.demo_type or "static_web",

        check_description=payload.check_description,
        check_team=payload.check_team,
        check_demo=payload.check_demo,
        check_docs=payload.check_docs,
        check_tech_stack=payload.check_tech_stack,
        check_media=payload.check_media,
        check_faculty_verified=payload.check_faculty_verified,

        owner_id=current_user.id,
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return _to_out(project, current_user)


@router.patch("/{project_id}", response_model=schemas.ProjectOut)
def update_project(
    project_id: int,
    payload: schemas.ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_student),
):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.owner_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="You can only edit your own projects")

    if payload.title is not None:
        project.title = payload.title.strip()
    if payload.domain is not None:
        project.domain = payload.domain.strip()
    if payload.description is not None:
        project.description = payload.description.strip()
    if payload.problem_statement is not None:
        project.problem_statement = payload.problem_statement.strip()
    if payload.team is not None:
        project.team = payload.team.strip()
    if payload.team_size is not None:
        project.team_size = payload.team_size
    if payload.team_roles is not None:
        project.team_roles = payload.team_roles.strip()
    if payload.year is not None:
        project.year = payload.year
    if payload.branch is not None:
        project.branch = payload.branch.strip()
    if payload.tags is not None:
        project.tags = ",".join([t.strip() for t in payload.tags if t.strip()])
    if payload.tech_stack is not None:
        project.tech_stack = ",".join([t.strip() for t in payload.tech_stack if t.strip()])
    if payload.github_url is not None:
        project.github_url = payload.github_url.strip()
    if payload.demo_url is not None:
        project.demo_url = payload.demo_url.strip()
    if payload.docs_url is not None:
        project.docs_url = payload.docs_url.strip()
    if payload.media_urls is not None:
        project.media_urls = ",".join([m.strip() for m in payload.media_urls if m.strip()])
    if payload.demo_type is not None:
        project.demo_type = payload.demo_type.strip()

    if payload.check_description is not None:
        project.check_description = payload.check_description
    if payload.check_team is not None:
        project.check_team = payload.check_team
    if payload.check_demo is not None:
        project.check_demo = payload.check_demo
    if payload.check_docs is not None:
        project.check_docs = payload.check_docs
    if payload.check_tech_stack is not None:
        project.check_tech_stack = payload.check_tech_stack
    if payload.check_media is not None:
        project.check_media = payload.check_media
    if payload.check_faculty_verified is not None:
        project.check_faculty_verified = payload.check_faculty_verified

    db.commit()
    db.refresh(project)
    return _to_out(project, current_user)


@router.delete("/{project_id}", status_code=204)
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_student),
):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.owner_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="You can only delete your own projects")

    db.delete(project)
    db.commit()
    return None


@router.post("/{project_id}/bookmark", response_model=schemas.ProjectOut)
def toggle_bookmark(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if project in current_user.saved_projects:
        current_user.saved_projects.remove(project)
    else:
        current_user.saved_projects.append(project)

    db.commit()
    db.refresh(project)
    return _to_out(project, current_user)
