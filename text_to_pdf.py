from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Preformatted
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.colors import HexColor
from reportlab.pdfbase.pdfmetrics import stringWidth
import re


def text_to_pdf(text: str, filename: str = "output.pdf") -> str:
    """
    Convert Markdown-like text into a well-formatted PDF.

    Supports:
    - # Headings
    - ## Subheadings
    - ### Smaller headings
    - Bullet lists
    - Numbered lists
    - Code blocks (```...```)
    - Paragraph spacing
    """

    doc = SimpleDocTemplate(
        filename,
        topMargin=40,
        bottomMargin=40,
        leftMargin=45,
        rightMargin=45,
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "Title",
        parent=styles["Heading1"],
        fontSize=24,
        spaceAfter=18,
        textColor=HexColor("#1E3A8A"),
        alignment=TA_CENTER,
    )

    h1 = ParagraphStyle(
        "H1",
        parent=styles["Heading1"],
        fontSize=18,
        spaceBefore=16,
        spaceAfter=10,
        textColor=HexColor("#1E3A8A"),
    )

    h2 = ParagraphStyle(
        "H2",
        parent=styles["Heading2"],
        fontSize=15,
        spaceBefore=14,
        spaceAfter=8,
        textColor=HexColor("#2563EB"),
    )

    h3 = ParagraphStyle(
        "H3",
        parent=styles["Heading3"],
        fontSize=13,
        spaceBefore=12,
        spaceAfter=6,
    )

    body = ParagraphStyle(
        "Body",
        parent=styles["BodyText"],
        fontSize=10.5,
        leading=18,
        spaceAfter=6,
    )

    bullet = ParagraphStyle(
        "Bullet",
        parent=body,
        leftIndent=20,
        bulletIndent=10,
    )

    code_style = ParagraphStyle(
        "Code",
        parent=styles["Code"],
        fontName="Courier",
        fontSize=9,
        backColor=HexColor("#F3F4F6"),
        borderPadding=8,
        leading=13,
    )

    story = []

    in_code = False
    code_lines = []

    lines = text.splitlines()

    for line in lines:

        stripped = line.rstrip()

        # ------------------------
        # Code Block
        # ------------------------
        if stripped.startswith("```"):

            if not in_code:
                in_code = True
                code_lines = []
            else:
                story.append(
                    Preformatted(
                        "\n".join(code_lines),
                        code_style
                    )
                )
                story.append(Spacer(1, 12))
                in_code = False

            continue

        if in_code:
            code_lines.append(stripped)
            continue

        # Empty line
        if stripped == "":
            story.append(Spacer(1, 8))
            continue

        # ------------------------
        # Title
        # ------------------------
        if stripped.startswith("# "):
            story.append(
                Paragraph(stripped[2:], title_style)
            )
            continue

        # ------------------------
        # Heading 1
        # ------------------------
        if stripped.startswith("## "):
            story.append(
                Paragraph(stripped[3:], h1)
            )
            continue

        # ------------------------
        # Heading 2
        # ------------------------
        if stripped.startswith("### "):
            story.append(
                Paragraph(stripped[4:], h2)
            )
            continue

        # ------------------------
        # Heading 3
        # ------------------------
        if stripped.startswith("#### "):
            story.append(
                Paragraph(stripped[5:], h3)
            )
            continue

        # ------------------------
        # Bullet List
        # ------------------------
        if stripped.startswith(("- ", "* ")):
            story.append(
                Paragraph(
                    stripped[2:],
                    bullet,
                    bulletText="•"
                )
            )
            continue

        # ------------------------
        # Numbered List
        # ------------------------
        if re.match(r"^\d+\.", stripped):
            story.append(
                Paragraph(stripped, body)
            )
            continue

        # ------------------------
        # Bold text
        # ------------------------
        stripped = re.sub(
            r"\*\*(.*?)\*\*",
            r"<b>\1</b>",
            stripped,
        )

        # Italic text
        stripped = re.sub(
            r"\*(.*?)\*",
            r"<i>\1</i>",
            stripped,
        )

        story.append(
            Paragraph(stripped, body)
        )

    doc.build(story)

    return filename