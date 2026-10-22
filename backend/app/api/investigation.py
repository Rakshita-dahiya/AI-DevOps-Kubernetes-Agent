
from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from loguru import logger

from app.kubernetes.investigator import investigate_pod
from app.ai.llm_service import get_groq_model, build_investigation_prompt


router = APIRouter(prefix="/api", tags=["Investigation"])


class PodInput(BaseModel):
    name: str
    status: str


@router.post("/investigate")
async def investigate(payload: PodInput) -> dict[str, Any]:
    # Step 1: Run our existing rule-based investigation.
    pod_data = payload.model_dump()
    result = investigate_pod(pod_data)

    # Step 2: Prepare the findings for the AI model.
    prompt = build_investigation_prompt(
        pod_name=result["pod_name"],
        pod_status=result["status"],
        issues=result["issues"],
        recommendations=result["recommendations"],
    )

    # Step 3: Ask Groq to analyze the findings.
    try:
        model = get_groq_model()
        response = await model.ainvoke(prompt)
        result["ai_analysis"] = response.content

    except Exception:
        logger.exception("AI investigation failed")
        result["ai_analysis"] = (
            "AI analysis is temporarily unavailable. "
            "Please use the rule-based findings above."
        )

    # Step 4: Return both rule-based and AI findings.
    return result
