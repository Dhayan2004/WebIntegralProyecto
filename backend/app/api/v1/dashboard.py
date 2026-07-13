from fastapi import APIRouter, Depends

from app.db.models.user import User
from app.dependencies.auth import get_current_user
from app.dependencies.db import get_db
from app.schemas.dashboard import DashboardMetrics
from app.services.dashboard_service import DashboardService

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/metrics", response_model=DashboardMetrics)
def metrics(current_user: User = Depends(get_current_user), db=Depends(get_db)):
    return DashboardService.metrics(db=db, current_user=current_user)
