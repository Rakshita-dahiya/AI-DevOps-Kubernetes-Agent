
import os

from langchain_openai import ChatOpenAI


def get_groq_model() -> ChatOpenAI:
    """Create a Groq chat model using the configured API key."""

    api_key = os.getenv("GROQ_API_KEY")

    if not api_key:
        raise ValueError("GROQ_API_KEY is not configured.")

    return ChatOpenAI(
        model="openai/gpt-oss-120b",
        api_key=api_key,
        base_url="https://api.groq.com/openai/v1",
        temperature=0.2,
    )


def build_investigation_prompt(
    pod_name: str,
    pod_status: str,
    issues: list[str],
    recommendations: list[str],
) -> str:
    """Prepare investigation information for the AI model."""

    issues_text = "\n".join(issues) or "No issues identified by the rules."
    recommendations_text = (
        "\n".join(recommendations) or "No recommendations available."
    )

    return f"""
You are a Kubernetes troubleshooting assistant.

Analyze the following investigation information.

Pod name: {pod_name}
Pod status: {pod_status}

Issues detected:
{issues_text}

Initial recommendations:
{recommendations_text}

Explain:
1. What the status means.
2. Possible causes.
3. What commands an engineer can run to investigate.
4. Safe next steps to troubleshoot the issue.

Use clear language. Do not claim you inspected a real cluster.
Do not recommend destructive actions without explaining their risks.
"""
