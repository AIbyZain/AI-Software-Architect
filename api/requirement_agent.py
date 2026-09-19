from state import ProjectState
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from prompts import REQUIREMENTS_PROMPT
from text_to_pdf import text_to_pdf
from dotenv import load_dotenv
load_dotenv()
from rich import print

model = ChatGoogleGenerativeAI(model="gemini-3.1-flash-lite")


def Requirement_agent_node(state: ProjectState) -> dict:
    """Take Project name with user prompt and convert it into Requirements"""
    print("===== Requirements Agent Working.... ===== ")
    project_name = state['project_name']
    user_prompt = state['user_prompt']

    chain = REQUIREMENTS_PROMPT | model
    
    result = chain.invoke({
        "project_name": project_name,
        "user_prompt": user_prompt
    })
    
    return {
        "requirements": result.text
    }

