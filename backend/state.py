from typing import TypedDict , Annotated
from langgraph.graph.message import add_messages
class ProjectState(TypedDict):
    project_name: str
    user_prompt: str
    requirements: dict
    database: dict
    backend: dict
    frontend: dict
    api: dict
    ai_design: dict
    deployment: dict
    timeline: dict
    cost: dict
    review_score: float
    messages: list