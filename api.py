from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field, ValidationError
from main import app as workflow
from fastapi.middleware.cors import CORSMiddleware

import os
import zipfile
import tempfile


run = FastAPI(
    title="AI Software Architect API",
    description="API for generating AI-powered software architecture",
    version="1.0.0"
)

run.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://software-architect-pi.vercel.app/"
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)


class InputProject(BaseModel):
    user_prompt: str = Field(
        ...,
        min_length=15,
        description="Detailed description of the project"
    )

    project_name: str = Field(
        ...,
        min_length=4,
        description="Name of the project"
    )


@run.get("/")
def home():
    return {
        "message": "Welcome to AI Software Architect API",
        "usage": "Use POST /generate to generate a software architecture",
        "docs": "/docs"
    }


@run.post("/generate")
def generate(project: InputProject):

    initial_state = {
        "project_name": project.project_name,
        "user_prompt": project.user_prompt,
        "requirements": "",
        "database": "",
        "backend": "",
        "frontend": "",
        "api": "",
        "ai_design": "",
        "deployment": "",
        "timeline": "",
        "cost": "",
        "review_score": 0.0,
        "messages": []
    }

    try:
        final_state = workflow.invoke(initial_state)

        return {
            "success": True,
            "project_name": project.project_name,
            "architecture": {
                "project_name": final_state.get("project_name"),
                "requirements": final_state.get("requirements"),
                "database": final_state.get("database"),
                "backend": final_state.get("backend"),
                "frontend": final_state.get("frontend"),
                "api": final_state.get("api"),
                "ai_design": final_state.get("ai_design"),
                "deployment": final_state.get("deployment"),
                "timeline": final_state.get("timeline"),
                "cost": final_state.get("cost"),
                "review_score": final_state.get("review_score")
            }
        }

    except ValidationError as e:
        raise HTTPException(
            status_code=422,
            detail={
                "error": "Validation error",
                "message": "Invalid data generated during the architecture workflow.",
                "details": e.errors()
            }
        )

    except TimeoutError:
        raise HTTPException(
            status_code=504,
            detail={
                "error": "Workflow timeout",
                "message": "Architecture generation took too long. Please try again."
            }
        )

    except ConnectionError:
        raise HTTPException(
            status_code=503,
            detail={
                "error": "Service connection error",
                "message": "Unable to connect to an external AI service."
            }
        )

    except PermissionError:
        raise HTTPException(
            status_code=500,
            detail={
                "error": "Permission error",
                "message": "The server does not have permission to access a required resource."
            }
        )

    except Exception:
        raise HTTPException(
            status_code=500,
            detail={
                "error": "Architecture generation failed",
                "message": "An unexpected error occurred while generating the architecture."
            }
        )


REPORTS_DIR = "reports"


@run.get("/reports")
def get_reports():
    """
    Returns all available reports inside the reports folder.
    """

    if not os.path.exists(REPORTS_DIR):
        raise HTTPException(
            status_code=404,
            detail="Reports folder does not exist."
        )

    files = [
        file
        for file in os.listdir(REPORTS_DIR)
        if os.path.isfile(os.path.join(REPORTS_DIR, file))
    ]

    return {
        "success": True,
        "count": len(files),
        "reports": files
    }


@run.get("/reports/download")
def download_reports():
    """
    Creates a ZIP file containing all reports
    and returns it for download.
    """

    if not os.path.exists(REPORTS_DIR):
        raise HTTPException(
            status_code=404,
            detail="Reports folder does not exist."
        )

    files = [
        file
        for file in os.listdir(REPORTS_DIR)
        if os.path.isfile(os.path.join(REPORTS_DIR, file))
    ]

    if not files:
        raise HTTPException(
            status_code=404,
            detail="No reports available for download."
        )

    # Create temporary ZIP file
    temp_zip = tempfile.NamedTemporaryFile(
        delete=False,
        suffix=".zip"
    )

    zip_path = temp_zip.name
    temp_zip.close()

    try:
        with zipfile.ZipFile(
            zip_path,
            "w",
            zipfile.ZIP_DEFLATED
        ) as zip_file:

            for file in files:
                file_path = os.path.join(REPORTS_DIR, file)

                # Keep files inside "reports/" in the ZIP
                zip_file.write(
                    file_path,
                    arcname=f"reports/{file}"
                )

        return FileResponse(
            path=zip_path,
            media_type="application/zip",
            filename="AI_Software_Architect_Reports.zip"
        )

    except Exception:
        if os.path.exists(zip_path):
            os.remove(zip_path)
        raise HTTPException(
            status_code=500,
            detail="Failed to create reports ZIP file."
        )
