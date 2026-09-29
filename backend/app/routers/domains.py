from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app import models, schemas, auth
from app.database import get_db

router = APIRouter(prefix="/domains", tags=["domains"])


@router.get("", response_model=List[schemas.DomainOut])
def list_domains(db: Session = Depends(get_db)):
    domains = db.query(models.Domain).order_by(models.Domain.id.asc()).all()
    results = []
    for d in domains:
        count = db.query(func.count(models.Project.id)).filter(models.Project.domain == d.name).scalar() or 0
        results.append(
            schemas.DomainOut(
                id=d.id,
                name=d.name,
                slug=d.slug,
                description=d.description,
                project_count=count,
            )
        )
    return results


@router.post("", response_model=schemas.DomainOut, status_code=status.HTTP_201_CREATED)
def create_domain(
    payload: schemas.DomainCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_admin),
):
    existing = db.query(models.Domain).filter(
        (models.Domain.name.ilike(payload.name)) | (models.Domain.slug == payload.slug)
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Domain with this name or slug already exists")

    slug = payload.slug or payload.name.lower().replace("&", "and").replace(" ", "-")
    domain = models.Domain(
        name=payload.name.strip(),
        slug=slug.strip(),
        description=payload.description or "",
    )
    db.add(domain)
    db.commit()
    db.refresh(domain)

    return schemas.DomainOut(
        id=domain.id,
        name=domain.name,
        slug=domain.slug,
        description=domain.description,
        project_count=0,
    )
