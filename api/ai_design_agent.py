from state import ProjectState
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from prompts import AI_PROMPT
from text_to_pdf import text_to_pdf
from dotenv import load_dotenv
load_dotenv()
from rich import print

model = ChatGoogleGenerativeAI(model="gemini-3.1-flash-lite")


def Ai_agent_node(state: ProjectState) -> dict:
    """Take Project name with user prompt and convert it into Requirements"""
    print("===== Ai_design Agent Working.... ===== ")
    project_name = state['project_name']
    requirements = state['requirements']

    chain = AI_PROMPT | model
    
    result = chain.invoke({
        "project_name": project_name,
        "requirements": requirements,
    })
    
    return {
        "ai_design": result.text
    }

