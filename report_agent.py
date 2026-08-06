from state import ProjectState
from text_to_pdf import text_to_pdf
def report_agent(state: ProjectState):
    """Generate Pdfs of every document"""
    print("Report Agent is generating Reports")
    requirements= state["requirements"]
    database= state["database"]
    backend= state["backend"]
    frontend= state["frontend"]
    api= state["api"]
    ai_design = state["ai_design"]
    devops = state["deployment"]
    timeline = state["timeline"]
    cost = state["cost"]

    text_to_pdf(requirements , "reports/requirements.pdf")
    print("===== Requirements report Generated.... ===== ")
    text_to_pdf(database , "reports/database.pdf")
    print("===== Database report Generated.... ===== ")
    text_to_pdf(backend , "reports/backend.pdf")
    print("===== Backend report Generated.... ===== ")
    text_to_pdf(frontend , "reports/frontend.pdf")
    print("===== Frontend report Generated.... ===== ")
    text_to_pdf(api , "reports/api.pdf")
    print("===== Api report Generated.... ===== ")
    text_to_pdf(ai_design , "reports/ai_design.pdf")
    print("===== Ai_design report Generated.... ===== ")
    text_to_pdf(devops , "reports/devops.pdf")
    print("===== DevOPS report Generated.... ===== ")
    text_to_pdf(timeline , "reports/timeline.pdf")
    print("===== TimeLine report Generated.... ===== ")
    text_to_pdf(cost , "reports/cost.pdf")
    print("===== Cost report Generated.... ===== ")    

    