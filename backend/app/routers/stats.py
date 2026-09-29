from typing import Dict, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app import models, schemas
from app.database import get_db
from app.config import settings

router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("", response_model=schemas.StatsOut)
def get_stats(db: Session = Depends(get_db)):
    all_projects = db.query(models.Project).all()
    projects_listed = len(all_projects)
    
    threshold = settings.PRODUCTION_READY_THRESHOLD
    production_ready = sum(1 for p in all_projects if p.readiness_score >= threshold)
    
    domains_count = db.query(models.Domain).count()

    by_domain: Dict[str, int] = {}
    by_branch: Dict[str, int] = {}
    years_set = set()
    tags_set = set()

    for p in all_projects:
        by_domain[p.domain] = by_domain.get(p.domain, 0) + 1
        if p.branch:
            by_branch[p.branch] = by_branch.get(p.branch, 0) + 1
        if p.year:
            years_set.add(p.year)
        for t in p.tags_list:
            tags_set.add(t)

    return schemas.StatsOut(
        projects_listed=projects_listed,
        production_ready=production_ready,
        threshold=threshold,
        domains_count=domains_count,
        by_domain=by_domain,
        by_branch=by_branch,
        branches=sorted(list(by_branch.keys())),
        years=sorted(list(years_set), reverse=True),
        tags=sorted(list(tags_set)),
    )
