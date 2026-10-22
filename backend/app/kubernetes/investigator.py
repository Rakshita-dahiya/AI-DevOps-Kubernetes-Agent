
from typing import Any


def investigate_pod(pod: dict[str, Any]) -> dict[str, Any]:
    """
    Analyze Kubernetes pod information and identify possible issues.
    This prototype uses sample data, not a live Kubernetes cluster.
    """

    name = pod.get("name", "unknown")
    status = pod.get("status", "Unknown")

    issues = []
    recommendations = []

    if status == "CrashLoopBackOff":
        issues.append("The container is repeatedly crashing.")
        recommendations.append(
            "Inspect container logs and pod events to find the cause."
        )

    elif status == "ImagePullBackOff":
        issues.append("Kubernetes cannot pull the container image.")
        recommendations.append(
            "Check the image name, tag, registry access, and image pull secrets."
        )

    elif status == "Pending":
        issues.append("The pod has not started successfully.")
        recommendations.append(
            "Check pod events, available resources, and scheduling constraints."
        )

    elif status == "Running":
        recommendations.append(
            "The pod is running. Check readiness and application logs if problems persist."
        )

    else:
        issues.append(f"The pod has an unresolved status: {status}.")
        recommendations.append(
            "Inspect pod details and recent Kubernetes events."
        )

    return {
        "pod_name": name,
        "status": status,
        "issues": issues,
        "recommendations": recommendations,
    }
