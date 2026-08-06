from state import ProjectState
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from prompts import REVIEW_PROMPT
from text_to_pdf import text_to_pdf
from dotenv import load_dotenv
load_dotenv()
from rich import print

model = ChatGoogleGenerativeAI(model="gemini-3.1-flash-lite")


def reviewer_agent_node(state: ProjectState) -> dict:
    """Take Project name with user prompt and convert it into Requirements"""
    print("===== Reviewer Agent Working.... ===== ")
    project_name = state['project_name']
    backend = state['backend']
    deployment = state['deployment']
    api = state["api"]
    frontend=state["frontend"]
    ai_design=state["ai_design"]
    database = state["database"]
    requirements = state["requirements"]


    chain = REVIEW_PROMPT | model
    
    result = chain.invoke({
        "project_name": project_name,
        "backend": backend,
        "deployment":deployment,
        "api":api,
        "frontend":frontend,
        "ai_design":ai_design,
        "database":database,
        "requirements":requirements
        
    })
    
    return {
        "review_score": result.text
    }

