from state import ProjectState
from api_agent import Api_agent_node
from backend_agent import Backend_agent_node
from frontend_agent import Frontend_agent_node
from requirement_agent import Requirement_agent_node
from database_agent import Database_agent_node
from ai_design_agent import Ai_agent_node
from devops_agent import devops_agent_node
from cost_agent import cost_agent_node
from timeline_agent import timeline_agent_node
from reviewer_agent import reviewer_agent_node
from report_agent import report_agent

from langchain_google_genai import ChatGoogleGenerativeAI
from rich import print
from langgraph.graph import StateGraph , START ,END

graph = StateGraph(ProjectState)

graph.add_node("api_node" , Api_agent_node)
graph.add_node("backend_node" , Backend_agent_node)
graph.add_node("frontend_node" , Frontend_agent_node)
graph.add_node("requirements_node" , Requirement_agent_node)
graph.add_node("database_node" , Database_agent_node)
graph.add_node("report_agent" , report_agent)
graph.add_node("ai_agent" , Ai_agent_node)
graph.add_node("devops_agent" , devops_agent_node)
graph.add_node("cost_agent" , cost_agent_node)
graph.add_node("timeline_agent" , timeline_agent_node)
graph.add_node("review_agent" , reviewer_agent_node)


graph.add_edge(START , "requirements_node")
graph.add_edge("requirements_node" , "database_node")
graph.add_edge("database_node" , "frontend_node")
graph.add_edge("database_node" ,"backend_node")
graph.add_edge("database_node" , "api_node")
graph.add_edge("database_node" , "ai_agent")
graph.add_edge("database_node" , "devops_agent")
graph.add_edge("database_node" , "timeline_agent")
graph.add_edge("database_node" , "cost_agent")

graph.add_edge(
    ["frontend_node", "backend_node", "api_node" ,
      "ai_agent" ,"devops_agent" , "timeline_agent" ,  
      "cost_agent"],
    "report_agent"
)

graph.add_edge("report_agent" , "review_agent")
graph.add_edge("review_agent" , END)

app = graph.compile()

# model = ChatGoogleGenerativeAI(model="gemini-3.1-flash-lite")
# user_prompt = input("Enter Project ideas: ")
# project_name = model.invoke("""
# You are an AI assistant that extracts a concise software project name from a user's project description.

# Rules:
# - Return ONLY the project name.
# - Use 2–5 words whenever possible.
# - Make it descriptive and professional.
# - Do not include explanations, quotes, markdown, or punctuation unless it is part of the name.
# - If the user already provides a project name, use it.
# - If no name is provided, generate an appropriate one based on the description.

# """)


# inital_state = {
#     "project_name": project_name,
#     "user_prompt": user_prompt,
#     "requirements": "",
#     "database": "",
#     "backend": "",
#     "frontend": "",
#     "api": "",
#     "ai_design": "",
#     "deployment": "",
#     "timeline": "",
#     "cost": "",
#     "review_score": 0.0,
#     "messages": []
# }
# final_state = app.invoke(inital_state)
# print(f'Review : {final_state["review_score"]}')
