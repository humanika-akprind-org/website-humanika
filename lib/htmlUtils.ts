// Function to convert HTML to plain text with formatting
export const convertHtmlToText = (html: string): string => {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;

  // Handle lists first
  const uls = tmp.querySelectorAll("ul");
  uls.forEach((ul) => {
    const lis = ul.querySelectorAll("li");
    lis.forEach((li) => {
      li.textContent = "• " + li.textContent + "\n";
    });
  });

  const ols = tmp.querySelectorAll("ol");
  ols.forEach((ol) => {
    const lis = ol.querySelectorAll("li");
    lis.forEach((li, index) => {
      li.textContent = index + 1 + ". " + li.textContent + "\n";
    });
  });

  // Handle other common HTML elements
  const elements = tmp.querySelectorAll(
    "p, br, div, h1, h2, h3, h4, h5, h6, strong, b, em, i, u, s, del, a, blockquote, img, hr, pre, code, span, table, tr, td, th"
  );
  elements.forEach((el) => {
    if (el.tagName === "BR") {
      el.textContent = "\n";
    } else if (el.tagName === "P" || el.tagName === "DIV") {
      el.textContent = el.textContent + "\n\n";
    } else if (["H1", "H2", "H3", "H4", "H5", "H6"].includes(el.tagName)) {
      el.textContent = el.textContent?.toUpperCase() + "\n\n";
    } else if (el.tagName === "STRONG" || el.tagName === "B") {
      el.textContent = "**" + el.textContent + "**";
    } else if (el.tagName === "EM" || el.tagName === "I") {
      el.textContent = "*" + el.textContent + "*";
    } else if (el.tagName === "U") {
      el.textContent = "__" + el.textContent + "__";
    } else if (el.tagName === "S" || el.tagName === "DEL") {
      el.textContent = "~~" + el.textContent + "~~";
    } else if (el.tagName === "A") {
      const href = el.getAttribute("href");
      el.textContent = "[" + el.textContent + "](" + (href || "") + ")";
    } else if (el.tagName === "BLOCKQUOTE") {
      el.textContent = "> " + el.textContent + "\n";
    } else if (el.tagName === "IMG") {
      const alt = el.getAttribute("alt") || "image";
      el.textContent = "[" + alt + "]";
    } else if (el.tagName === "HR") {
      el.textContent = "\n---\n";
    } else if (el.tagName === "PRE") {
      el.textContent = "```\n" + el.textContent + "\n```\n";
    } else if (el.tagName === "CODE") {
      el.textContent = "`" + el.textContent + "`";
    } else if (el.tagName === "SPAN") {
      // For font colors, highlights, etc., keep as is since hard to represent in plain text
    } else if (el.tagName === "TABLE") {
      // Simple table handling: flatten cells
      const rows = el.querySelectorAll("tr");
      rows.forEach((row) => {
        const cells = row.querySelectorAll("td, th");
        cells.forEach((cell) => {
          cell.textContent = cell.textContent + " | ";
        });
        row.textContent = "| " + row.textContent + "\n";
      });
      el.textContent = el.textContent + "\n";
    }
    // For indent, if has margin-left, add spaces (simple check)
    const style = el.getAttribute("style");
    if (style && style.includes("margin-left")) {
      const match = style.match(/margin-left:\s*(\d+)px/);
      if (match) {
        const indent = Math.floor(parseInt(match[1]) / 20); // rough estimate
        el.textContent = " ".repeat(indent) + el.textContent;
      }
    }
  });

  return tmp.textContent || tmp.innerText || "";
};

// Helper function to convert HSL to hex
function hslToHex(hsl: string): string | undefined {
  const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) return undefined;
  const h = parseInt(match[1]) / 360;
  const s = parseInt(match[2]) / 100;
  const l = parseInt(match[3]) / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;
  if (0 <= h && h < 1 / 6) {
    r = c;
    g = x;
    b = 0;
  } else if (1 / 6 <= h && h < 2 / 6) {
    r = x;
    g = c;
    b = 0;
  } else if (2 / 6 <= h && h < 3 / 6) {
    r = 0;
    g = c;
    b = x;
  } else if (3 / 6 <= h && h < 4 / 6) {
    r = 0;
    g = x;
    b = c;
  } else if (4 / 6 <= h && h < 5 / 6) {
    r = x;
    g = 0;
    b = c;
  } else if (5 / 6 <= h && h < 1) {
    r = c;
    g = 0;
    b = x;
  }
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);
  return ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
}

