from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field, ValidationError
from main import app as workflow
from fastapi.middleware.cors import CORSMiddleware



run = FastAPI(
    title="AI Software Architect API",
    description="API for generating AI-powered software architecture",
    version="1.0.0"
)
run.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",
                   "https://aisoftwarearchitect.netlify.app"],  # your Vite dev origin
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
            "architecture": final_state
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

