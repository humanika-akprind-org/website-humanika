// Function to convert HTML to plain text with formatting
export const convertHtmlToText = (html: string): string => {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;

  // Handle common HTML elements
  const elements = tmp.querySelectorAll(
    "p, br, div, li, h1, h2, h3, h4, h5, h6, strong, b, em, i, u"
  );
  elements.forEach((el) => {
    if (el.tagName === "BR") {
      el.textContent = "\n";
    } else if (el.tagName === "P" || el.tagName === "DIV") {
      el.textContent = el.textContent + "\n\n";
    } else if (el.tagName === "LI") {
      el.textContent = "• " + el.textContent + "\n";
    } else if (["H1", "H2", "H3", "H4", "H5", "H6"].includes(el.tagName)) {
      el.textContent = el.textContent?.toUpperCase() + "\n\n";
    } else if (el.tagName === "STRONG" || el.tagName === "B") {
      el.textContent = el.textContent; // Keep as is for now
    } else if (el.tagName === "EM" || el.tagName === "I") {
      el.textContent = el.textContent; // Keep as is for now
    }
  });

  return tmp.textContent || tmp.innerText || "";
};
