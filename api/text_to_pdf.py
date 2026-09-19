from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Preformatted,
    Table,
    TableStyle,
    HRFlowable,
    KeepTogether,
)
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from reportlab.pdfbase.pdfmetrics import stringWidth
import re


# ----------------------------------------------------------------------
# Color palette (kept in one place so the whole document stays consistent)
# ----------------------------------------------------------------------
NAVY = HexColor("#1E3A8A")
BLUE = HexColor("#2563EB")
SLATE = HexColor("#334155")
LIGHT_GREY = HexColor("#94A3B8")
RULE_GREY = HexColor("#CBD5E1")
CODE_BG = HexColor("#F1F5F9")
CODE_BORDER = HexColor("#CBD5E1")


def _header_footer(canvas, doc, doc_title):
    """Draws a running header rule + title and a footer with page numbers."""
    canvas.saveState()

    page_width, page_height = letter

    # ---- Header ----
    if doc.page > 1:
        canvas.setStrokeColor(RULE_GREY)
        canvas.setLineWidth(0.6)
        canvas.line(45, page_height - 34, page_width - 45, page_height - 34)

        canvas.setFont("Helvetica", 8.5)
        canvas.setFillColor(LIGHT_GREY)
        canvas.drawString(45, page_height - 28, doc_title)

    # ---- Footer ----
    canvas.setStrokeColor(RULE_GREY)
    canvas.setLineWidth(0.6)
    canvas.line(45, 40, page_width - 45, 40)

    canvas.setFont("Helvetica", 8.5)
    canvas.setFillColor(LIGHT_GREY)
    canvas.drawCentredString(page_width / 2, 28, f"Page {doc.page}")

    canvas.restoreState()