// Function to parse element to TextRuns for docx
function parseElementToTextRuns(element: Element): any[] {
  const textRuns: any[] = [];
  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || "";
      if (text.trim()) {
        const run: any = { text };
        // Check parent styles
        let parent = node.parentElement;
        while (parent) {
          if (parent.tagName === "STRONG" || parent.tagName === "B") {
            run.bold = true;
          }
          if (parent.tagName === "EM" || parent.tagName === "I") {
            run.italics = true;
          }
          if (parent.tagName === "U") {
            run.underline = {};
          }
          if (parent.tagName === "S" || parent.tagName === "DEL") {
            run.strike = true;
          }
          if (parent.tagName === "SPAN") {
            const style = parent.getAttribute("style");
            if (style) {
              const colorMatch = style.match(/color:\s*hsl\([^)]+\)/);
              if (colorMatch) {
                const hex = hslToHex(colorMatch[0]);
                if (hex) run.color = hex;
              }
              const bgMatch = style.match(/background-color:\s*hsl\([^)]+\)/);
              if (bgMatch) {
                const hex = hslToHex(bgMatch[0]);
                if (hex) run.highlight = hex;
              }
            }
          }
          parent = parent.parentElement;
        }
        textRuns.push(run);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      if (el.tagName === "BR") {
        textRuns.push({ text: "\n" });
      } else {
        el.childNodes.forEach(walk);
      }
    }
  };
  walk(element);
  return textRuns;
}

// Function to get alignment from style
function getAlignment(style: string | null): string | undefined {
  if (!style) return undefined;
  if (style.includes("text-align:center")) return "center";
  if (style.includes("text-align:left")) return "left";
  if (style.includes("text-align:right")) return "right";
  if (style.includes("text-align:justify")) return "both";
  return undefined;
}

// Function to convert HTML to docx Paragraphs and Tables
export function convertHtmlToDocxElements(html: string): any[] {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  const elements: any[] = [];

  tmp.childNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      if (el.tagName === "P" || el.tagName === "DIV") {
        const alignment = getAlignment(el.getAttribute("style"));
        const textRuns = parseElementToTextRuns(el);
        if (textRuns.length) {
          elements.push({
            type: "paragraph",
            children: textRuns,
            alignment,
          });
        }
      } else if (["H1", "H2", "H3", "H4", "H5", "H6"].includes(el.tagName)) {
        const textRuns = parseElementToTextRuns(el);
        if (textRuns.length) {
          elements.push({
            type: "paragraph",
            children: textRuns.map((run) => ({
              ...run,
              bold: true,
              size: el.tagName === "H1" ? 32 : el.tagName === "H2" ? 28 : 24,
            })),
            alignment: "center",
          });
        }
      } else if (el.tagName === "UL") {
        el.querySelectorAll("li").forEach((li) => {
          const textRuns = parseElementToTextRuns(li);
          if (textRuns.length) {
            elements.push({
              type: "paragraph",
              children: [{ text: "• " }, ...textRuns],
            });
          }
        });
      } else if (el.tagName === "OL") {
        el.querySelectorAll("li").forEach((li, index) => {
          const textRuns = parseElementToTextRuns(li);
          if (textRuns.length) {
            elements.push({
              type: "paragraph",
              children: [{ text: `${index + 1}. ` }, ...textRuns],
            });
          }
        });
      } else if (el.tagName === "BLOCKQUOTE") {
        const textRuns = parseElementToTextRuns(el);
        if (textRuns.length) {
          elements.push({
            type: "paragraph",
            children: [{ text: "> " }, ...textRuns],
            indent: { left: 720 },
          });
        }
      } else if (el.tagName === "FIGURE" && el.classList.contains("table")) {
        const tableEl = el.querySelector("table");
        if (tableEl) {
          const rows = tableEl.querySelectorAll("tr");
          const tableRows = Array.from(rows).map((row) => {
            const cells = row.querySelectorAll("td, th");
            return {
              children: Array.from(cells).map((cell) => ({
                children: parseElementToTextRuns(cell),
              })),
            };
          });
          elements.push({
            type: "table",
            rows: tableRows,
          });
        }
      } else if (el.tagName === "A") {
        const textRuns = parseElementToTextRuns(el);
        if (textRuns.length) {
          elements.push({
            type: "paragraph",
            children: textRuns.map((run) => ({ ...run, style: "Hyperlink" })),
          });
        }
      } else {
        // Default to paragraph
        const textRuns = parseElementToTextRuns(el);
        if (textRuns.length) {
          elements.push({
            type: "paragraph",
            children: textRuns,
          });
        }
      }
    }
  });

  return elements;
}
