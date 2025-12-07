import parse, { domToReact, Element, type DOMNode } from "html-react-parser";

interface HtmlRendererProps {
  html: string;
  className?: string;
}

export default function HtmlRenderer({
  html,
  className = "",
}: HtmlRendererProps) {
  const getAlignmentClass = (style: string | undefined) => {
    if (!style) return "";
    if (style.includes("text-align:center")) return "text-center";
    if (style.includes("text-align:right")) return "text-right";
    if (style.includes("text-align:justify")) return "text-justify";
    if (style.includes("text-align:left")) return "text-left";
    return "";
  };

  const options = {
    replace: (domNode: DOMNode): React.ReactElement | null | undefined => {
      if (domNode instanceof Element) {
        // Handle table elements
        if (domNode.name === "table") {
          return (
            <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
              {domToReact(domNode.children as DOMNode[], options)}
            </table>
          );
        }

        if (domNode.name === "thead") {
          return (
            <thead className="bg-gray-50">
              {domToReact(domNode.children as DOMNode[], options)}
            </thead>
          );
        }

        if (domNode.name === "tbody") {
          return (
            <tbody className="bg-white divide-y divide-gray-200">
              {domToReact(domNode.children as DOMNode[], options)}
            </tbody>
          );
        }

        if (domNode.name === "tr") {
          return <tr>{domToReact(domNode.children as DOMNode[], options)}</tr>;
        }

        if (domNode.name === "th") {
          return (
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {domToReact(domNode.children as DOMNode[], options)}
            </th>
          );
        }

        if (domNode.name === "td") {
          return (
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {domToReact(domNode.children as DOMNode[], options)}
            </td>
          );
        }

        // Handle list elements
        if (domNode.name === "ul") {
          return (
            <ul className="list-disc list-inside space-y-1">
              {domToReact(domNode.children as DOMNode[], options)}
            </ul>
          );
        }

        if (domNode.name === "ol") {
          return (
            <ol className="list-decimal list-inside space-y-1">
              {domToReact(domNode.children as DOMNode[], options)}
            </ol>
          );
        }

        if (domNode.name === "li") {
          return (
            <li className="text-gray-700">
              {domToReact(domNode.children as DOMNode[], options)}
            </li>
          );
        }

        // Handle heading elements
        if (domNode.name === "h1") {
          return (
            <h1
              className={`text-2xl font-bold text-gray-900 mb-4 ${getAlignmentClass(
                domNode.attribs?.style
              )}`}
            >
              {domToReact(domNode.children as DOMNode[], options)}
            </h1>
          );
        }

        if (domNode.name === "h2") {
          return (
            <h2
              className={`text-xl font-bold text-gray-900 mb-3 ${getAlignmentClass(
                domNode.attribs?.style
              )}`}
            >
              {domToReact(domNode.children as DOMNode[], options)}
            </h2>
          );
        }

        if (domNode.name === "h3") {
          return (
            <h3
              className={`text-lg font-semibold text-gray-900 mb-2 ${getAlignmentClass(
                domNode.attribs?.style
              )}`}
            >
              {domToReact(domNode.children as DOMNode[], options)}
            </h3>
          );
        }

        if (domNode.name === "h4") {
          return (
            <h4
              className={`text-base font-semibold text-gray-900 mb-2 ${getAlignmentClass(
                domNode.attribs?.style
              )}`}
            >
              {domToReact(domNode.children as DOMNode[], options)}
            </h4>
          );
        }

        if (domNode.name === "h5") {
          return (
            <h5
              className={`text-sm font-semibold text-gray-900 mb-1 ${getAlignmentClass(
                domNode.attribs?.style
              )}`}
            >
              {domToReact(domNode.children as DOMNode[], options)}
            </h5>
          );
        }

        if (domNode.name === "h6") {
          return (
            <h6
              className={`text-xs font-semibold text-gray-900 mb-1 ${getAlignmentClass(
                domNode.attribs?.style
              )}`}
            >
              {domToReact(domNode.children as DOMNode[], options)}
            </h6>
          );
        }

        // Handle paragraph with alignment support
        if (domNode.name === "p") {
          return (
            <p
              className={`text-gray-700 mb-4 ${getAlignmentClass(
                domNode.attribs?.style
              )}`}
            >
              {domToReact(domNode.children as DOMNode[], options)}
            </p>
          );
        }

        // Handle blockquote
        if (domNode.name === "blockquote") {
          return (
            <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4">
              {domToReact(domNode.children as DOMNode[], options)}
            </blockquote>
          );
        }

        // Handle links
        if (domNode.name === "a") {
          const href = domNode.attribs?.href || "#";
          return (
            <a
              href={href}
              className="text-blue-600 hover:text-blue-800 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {domToReact(domNode.children as DOMNode[], options)}
            </a>
          );
        }

        // Handle text formatting
        if (domNode.name === "strong" || domNode.name === "b") {
          return (
            <strong className="font-semibold">
              {domToReact(domNode.children as DOMNode[], options)}
            </strong>
          );
        }

        if (domNode.name === "em" || domNode.name === "i") {
          return (
            <em className="italic">
              {domToReact(domNode.children as DOMNode[], options)}
            </em>
          );
        }

        if (domNode.name === "u") {
          return (
            <u className="underline">
              {domToReact(domNode.children as DOMNode[], options)}
            </u>
          );
        }

        if (domNode.name === "span") {
          let className = "";
          const style = domNode.attribs?.style;

          if (style) {
            // Handle color styles
            const colorMatch = style.match(
              /color:\s*(hsl\([^)]+\)|#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3})/
            );
            if (colorMatch) {
              className += ` text-[${colorMatch[1]}]`;
            }

            // Handle background color
            const bgMatch = style.match(
              /background-color:\s*(hsl\([^)]+\)|#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3})/
            );
            if (bgMatch) {
              className += ` bg-[${bgMatch[1]}]`;
            }

            // Handle text alignment
            if (style.includes("text-align:center")) {
              className += " text-center";
            } else if (style.includes("text-align:right")) {
              className += " text-right";
            } else if (style.includes("text-align:justify")) {
              className += " text-justify";
            } else if (style.includes("text-align:left")) {
              className += " text-left";
            }
          }

          return (
            <span className={className.trim()}>
              {domToReact(domNode.children as DOMNode[], options)}
            </span>
          );
        }

        // Handle figure with table class
        if (
          domNode.name === "figure" &&
          domNode.attribs?.class?.includes("table")
        ) {
          return (
            <div className="overflow-x-auto my-4">
              {domToReact(domNode.children as DOMNode[], options)}
            </div>
          );
        }
      }
      // Return null for unhandled nodes to let html-react-parser handle them
      return null;
    },
  };

  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      {parse(html, options)}
    </div>
  );
}
