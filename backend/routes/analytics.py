from fastapi import APIRouter
from services.analytics_service import get_dashboard_stats

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


@router.get("/{admin_id}")
def analytics(admin_id: str):

    return get_dashboard_stats(admin_id)