def text_to_pdf(text: str, filename: str = "output.pdf") -> str:
    """
    Convert Markdown-like text into a polished, professional-looking PDF.

    Supports:
    - # Headings (rendered as a cover-style document title with a rule beneath)
    - ## Subheadings
    - ### Smaller headings
    - #### Minor headings
    - Bullet lists
    - Numbered lists
    - Code blocks (```...```)
    - Bold / italic inline text
    - Paragraph spacing

    The text content and structure are unchanged — only the visual
    presentation (typography, color, spacing, rules, headers/footers,
    list styling) is upgraded to look like a professionally typeset
    document rather than a plain default PDF.
    """

    # Try to find a title (first "# " line) to use in the running header.
    doc_title_match = re.search(r"^#\s+(.*)$", text, re.MULTILINE)
    running_title = doc_title_match.group(1).strip() if doc_title_match else ""

    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        topMargin=64,
        bottomMargin=56,
        leftMargin=52,
        rightMargin=52,
        title=running_title or "Document",
    )

    styles = getSampleStyleSheet()

    # ------------------------------------------------------------------
    # Styles
    # ------------------------------------------------------------------
    title_style = ParagraphStyle(
        "DocTitle",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=25,
        leading=30,
        spaceAfter=6,
        textColor=NAVY,
        alignment=TA_CENTER,
    )

    title_rule_space = Spacer(1, 10)

    h1 = ParagraphStyle(
        "H1",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=17,
        leading=21,
        spaceBefore=22,
        spaceAfter=4,
        textColor=NAVY,
    )

    h2 = ParagraphStyle(
        "H2",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=13.5,
        leading=17,
        spaceBefore=16,
        spaceAfter=6,
        textColor=BLUE,
    )

    h3 = ParagraphStyle(
        "H3",
        parent=styles["Heading3"],
        fontName="Helvetica-Bold",
        fontSize=11.5,
        leading=15,
        spaceBefore=12,
        spaceAfter=5,
        textColor=SLATE,
    )

    body = ParagraphStyle(
        "Body",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=10.5,
        leading=16.5,
        spaceAfter=8,
        textColor=HexColor("#1F2937"),
        alignment=TA_JUSTIFY,
    )

    bullet_style = ParagraphStyle(
        "Bullet",
        parent=body,
        leftIndent=22,
        bulletIndent=8,
        spaceAfter=4,
        alignment=TA_LEFT,
    )

    number_style = ParagraphStyle(
        "Number",
        parent=body,
        leftIndent=22,
        bulletIndent=8,
        spaceAfter=4,
        alignment=TA_LEFT,
    )

    code_style = ParagraphStyle(
        "Code",
        parent=styles["Code"],
        fontName="Courier",
        fontSize=8.8,
        leading=12.5,
        textColor=HexColor("#0F172A"),
    )

    # ------------------------------------------------------------------
    # Parse the (unchanged) text into a styled story
    # ------------------------------------------------------------------
    story = []

    in_code = False
    code_lines = []
    seen_title = False

    lines = text.splitlines()

    for line in lines:

        stripped = line.rstrip()

        # ------------------------
        # Code Block
        # ------------------------
        if stripped.strip().startswith("```"):

            if not in_code:
                in_code = True
                code_lines = []
            else:
                code_block = Preformatted("\n".join(code_lines), code_style)
                framed = Table(
                    [[code_block]],
                    colWidths=[doc.width],
                )
                framed.setStyle(
                    TableStyle(
                        [
                            ("BACKGROUND", (0, 0), (-1, -1), CODE_BG),
                            ("BOX", (0, 0), (-1, -1), 0.75, CODE_BORDER),
                            ("LEFTPADDING", (0, 0), (-1, -1), 10),
                            ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                            ("TOPPADDING", (0, 0), (-1, -1), 8),
                            ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                        ]
                    )
                )
                story.append(Spacer(1, 4))
                story.append(framed)
                story.append(Spacer(1, 10))
                in_code = False

            continue

        if in_code:
            code_lines.append(stripped)
            continue

        # Empty line
        if stripped == "":
            story.append(Spacer(1, 6))
            continue

        # ------------------------
        # Title (only the first "# " becomes the big centered title;
        # any subsequent "# " lines are treated like H1 to stay sane)
        # ------------------------
        if stripped.startswith("# "):
            heading_text = _inline_markup(stripped[2:])
            if not seen_title:
                story.append(Paragraph(heading_text, title_style))
                story.append(
                    HRFlowable(
                        width="100%",
                        thickness=1.2,
                        color=NAVY,
                        spaceAfter=16,
                    )
                )
                seen_title = True
            else:
                story.append(Paragraph(heading_text, h1))
                story.append(
                    HRFlowable(
                        width="100%",
                        thickness=0.6,
                        color=RULE_GREY,
                        spaceAfter=8,
                    )
                )
            continue

        # ------------------------
        # Heading 1 (## in the source)
        # ------------------------
        if stripped.startswith("## "):
            story.append(Paragraph(_inline_markup(stripped[3:]), h1))
            story.append(
                HRFlowable(
                    width="100%",
                    thickness=0.6,
                    color=RULE_GREY,
                    spaceAfter=8,
                )
            )
            continue

        # ------------------------
        # Heading 2 (### in the source)
        # ------------------------
        if stripped.startswith("### "):
            story.append(Paragraph(_inline_markup(stripped[4:]), h2))
            continue

        # ------------------------
        # Heading 3 (#### in the source)
        # ------------------------
        if stripped.startswith("#### "):
            story.append(Paragraph(_inline_markup(stripped[5:]), h3))
            continue

        # ------------------------
        # Bullet List
        # ------------------------
        if stripped.startswith(("- ", "* ")):
            story.append(
                Paragraph(
                    _inline_markup(stripped[2:]),
                    bullet_style,
                    bulletText="•",
                )
            )
            continue

        # ------------------------
        # Numbered List
        # ------------------------
        m = re.match(r"^(\d+)\.\s+(.*)$", stripped)
        if m:
            num, content = m.groups()
            story.append(
                Paragraph(
                    _inline_markup(content),
                    number_style,
                    bulletText=f"{num}.",
                )
            )
            continue

        # ------------------------
        # Regular paragraph (bold / italic handled centrally)
        # ------------------------
        story.append(Paragraph(_inline_markup(stripped), body))

    def _on_page(canvas, doc_):
        _header_footer(canvas, doc_, running_title)

    doc.build(story, onFirstPage=_on_page, onLaterPages=_on_page)

    return filename


def _inline_markup(text: str) -> str:
    """Convert **bold** and *italic* markdown into ReportLab XML markup."""
    text = re.sub(r"\*\*(.*?)\*\*", r"<b>\1</b>", text)
    text = re.sub(r"\*(.*?)\*", r"<i>\1</i>", text)
    return text