from app.utils.logger import LOG
from fastapi import APIRouter, HTTPException
from app.service.on_demand_service import generate_themes
from app.schema.on_demand_schema import ThemeExtractReq, ThemeExtractRes
from app.res.error import InternalServerError


tag: str = "On Demand Job"
on_demand_job: APIRouter = APIRouter(tags=[tag], prefix="/on-demand-job")


@on_demand_job.post('/theme/extract')
async def theme_extract(req: ThemeExtractReq) -> ThemeExtractRes:
    try:
        
        theme_obj, _, _, _ = await generate_themes(
            title=req.title,
            summary=req.summary,
            text=req.text
        )
        
        return ThemeExtractRes(
            themes=theme_obj.themes,
            resp_code=200, 
            response_description="User Successfully Created"
        )
    
    except HTTPException as ex:
        LOG.error(f"HTTP Exception: {ex.detail}")
        raise ex
    except Exception as ex:
        LOG.error(f"Unexpected error occurred: {ex}", exc_info=True)
        raise InternalServerError()

